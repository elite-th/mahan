import type { Metadata } from 'next';
import Link from 'next/link';
import { COMPANY_NAME } from '@/constants';

export const metadata: Metadata = {
    title: 'صفحه یافت نشد',
    robots: { index: false, follow: true },
};

export default function NotFound() {
    return (
        <section className="flex items-center justify-center min-h-[calc(100vh-10rem)] bg-[var(--bg)] text-[var(--text)] py-12">
            <div className="container mx-auto px-4 text-center">
                <div className="max-w-lg mx-auto">
                    {/* Large 404 number */}
                    <h1 className="text-[8rem] sm:text-[10rem] font-black leading-none tracking-tighter text-[var(--accent)] select-none">
                        404
                    </h1>

                    {/* Divider */}
                    <div className="w-16 h-1 bg-[var(--accent-hover)] mx-auto rounded-full mt-6 mb-8" />

                    {/* Message */}
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text)] mb-4">
                        صفحه مورد نظر یافت نشد
                    </h2>
                    <p className="text-[var(--text-muted)] text-lg mb-10 leading-relaxed">
                        متأسفانه صفحه‌ای که به دنبال آن هستید وجود ندارد یا حذف شده است.
                    </p>

                    {/* Return to home button */}
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-8 py-3.5 bg-[var(--accent)] hover:bg-[var(--accent-press)] text-[var(--bg)] text-lg font-semibold rounded-xl shadow-lg transition-all duration-300 ease-in-out"
                    >
                        بازگشت به صفحه اصلی {COMPANY_NAME}
                    </Link>
                </div>
            </div>
        </section>
    );
}
