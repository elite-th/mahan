"use client";

import React, { useRef, useEffect, useCallback, useState } from 'react';
import type p5 from 'p5'; // Type-only import — erased at compile time, safe for SSR
import { useInView } from 'framer-motion';
import { COMPANY_NAME, COMPANY_SLOGAN } from '../constants';

// ---------------------------------------------------------------------------
// StatCounter — animates from 0 to target value when scrolled into view.
// Uses easeOutCubic for a smooth deceleration. Persian digit conversion.
// ---------------------------------------------------------------------------
const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

function toPersianDigits(n: number): string {
  return n.toString().replace(/\d/g, (d) => PERSIAN_DIGITS[parseInt(d, 10)]);
}

function StatCounter({
  value,
  prefix = '',
  label,
  duration = 1500,
}: {
  value: number;
  prefix?: string;
  label: string;
  duration?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf: number;
    let start: number | undefined;
    const step = (t: number) => {
      if (start === undefined) start = t;
      const progress = Math.min((t - start) / duration, 1);
      // easeOutCubic: 1 - (1 - x)^3
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration]);

  return (
    <div className="text-center" ref={ref}>
      <div className="text-3xl sm:text-4xl font-black text-sky-400">
        {prefix}{toPersianDigits(display)}
      </div>
      <div className="text-sm text-gray-400 mt-1">{label}</div>
    </div>
  );
}

/**
 * AboutSection — Neural network particle animation using p5.js
 *
 * SSR Safety: p5.js references `window` at module initialization time,
 * which crashes during server-side rendering. This component uses a type-only
 * import for p5 types and lazily imports p5 at runtime inside the browser
 * callback (via `await import('p5')`) to avoid the "window is not defined" error.
 * Since this is a Client Component ("use client"), it can be safely imported
 * statically from a Server Component page.
 */

