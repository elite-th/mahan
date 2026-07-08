import { useEffect, useRef, useState, type RefObject } from 'react';

/** Options for the useIntersectionObserver hook */
interface UseIntersectionObserverOptions {
    /** Intersection ratio threshold (0–1). Default: 0.1 */
    threshold?: number;
    /** Margin around the root element. Default: '0px' */
    rootMargin?: string;
    /** If true, the observer disconnects after the first intersection. Default: true */
    triggerOnce?: boolean;
}

/**
 * A reusable IntersectionObserver hook that observes a DOM element
 * and returns whether it is currently visible in the viewport.
 *
 * Commonly used for lazy-loading, scroll-triggered animations, and
 * visibility-based rendering optimizations.
 *
 * @param ref - A React ref pointing to the HTMLElement to observe
 * @param options - Optional IntersectionObserver configuration
 * @returns `true` if the element is intersecting the viewport, `false` otherwise
 *
 * @example
 * ```tsx
 * const cardRef = useRef<HTMLDivElement>(null);
 * const isVisible = useIntersectionObserver(cardRef, { threshold: 0.1, triggerOnce: true });
 *
 * return (
 *   <div ref={cardRef} className={isVisible ? 'animate-fade-in' : 'opacity-0'}>
 *     Content
 *   </div>
 * );
 * ```
 */
export function useIntersectionObserver(
    ref: RefObject<HTMLElement | null>,
    options?: UseIntersectionObserverOptions
): boolean {
    const { threshold = 0.1, rootMargin = '0px', triggerOnce = true } = options ?? {};
    const [isVisible, setIsVisible] = useState(false);
    const hasTriggeredRef = useRef(false);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        // If triggerOnce and already triggered, skip observer creation
        if (triggerOnce && hasTriggeredRef.current) {
            setIsVisible(true);
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                const isIntersecting = entry.isIntersecting;
                setIsVisible(isIntersecting);

                if (isIntersecting && triggerOnce) {
                    hasTriggeredRef.current = true;
                    observer.unobserve(entry.target);
                }
            },
            { root: null, rootMargin, threshold }
        );

        observer.observe(element);

        return () => {
            observer.unobserve(element);
        };
    }, [ref, threshold, rootMargin, triggerOnce]);

    return isVisible;
}
