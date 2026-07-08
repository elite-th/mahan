"use client";

// FIX: Imported React to resolve 'Cannot find namespace' errors.
import React from 'react';
import { useEffect } from 'react';
import Link from 'next/link';
import { GlitchIcon } from '@/components/ui/icons';


export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])
 
  return (
    <div className="flex flex-col items-center justify-center text-center px-4 min-h-[calc(100vh-20rem)]">
        <GlitchIcon className="w-20 h-20 text-sky-500/70 mb-6" />
        <h1 className="text-3xl sm:text-4xl font-extrabold text-sky-400 mb-4">
          اوه! انگار یه چیزی قاطی کرده!
        </h1>
        <p className="text-lg text-gray-400 max-w-xl mx-auto mb-8">
          نگران نباشید، تیم فنی ما همین الان باخبر شد. گاهی وقت‌ها حتی بهترین ربات‌ها هم نیاز به یک استراحت کوتاه دارند.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
            <button
                onClick={() => reset()}
                className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg shadow-md transition-colors duration-300"
            >
                تلاش مجدد
            </button>
            <Link
                href="/"
                className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-gray-200 font-semibold rounded-lg shadow-md transition-colors duration-300"
            >
                بازگشت به خانه
            </Link>
        </div>
    </div>
  )
}