const AboutSection: React.FC = () => {
  const sketchRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const p5InstanceRef = useRef<p5 | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const isObserverSetup = useRef(false);
  const isCancelledRef = useRef(false); // Guard against unmount during async import
  const [isMounted, setIsMounted] = useState(false);

  // Ensure we only run browser-only code after mount
  useEffect(() => {
    setIsMounted(true);
    return () => { isCancelledRef.current = true; };
  }, []);

  const createP5Sketch = useCallback(async () => {
    if (!sketchRef.current || p5InstanceRef.current) {
        return;
    }

    try {
      // Lazy import p5 to avoid SSR "window is not defined" crash
      // p5.js accesses `window` at the top level of its module
      const p5Module = await import('p5');
      const P5Constructor = p5Module.default;

      // Guard: component may have unmounted while awaiting the dynamic import
      if (isCancelledRef.current || !sketchRef.current) return;
      
      const sketch = (p: p5) => {
        const config = { 
            particleCount: 150, 
            colorPalette: ['#22d3ee', '#67e8f9', '#a5f3fc', '#f0f9ff'], 
            synapseThreshold: 80,
            mouseRadius: 150
        };
        let particles: Particle[] = [];
        let time = 0;

        class Particle {
            x: number;
            y: number;
            vx: number;
            vy: number;
            baseSize: number;
            color: p5.Color;
            noiseOffsetX: number;
            noiseOffsetY: number;

            constructor() {
                this.x = p.random(p.width);
                this.y = p.random(p.height);
                this.vx = 0;
                this.vy = 0;
                this.baseSize = p.random(1, 2.5);
                this.color = p.color(p.random(config.colorPalette));
                this.noiseOffsetX = p.random(1000);
                this.noiseOffsetY = p.random(1000);
            }

            update() {
                this.vx = p.map(p.noise(this.noiseOffsetX + time), 0, 1, -0.3, 0.3);
                this.x += this.vx;

                if (this.x < 0) this.x = p.width;
                if (this.x > p.width) this.x = 0;
            }

            display(alpha: number = 150) {
                let finalAlpha = alpha;
                let finalSize = this.baseSize;

                const dSq = (this.x - p.mouseX)**2 + (this.y - p.mouseY)**2;
                if (dSq < config.mouseRadius**2) {
                    const influence = p.map(p.sqrt(dSq), 0, config.mouseRadius, 1, 0);
                    finalAlpha = p.lerp(alpha, 255, influence);
                    finalSize = p.lerp(this.baseSize, this.baseSize * 2.5, influence);
                }

                this.color.setAlpha(finalAlpha);
                p.fill(this.color);
                p.noStroke();
                
                p.drawingContext.shadowBlur = finalSize * 1.5;
                p.drawingContext.shadowColor = this.color.toString();
                
                p.ellipse(this.x, this.y, finalSize);

                p.drawingContext.shadowBlur = 0;
            }
        }
        
        const updateConfig = () => {
            if (p.width < 480) {
                config.particleCount = 50;
                config.synapseThreshold = 60;
                config.mouseRadius = 100;
            } else if (p.width < 768) {
                config.particleCount = 80;
                config.synapseThreshold = 70;
                config.mouseRadius = 120;
            } else {
                config.particleCount = 150;
                config.synapseThreshold = 80;
                config.mouseRadius = 150;
            }
        };

        const createParticles = () => {
            particles = [];
            for (let i = 0; i < config.particleCount; i++) {
                particles.push(new Particle());
            }
        };

        p.setup = () => {
            if (sketchRef.current) {
                p.createCanvas(sketchRef.current.offsetWidth, sketchRef.current.offsetHeight);
                updateConfig();
                createParticles();
            }
        };

        p.draw = () => {
            p.clear();
            time += 0.005;
            const thresholdSq = config.synapseThreshold * config.synapseThreshold;

            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].display();

                for (let j = i + 1; j < particles.length; j++) {
                    const dSq = (particles[i].x - particles[j].x) ** 2 + (particles[i].y - particles[j].y) ** 2;
                    if (dSq < thresholdSq) {
                        const alpha = p.map(dSq, 0, thresholdSq, 60, 0);
                        p.stroke(200, alpha);
                        p.line(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
                    }
                }
            }
        };

        p.windowResized = () => {
            if (sketchRef.current) {
                p.resizeCanvas(sketchRef.current.offsetWidth, sketchRef.current.offsetHeight);
                updateConfig();
                createParticles();
            }
        };
      };
      p5InstanceRef.current = new P5Constructor(sketch, sketchRef.current);
    } catch (error) {
      console.error('[AboutSection] Failed to load p5.js:', error);
    }
  }, []);

  const destroyP5Instance = useCallback(() => {
    isCancelledRef.current = true;
    if (p5InstanceRef.current) {
      p5InstanceRef.current.remove();
      p5InstanceRef.current = null;
    }
  }, []);

  const setupObserver = useCallback(() => {
    if (isObserverSetup.current || !sectionRef.current) return;
    isObserverSetup.current = true;
    
    const handleIntersect: IntersectionObserverCallback = ([entry]) => {
      if (entry.isIntersecting) {
        if (!p5InstanceRef.current) {
          createP5Sketch();
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
  }, [createP5Sketch]);

  useEffect(() => {
    // Only setup observer after component is mounted (browser-only)
    if (!isMounted) return;
    setupObserver();

    const sectionEl = sectionRef.current;
    return () => {
        if (observerRef.current && sectionEl) {
            observerRef.current.unobserve(sectionEl);
        }
        destroyP5Instance();
    };
  }, [setupObserver, destroyP5Instance, isMounted]);

  return (
    <section id="about" ref={sectionRef} className="py-16 sm:py-24 bg-slate-800 relative overflow-hidden">
      <div ref={sketchRef} className="absolute inset-0 z-0 opacity-40"></div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-5xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-sky-400 mb-6">
            درباره {COMPANY_NAME}
          </h2>
          <p className="text-lg text-gray-300 leading-relaxed">
            <span className="font-bold text-sky-400">{COMPANY_SLOGAN}</span> از سال ۱۴۰۰ با تمرکز بر واردات، تأمین و اجرای پروژه‌های تجهیزات شبکه و زیرساخت فناوری اطلاعات فعالیت می‌کند. مجموعه ما با در اختیار داشتن کارت بازرگانی، نماد اعتماد الکترونیک (اینماد) و کد مالیاتی، فرایند خرید را شفاف و قابل اعتماد برای مشتریان سازمانی و دولتی فراهم کرده است.
          </p>
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <StatCounter value={5} label="سال تجربه تخصصی" />
            <StatCounter value={10} prefix="+" label="سازمان مشتری" />
            <StatCounter value={100} prefix="+" label="محصول تخصصی" />
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-black text-sky-400">۲۴/۷</div>
              <div className="text-sm text-gray-400 mt-1">پشتیبانی فنی</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
