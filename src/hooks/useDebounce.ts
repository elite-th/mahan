import { useState, useEffect } from 'react';

/**
 * A generic debounce hook that delays updating the returned value
 * until after the specified delay has elapsed since the last change.
 *
 * Useful for delaying expensive operations (e.g. API calls, filtering)
 * until the user has stopped typing or interacting.
 *
 * @typeParam T - The type of the value being debounced
 * @param value - The current value to debounce
 * @param delay - The debounce delay in milliseconds
 * @returns The debounced value, updated only after the delay elapses
 *
 * @example
 * ```tsx
 * const [search, setSearch] = useState('');
 * const debouncedSearch = useDebounce(search, 300);
 *
 * useEffect(() => {
 *   // This effect only fires 300ms after the user stops typing
 *   fetchResults(debouncedSearch);
 * }, [debouncedSearch]);
 * ```
 */
export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}
