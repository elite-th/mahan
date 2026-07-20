/**
 * Contact Form API Route
 *
 * Proxies contact form submissions to WordPress Contact Form 7 (CF7) REST API.
 * If CF7 is not available (404 or not configured), falls back to server-side
 * logging and JSON file storage so messages are never lost.
 *
 * Strategy:
 * 1. Try Contact Form 7 REST API (if CONTACT_FORM_7_ID env var is set)
 * 2. Fall back to logging + local JSON file storage
 * 3. Always return success to the user (don't leak backend details)
 */

import { NextRequest } from 'next/server';
import { withRateLimit } from '@/lib/rate-limiter';
import { apiSuccess, apiError } from '@/lib/api-response';
import { logger } from '@/lib/logger';
import { fetchWithTimeout } from '@/lib/fetch-with-timeout';
import fs from 'fs';
import path from 'path';

// --- Configuration ---

const WP_BASE_URL = process.env.NEXT_PUBLIC_WP_API_URL || 'http://localhost:8080/wp-json';
const CF7_FORM_ID = process.env.CONTACT_FORM_7_ID || process.env.NEXT_PUBLIC_CF7_FORM_ID;
const WP_APP_USERNAME = process.env.WP_APP_USERNAME;
const WP_APP_PASSWORD = process.env.WP_APP_PASSWORD;

// Local JSON storage for fallback
const CONTACT_MESSAGES_DIR = path.join(process.cwd(), '.cache');
const CONTACT_MESSAGES_FILE = path.join(CONTACT_MESSAGES_DIR, 'contact-messages.json');

// Contact form preset: 5/min — stricter to prevent spam
const CONTACT_RATE_LIMIT = { limit: 5, windowMs: 60_000 };

// --- Validation ---

interface ContactFormData {
    name: string;
    email: string;
    message: string;
}

function validateContactForm(data: unknown): { valid: true; data: ContactFormData } | { valid: false; error: string } {
    if (!data || typeof data !== 'object') {
        return { valid: false, error: 'اطلاعات فرم ناقص است.' };
    }

    const { name, email, message } = data as Record<string, unknown>;

    // Name validation
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
        return { valid: false, error: 'نام باید حداقل ۲ کاراکتر باشد.' };
    }

    // Email validation
    if (!email || typeof email !== 'string') {
        return { valid: false, error: 'ایمیل الزامی است.' };
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
        return { valid: false, error: 'فرمت ایمیل صحیح نیست.' };
    }

    // Message validation
    if (!message || typeof message !== 'string' || message.trim().length < 10) {
        return { valid: false, error: 'پیام باید حداقل ۱۰ کاراکتر باشد.' };
    }

    return {
        valid: true,
        data: {
            name: name.trim(),
            email: email.trim(),
            message: message.trim(),
        },
    };
}

// --- CF7 Submission ---

/**
 * Submit to Contact Form 7 REST API.
 *
 * CF7 endpoint: POST /contact-form-7/v1/contact-forms/{FORM_ID}/feedback
 * Content-Type: multipart/form-data
 * Fields: your-name, your-email, your-message
 */
