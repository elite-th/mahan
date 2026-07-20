"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import styles from './HeroSection.module.css';

const HeroSketchEngine = dynamic(() => import('@/components/HeroSketchEngine'), { ssr: false });

const HeroSection: React.FC = () => {
  const router = useRouter();
  const sketchContainerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const buttonVisRef = useRef<HTMLDivElement>(null);
  const realButtonRef = useRef<HTMLButtonElement>(null);

  const [isLowPerf, setIsLowPerf] = useState(false);

  useEffect(() => {
    // On component mount (e.g., page load/refresh), scroll to the top.
    // This ensures the hero animation is always in view on initial load.
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []); // Empty dependency array ensures this runs only once on mount.

  // ─────────────────────────────────────────────────────────────────────────
  // DESKTOP HERO — full original experience (canvas + spin layers + SVG filters).
  // This is now used on ALL viewports (mobile + desktop). The previous mobile
  // branch was removed per user request — the desktop hero scales down to
  // mobile via its existing responsive CSS (HeroSection.module.css already
  // has @media (max-width: 768px) and (max-width: 480px) breakpoints).
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <section id="hero" ref={sectionRef} className={`relative h-screen -mt-20 overflow-hidden bg-[#110E18] ${isLowPerf ? styles.lowPerf : ''}`}>
      <div ref={sketchContainerRef} className={styles.heroContainer}>
        <div className={styles.heroBackgroundImage} role="img" aria-label="ماهان ارتباطات خردمنده"></div>
        <div className={styles.heroBackgroundOverlay}></div>

        {/* The SVG filters are part of the "spins" visual effect, so they should also be conditionally rendered */}
        {!isLowPerf && (
          <svg style={{ position: 'absolute', width: 0, height: 0 }}>
            <filter width="300%" x="-100%" height="300%" y="-100%" id="unopaq"><feColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 4 0"></feColorMatrix></filter>
            <filter width="300%" x="-100%" height="300%" y="-100%" id="unopaq2"><feColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1.5 0"></feColorMatrix></filter>
            <filter width="300%" x="-100%" height="300%" y="-100%" id="unopaq3"><feColorMatrix values="1 0 0 0.2 0 0 1 0 0.2 0 0 0 1 0.2 0 0 0 0 2 0"></feColorMatrix></filter>
          </svg>
        )}

        <div className={styles.backdrop}></div>

        <div className={styles.contentCenter}>
          <div className={styles.titleContainer}>
            <h1>ماهان ارتباطات خردمنده</h1>
            <p>پیشگام در صنعت ICT</p>
          </div>

          <div className={styles.buttonContainer}>
          <button className={styles.realButton} ref={realButtonRef} onClick={() => router.push('/products')} aria-label="مشاهده محصولات"></button>

          {!isLowPerf && (
            <>
              <div className={`${styles.spin} ${styles.spinBlur}`}></div>
              <div className={`${styles.spin} ${styles.spinIntense}`}></div>
            </>
          )}

          <div className={styles.backdrop}></div>
          <div className={styles.buttonBorder}>
            {!isLowPerf && <div className={`${styles.spin} ${styles.spinInside}`}></div>}
            <div className={styles.button} ref={buttonVisRef}>مشاهده محصولات</div>
          </div>
        </div>
        </div>
      </div>
      <HeroSketchEngine
        sectionRef={sectionRef}
        sketchContainerRef={sketchContainerRef}
        buttonVisRef={buttonVisRef}
        realButtonRef={realButtonRef}
        onLowPerfChange={setIsLowPerf}
      />
    </section>
  );
};

export default HeroSection;
