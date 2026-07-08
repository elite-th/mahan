"use client";

import React from 'react';

/**
 * Centralized icon library.
 *
 * All reusable SVG icons live here so they can be imported from a single
 * location: `@/components/ui/icons`. Each icon accepts the shared `IconProps`
 * (size + className + any native SVG attribute).
 *
 * Icons are kept as inline SVG paths rather than a third-party icon set to
 * avoid bundle bloat and to keep full control over stroke widths.
 */

export interface IconProps extends React.SVGProps<SVGSVGElement> {
    size?: number | string;
}

// Default icon sizing if not provided via props or className
const DEFAULT_SIZE = 24;

// Helper to keep each icon definition terse & consistent
const make =
    (paths: React.ReactNode, strokeWidth: number = 1.5): React.FC<IconProps> =>
    ({ size = DEFAULT_SIZE, className = "", ...props }) => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={strokeWidth}
            stroke="currentColor"
            width={size}
            height={size}
            className={className}
            {...props}
        >
            {paths}
        </svg>
    );

// --- Commerce / UI ---

export const ShoppingCartIcon = make(
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
);

export const UserCircleIcon = make(
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
);

export const ChevronDownIcon = make(
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />,
    2
);

export const EyeIcon = make(
    <>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.432 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </>
);

export const EyeSlashIcon = make(
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.243 4.243L6.228 6.228" />
);

// --- Cart ---

export const TrashIcon = make(
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12.56 0c1.153 0 2.24.032 3.22.094m7.072 0l-.072.072M7.5 7.5h9M7.5 12h9m-9 5.25h9M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.25 2.25 0 002.25 2.25h13.5a2.25 2.25 0 002.25-2.25V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
);

// --- Product page ---

export const ShareIcon = make(
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.19.02.38.05.57.092m0 0a2.25 2.25 0 100 2.186m0-2.186c-.19.02-.38.05-.57.092m12.283-1.642a2.25 2.25 0 100 2.186m0-2.186c-.19.02-.38.05-.57.092m0 0a2.25 2.25 0 100 2.186m0-2.186c.19.02.38.05.57.092M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
);

export const ArrowLeftIcon = make(
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />,
    2
);

// --- Filters / Search ---

export const FilterIcon = make(
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.572a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
);

export const XMarkIcon = make(
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />,
    2
);

export const SearchIcon = make(
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
);

// --- Toast / Status ---

export const CheckCircleIcon = make(
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
);

export const InfoCircleIcon = make(
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
);

// --- Payment ---

export const CopyIcon = make(
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
);

// --- Error / Glitch (decorative, used on the error boundary) ---

export const GlitchIcon = make(
    <>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.73-.626 1.18-.756l3.566-.713a2.25 2.25 0 002.149-2.326l-.001-3.566a2.25 2.25 0 00-2.326-2.149l-3.566.713a2.25 2.25 0 00-.756 1.18l-3.03 2.496m-3.03-2.496c.384-.317.626-.73.756-1.18l.713-3.566a2.25 2.25 0 00-2.326-2.149L3.32 3.566a2.25 2.25 0 00-2.149 2.326l.001 3.566c.001.62.205 1.2.558 1.69l4.378 4.378m.74-2.585l2.585-2.243" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
    </>
);