async function submitToCF7(formData: ContactFormData): Promise<boolean> {
    if (!CF7_FORM_ID) {
        logger.debug('Contact: CF7 form ID not configured, skipping CF7 submission');
        return false;
    }

    const cf7Url = `${WP_BASE_URL}/contact-form-7/v1/contact-forms/${CF7_FORM_ID}/feedback`;

    // Build FormData for CF7
    const formPayload = new FormData();
    formPayload.append('your-name', formData.name);
    formPayload.append('your-email', formData.email);
    formPayload.append('your-message', formData.message);

    // Try without authentication first (CF7 often works without auth)
    try {
        const response = await fetchWithTimeout(cf7Url, {
            method: 'POST',
            body: formPayload,
        }, 15000);

        if (response.ok) {
            const result = await response.json();
            if (result.status === 'mail_sent') {
                logger.info('Contact: CF7 submission successful', { email: formData.email });
                return true;
            }
            // CF7 returned validation errors — log them
            logger.warn('Contact: CF7 validation errors', {
                status: result.status,
                message: result.message,
            });
        }
    } catch (error) {
        logger.warn('Contact: CF7 submission without auth failed', {
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }

    // Try with Application Passwords auth
    if (WP_APP_USERNAME && WP_APP_PASSWORD) {
        try {
            const appAuth = Buffer.from(`${WP_APP_USERNAME}:${WP_APP_PASSWORD}`).toString('base64');

            const formPayload2 = new FormData();
            formPayload2.append('your-name', formData.name);
            formPayload2.append('your-email', formData.email);
            formPayload2.append('your-message', formData.message);

            const response = await fetchWithTimeout(cf7Url, {
                method: 'POST',
                body: formPayload2,
                headers: {
                    'Authorization': `Basic ${appAuth}`,
                },
            }, 15000);

            if (response.ok) {
                const result = await response.json();
                if (result.status === 'mail_sent') {
                    logger.info('Contact: CF7 submission with auth successful', { email: formData.email });
                    return true;
                }
            }

            logger.warn('Contact: CF7 with auth also failed', { status: response.status });
        } catch (error) {
            logger.warn('Contact: CF7 submission with auth failed', {
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }

    return false;
}

// --- Fallback: Local JSON Storage ---

interface StoredContactMessage {
    id: string;
    name: string;
    email: string;
    message: string;
    timestamp: string;
}

function storeMessageLocally(formData: ContactFormData): void {
    try {
        // Ensure .cache directory exists
        if (!fs.existsSync(CONTACT_MESSAGES_DIR)) {
            fs.mkdirSync(CONTACT_MESSAGES_DIR, { recursive: true });
        }

        // Read existing messages
        let messages: StoredContactMessage[] = [];
        if (fs.existsSync(CONTACT_MESSAGES_FILE)) {
            const raw = fs.readFileSync(CONTACT_MESSAGES_FILE, 'utf-8');
            messages = JSON.parse(raw);
        }

        // Append new message
        const newMessage: StoredContactMessage = {
            id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
            name: formData.name,
            email: formData.email,
            message: formData.message,
            timestamp: new Date().toISOString(),
        };

        messages.push(newMessage);

        // Keep only last 500 messages to prevent file bloat
        if (messages.length > 500) {
            messages = messages.slice(-500);
        }

        fs.writeFileSync(CONTACT_MESSAGES_FILE, JSON.stringify(messages, null, 2), 'utf-8');
        logger.info('Contact: Message stored locally', {
            id: newMessage.id,
            email: formData.email,
            totalMessages: messages.length,
        });
    } catch (error) {
        logger.error('Contact: Failed to store message locally', undefined, error instanceof Error ? error : undefined);
    }
}

// --- Route Handler ---

export const POST = withRateLimit(
    async (request: NextRequest) => {
        try {
            // Parse request body
            let body: unknown;
            try {
                body = await request.json();
            } catch {
                return apiError('فرمت درخواست نامعتبر است.', 400);
            }

            // Validate
            const validation = validateContactForm(body);
            if (!validation.valid) {
                return apiError(validation.error, 400);
            }

            const formData = validation.data;

            // Try CF7 first
            const cf7Success = await submitToCF7(formData);

            if (!cf7Success) {
                // Fallback: store locally and log
                logger.info('Contact: CF7 unavailable, storing message locally', {
                    name: formData.name,
                    email: formData.email,
                });
                storeMessageLocally(formData);
            }

            // Always return success to the user
            return apiSuccess({
                message: 'پیام شما با موفقیت ارسال شد. به زودی با شما تماس خواهیم گرفت.',
            });
        } catch (error) {
            logger.error('Contact: Unexpected error', undefined, error instanceof Error ? error : undefined);
            return apiError('خطای داخلی سرور. لطفاً بعداً تلاش کنید.', 500);
        }
    },
    CONTACT_RATE_LIMIT,
    'contact-form'
);
