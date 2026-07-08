/**
 * Structured Logger for NewModernVIRA
 *
 * Replaces raw console.* calls with structured, leveled logging.
 * In production: JSON format for log aggregation (Datadog, CloudWatch, etc.)
 * In development: Pretty-printed format for readability
 *
 * Usage:
 *   import { logger } from '@/lib/logger';
 *   logger.info('Order created', { orderId: 123, amount: 50000 });
 *   logger.error('Payment failed', { error: err.message }, err);
 *   logger.warn('Price mismatch', { server: 50000, client: 45000 });
 *
 * SERVER-ONLY: Do not import this from client components.
 * Client components should continue using console.* for browser devtools.
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  service: string;
  [key: string]: unknown;
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const currentLevel: LogLevel = (process.env.LOG_LEVEL as LogLevel) ||
  (process.env.NODE_ENV === 'production' ? 'info' : 'debug');

const SERVICE_NAME = 'vira-store';

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[currentLevel];
}

function formatEntry(level: LogLevel, message: string, data?: Record<string, unknown>, error?: Error): string {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    service: SERVICE_NAME,
    ...(data || {}),
  };

  if (error) {
    entry.errorName = error.name;
    entry.errorMessage = error.message;
    entry.stack = error.stack;
  }

  if (process.env.NODE_ENV === 'production') {
    return JSON.stringify(entry);
  }

  // Development: pretty print
  const color = { debug: '\x1b[36m', info: '\x1b[32m', warn: '\x1b[33m', error: '\x1b[31m' }[level];
  const reset = '\x1b[0m';
  const dataStr = data ? ` ${JSON.stringify(data)}` : '';
  const errorStr = error ? ` | ${error.name}: ${error.message}` : '';
  return `${color}[${entry.timestamp}] ${level.toUpperCase()}${reset} [${SERVICE_NAME}] ${message}${dataStr}${errorStr}`;
}

export const logger = {
  debug(message: string, data?: Record<string, unknown>, error?: Error) {
    if (shouldLog('debug')) process.stdout.write(formatEntry('debug', message, data, error) + '\n');
  },
  info(message: string, data?: Record<string, unknown>, error?: Error) {
    if (shouldLog('info')) process.stdout.write(formatEntry('info', message, data, error) + '\n');
  },
  warn(message: string, data?: Record<string, unknown>, error?: Error) {
    if (shouldLog('warn')) process.stderr.write(formatEntry('warn', message, data, error) + '\n');
  },
  error(message: string, data?: Record<string, unknown>, error?: Error) {
    if (shouldLog('error')) process.stderr.write(formatEntry('error', message, data, error) + '\n');
  },
};
