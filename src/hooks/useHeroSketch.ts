"use client";

import { useEffect, useRef, useCallback, useState } from 'react';
import type p5 from 'p5'; // Type-only import — erased at compile time, safe for SSR
import { isLowPerformanceDevice } from '@/utils/performance';

/**
 * useHeroSketch — Custom hook for the hero section's p5.js particle animation.
 * 
 * SSR Safety: p5.js is imported dynamically inside createP5Sketch to avoid the
 * "window is not defined" SSR crash. p5.js accesses `window` at module init time.
 * This hook is only used via HeroSketchEngine.tsx which is loaded with
 * `dynamic(() => import(...), { ssr: false })` — but the dynamic import here
 * provides defense-in-depth in case the import chain changes.
 * 
 * Observer Stability: The IntersectionObserver callback uses a ref
 * (createSketchRef) to call the latest createP5Sketch, preventing the observer
 * from being destroyed and recreated when isLowPerf changes. This fixes a bug
 * where the observer was permanently lost after isLowPerf state update, causing
 * the animation to never start.
 */

export const useHeroSketch = (
    sectionRef: React.RefObject<HTMLElement | null>,
    sketchContainerRef: React.RefObject<HTMLDivElement | null>,
    buttonVisRef: React.RefObject<HTMLDivElement | null>,
    realButtonRef: React.RefObject<HTMLButtonElement | null>
) => {
    const p5InstanceRef = useRef<p5 | null>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);
    const isObserverSetup = useRef(false);
    const isCancelledRef = useRef(false); // Guard against unmount during async import
    const isCreatingRef = useRef(false); // Guard against double sketch creation
    const [isLowPerf, setIsLowPerf] = useState(false);
    const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    
    // Ref to always hold the latest createP5Sketch callback.
    // This allows the IntersectionObserver to call the latest version
    // without needing to be recreated when isLowPerf changes.
    const createSketchRef = useRef<() => void>(() => {});

    useEffect(() => {
        setIsLowPerf(isLowPerformanceDevice());
        return () => { isCancelledRef.current = true; };
    }, []);

    const createP5Sketch = useCallback(async () => {
        if (!sketchContainerRef.current || p5InstanceRef.current || isCreatingRef.current) {
            return;
        }
        isCreatingRef.current = true;

        try {
            // Lazy import p5 to avoid SSR "window is not defined" crash
            const p5Module = await import('p5');
            const P5Constructor = p5Module.default;

            // Guard: component may have unmounted while awaiting the dynamic import
            if (isCancelledRef.current || !sketchContainerRef.current) return;

            const sketch = (p: p5) => {
                const isTouchDevice = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);

                const config = {
                    particleCount: 450,
                    loopDuration: 8000,
                    // Vivid purple palette — core accent #8E3BFF (logo violet) is the
                    // star, with bright whites and muted iris for variety. Brighter
                    // than before so particles read as points of light, not dust.
                    colorPalette: ['#FBF7FE', '#CFC6E0', '#8E3BFF', '#A56BFF', '#8E3BFF'],
                    mouseEffectRadius: 250,
                    mouseEffectRadiusSq: 250 * 250,
                    activatedLoopDuration: 2000,
                    baseParticleSize: { min: 2.5, max: 6 },
                    targetFPS: 60
                };

                const updateConfigForScreenSize = () => {
                    if (isLowPerf) {
                        config.particleCount = p.width < 768 ? 120 : 180;
                        config.mouseEffectRadius = 0; // Disable mouse interaction entirely
                        config.baseParticleSize = { min: 2, max: 4 };
                        config.targetFPS = 30;
                    } else if (p.width < 768) {
                        config.particleCount = 220;
                        config.mouseEffectRadius = 150;
                        config.baseParticleSize = { min: 2, max: 4 };
                        config.targetFPS = 45; // Throttle FPS on mobile
                    } else {
                        config.particleCount = 450;
                        config.mouseEffectRadius = 250;
                        config.baseParticleSize = { min: 2.5, max: 6 };
                        config.targetFPS = 60;
                    }
                    config.mouseEffectRadiusSq = config.mouseEffectRadius * config.mouseEffectRadius;
                };

                let particles: Particle[] = [];
                let buttonEl: HTMLElement | null;
                let buttonRect: DOMRect;
                let isActivated = false;
                let activationLevel = 0;
                let currentLoopDuration: number;

                class Particle {
                    flowDirection: 'ltr' | 'rtl';
                    baseSize: number;
                    baseColor: p5.Color;
                    phaseOffset: number;
                    laneY: number;  // each particle's own Y lane across full screen
                    laneOffset: number;

                    constructor() {
                        this.flowDirection = p.random() > 0.5 ? 'ltr' : 'rtl';
                        this.baseSize = p.random(config.baseParticleSize.min, config.baseParticleSize.max);
                        this.baseColor = p.color(p.random(config.colorPalette));
                        this.phaseOffset = p.random(1.0);
                        // Spread particles across the FULL screen height (not just button midY)
                        this.laneY = p.random(0, p.height);
                        this.laneOffset = p.random(-30, 30);  // small vertical jitter for organic feel
                    }

                    getPointOnPath(progress: number) {
                        // Horizontal path: x goes from -50 to width+50
                        const x = p.lerp(-50, p.width + 50, progress);
                        // Funnel effect: particles converge toward the button center
                        // at progress=0.5, and spread to their own laneY at the edges.
                        // funnelFactor: 0 at center, 1 at edges
                        const funnelFactor = 4 * (progress - 0.5) ** 2;
                        const buttonMidY = buttonRect.top + buttonRect.height / 2;
                        const y = p.lerp(buttonMidY, this.laneY + this.laneOffset, funnelFactor);
                        return { x, y };
                    }

                    updateAndDisplay() {
                        const loopProgress = (p.millis() % currentLoopDuration) / currentLoopDuration;
                        let particleProgress = (loopProgress + this.phaseOffset) % 1.0;
                        if (this.flowDirection === 'rtl') particleProgress = 1.0 - particleProgress;
                        const finalPos = this.getPointOnPath(particleProgress);
                        if (!finalPos) return;

                        const pulse = p.sin(particleProgress * p.PI);
                        const currentColor = p.lerpColor(this.baseColor, p.color('#FBF7FE'), 1 - pulse);
                        // Full alpha (255) at peak pulse — particles are bright points of light
                        const baseAlpha = pulse * 255, baseSize = this.baseSize * pulse;
                        const activatedAlpha = pulse * 255, activatedSize = this.baseSize * 3 * pulse;
                        let alpha = p.lerp(baseAlpha, activatedAlpha, activationLevel), size = p.lerp(baseSize, activatedSize, activationLevel);

                        if (!isTouchDevice) {
                            const dSq = (finalPos.x - p.mouseX) ** 2 + (finalPos.y - p.mouseY) ** 2;
                            if (dSq < config.mouseEffectRadiusSq) {
                                const influence = p.map(dSq, 0, config.mouseEffectRadiusSq, 1, 0);
                                alpha = p.lerp(alpha, 255, influence * 0.95);
                                size = p.lerp(size, this.baseSize * 4.0, influence * 0.9);
                            }
                        }

                        if (alpha > 1) {
                            const finalColor = p.color(currentColor);
                            finalColor.setAlpha(alpha);

                            // Glow effect — makes particles luminous ("points of light")
                            // Enabled in ALL modes (including lowPerf) with a smaller blur
                            // in lowPerf to avoid performance issues.
                            const blurSize = isLowPerf ? size * 1.5 : size * 2.5;
                            p.drawingContext.shadowBlur = blurSize;
                            p.drawingContext.shadowColor = currentColor.toString();

                            p.fill(finalColor);
                            p.noStroke();
                            p.ellipse(finalPos.x, finalPos.y, size, size);

                            // Reset shadow after each particle
                            p.drawingContext.shadowBlur = 0;
                        }
                    }
                }

                const createParticles = () => { particles = []; for (let i = 0; i < config.particleCount; i++) particles.push(new Particle()); };
                const calculatePaths = () => {
                    if (!buttonEl) return;
                    // Only need the button rect for the funnel effect — particles
                    // now spread across the full screen via their own laneY.
                    buttonRect = buttonEl.getBoundingClientRect();
                };

                p.setup = () => {
                    p.pixelDensity(1);
                    if (sketchContainerRef.current) p.createCanvas(sketchContainerRef.current.offsetWidth, sketchContainerRef.current.offsetHeight);
                    else p.createCanvas(p.windowWidth, p.windowHeight);

                    updateConfigForScreenSize();
                    p.frameRate(config.targetFPS);
                    buttonEl = buttonVisRef.current;
                    const realButton = realButtonRef.current;
                    if (realButton) {
                        realButton.addEventListener('mouseenter', () => { isActivated = true; });
                        realButton.addEventListener('mouseleave', () => { isActivated = false; });
                    }
                    calculatePaths();
                    createParticles();
                    currentLoopDuration = config.loopDuration;
                };

                p.draw = () => {
                    p.clear();
                    const activationTarget = isActivated ? 1 : 0;
                    activationLevel = p.lerp(activationLevel, activationTarget, 0.08);
                    const targetLoopDuration = isActivated ? config.activatedLoopDuration : config.loopDuration;
                    currentLoopDuration = p.lerp(currentLoopDuration, targetLoopDuration, 0.08);
                    const bodyEl = document.body;
                    if (activationLevel > 0.1) bodyEl.classList.add('is-active');
                    else bodyEl.classList.remove('is-active');
                    for (const particle of particles) particle.updateAndDisplay();
                };

                // Handle window resize with throttling to prevent React recreate
                p.windowResized = () => {
                    if (resizeTimeoutRef.current) clearTimeout(resizeTimeoutRef.current);
                    resizeTimeoutRef.current = setTimeout(() => {
                        if (sketchContainerRef.current) p.resizeCanvas(sketchContainerRef.current.offsetWidth, sketchContainerRef.current.offsetHeight);
                        else p.resizeCanvas(p.windowWidth, p.windowHeight);
                        updateConfigForScreenSize();
                        calculatePaths();
                        createParticles();
                    }, 150);
                };
            };

            if (!sketchContainerRef.current) return;
            p5InstanceRef.current = new P5Constructor(sketch, sketchContainerRef.current);
        } catch (error) {
            console.error('[useHeroSketch] Failed to load p5.js:', error);
        } finally {
            isCreatingRef.current = false;
        }
    }, [sketchContainerRef, buttonVisRef, realButtonRef, isLowPerf]);

    // Keep the ref up to date with the latest callback
    createSketchRef.current = createP5Sketch;

    const destroyP5Instance = useCallback(() => {
        isCancelledRef.current = true;
        if (p5InstanceRef.current) {
            p5InstanceRef.current.remove();
            p5InstanceRef.current = null;
        }
        if (typeof document !== 'undefined') {
            document.body.classList.remove('is-active');
        }
    }, []);

    const setupObserver = useCallback(() => {
        if (isObserverSetup.current || !sectionRef.current) return;
        isObserverSetup.current = true;

        const handleIntersect: IntersectionObserverCallback = ([entry]) => {
            if (entry.isIntersecting) {
                if (!p5InstanceRef.current) {
                    createSketchRef.current(); // Use ref for latest callback
                } else {
                    p5InstanceRef.current.loop();
                }
            } else {
                if (p5InstanceRef.current) {
                    p5InstanceRef.current.noLoop();
                }
            }
        };

        observerRef.current = new IntersectionObserver(handleIntersect, { threshold: 0.1 });
        observerRef.current.observe(sectionRef.current);
    }, [sectionRef]); // REMOVED createP5Sketch from dependencies — observer is now stable!

    useEffect(() => {
        isCancelledRef.current = false; // Reset for re-mount (React Strict Mode support)
        setupObserver();

        const sectionEl = sectionRef.current;
        return () => {
            isObserverSetup.current = false; // Reset so observer can be re-created on re-mount
            if (observerRef.current && sectionEl) {
                observerRef.current.unobserve(sectionEl);
                observerRef.current = null;
            }
            destroyP5Instance();
            if (resizeTimeoutRef.current) clearTimeout(resizeTimeoutRef.current);
        };
    }, [setupObserver, destroyP5Instance, sectionRef]);

    return { isLowPerf };
};
