import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorDisplayProps {
  message?: string;
}

/**
 * ErrorDisplay — inline error message for forms and API failures.
 *
 * Uses the site purple theme (not the old red/red-900 palette) and a sober,
 * factual message. The default message is generic; callers can pass a more
 * specific one.
 */
const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  message = 'خطا در برقراری ارتباط با سرور. لطفاً دوباره تلاش کنید.',
}) => (
  <div
    className="text-center p-6 bg-[var(--surface-2)] border border-[var(--border-strong)] rounded-lg my-4"
    role="alert"
  >
    <AlertCircle className="mx-auto h-7 w-7 text-[var(--accent)] mb-2" aria-hidden="true" />
    <p className="text-[var(--text)] font-semibold text-base">خطایی رخ داد</p>
    <p className="text-[var(--text-muted)] text-sm mt-2">{message}</p>
  </div>
);

export default ErrorDisplay;
