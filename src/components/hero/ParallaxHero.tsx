import { useRef, useEffect, useState, useCallback } from 'react';
import { useReducedMotion } from '../../hooks';
import { useContent } from '../../context/ContentContext';

export function ParallaxHero() {
  const heroRef = useRef(null);
  const prefersReduced = useReducedMotion();
  const [scrollY, setScrollY] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [activeId, setActiveId] = useState<string | null>(null);
  const touchHandled = useRef(false);

  const { content } = useContent();
  const hero = content.hero as Record<string, string> | null;
  const selfAssessment = content.selfAssessment as { outcomes: Array<{
    id: string;
    shortTitle: string;
    title: string;
    score: number;
    maxScore: number;
    indicators: Array<{ id: string; text: string; rating: number }>;
  }> } | null;

  const outcomes = selfAssessment?.outcomes ?? [];

  useEffect(() => {
    if (prefersReduced) return;

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prefersReduced]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (prefersReduced) return;
    const rect = heroRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setMousePos({ x, y });
  }, [prefersReduced]);

  useEffect(() => {
    if (!activeId) return;
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setActiveId(null); };
    const handleOutside = (e: MouseEvent) => {
      if (!(e.target as HTMLElement)?.closest('.hero-competency-wrapper')) setActiveId(null);
    };
    document.addEventListener('keydown', handleKey);
    document.addEventListener('click', handleOutside);
    document.addEventListener('touchend', handleOutside);
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.removeEventListener('click', handleOutside);
      document.removeEventListener('touchend', handleOutside);
    };
  }, [activeId]);

  const textY = prefersReduced ? 0 : scrollY * 0.15;
  const imageY = prefersReduced ? 0 : scrollY * 0.25;
  const contentOpacity = prefersReduced ? 1 : Math.max(0, 1 - scrollY / 500);

  const mouseParallax = prefersReduced ? { x: 0, y: 0 } : { x: mousePos.x * 8, y: mousePos.y * 5 };
  const mouseImageParallax = prefersReduced ? { x: 0, y: 0 } : { x: mousePos.x * -4, y: mousePos.y * -3 };

  return (
    <section
      ref={heroRef}
      className="hero"
      aria-label="Hero section"
      style={{ position: 'relative' }}
      onMouseMove={handleMouseMove}
    >
      {/* Giant background text */}
      <div
        className="hero-text-layer"
        style={{ transform: `translateY(${textY}px) translate(${mouseParallax.x}px, ${mouseParallax.y}px)` }}
      >
        <span className="hero-giant-text" aria-hidden="true">
          {hero?.giantText ?? 'PORTFOLIO'}
        </span>
      </div>

      {/* Main image */}
      <div
        className="hero-image-layer"
        style={{ transform: `translateY(${imageY}px) translate(${mouseImageParallax.x}px, ${mouseImageParallax.y}px)` }}
      >
        <div className="hero-image-wrapper">
          <img
            src="/assets/parallax/hero-pnu.jpg"
            alt="Philippine Normal University building"
            className="hero-main-image"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      </div>

      {/* Dark overlay for contrast */}
      <div className="hero-overlay" />

      {/* Content overlay */}
      <div
        className="hero-content"
        style={{ opacity: contentOpacity }}
      >
        {/* Main content area */}
        <div className="hero-main">
          <div className="hero-center-content">
            {/* Left side - intro */}
            <div className="hero-left">
              <span className="hero-badge">{hero?.badge ?? 'Year 1 at PNU'}</span>
              <h1 className="hero-tagline">
                {hero?.headline ?? 'Welcome to My'}
                <br />
                <span className="hero-tagline-accent">{hero?.headlineAccent ?? 'Growth Journey'}</span>
              </h1>
              <p className="hero-description">
                {hero?.description ?? 'Documenting my personal and professional development through evidence-based learning at Philippine Normal University.'}
              </p>
              <a href="#introduction" className="hero-cta">
                {hero?.ctaText ?? 'Explore My Work'}
              </a>
            </div>

            {/* Right side - competencies */}
            <div className="hero-right">
              <div className="hero-competencies">
                {outcomes.map((outcome) => (
                  <div
                    key={outcome.id}
                    className="hero-competency-wrapper"
                    onMouseEnter={() => setActiveId(outcome.id)}
                    onMouseLeave={() => setActiveId(null)}
                    onClick={(e) => {
                      if (touchHandled.current) return;
                      e.stopPropagation();
                      setActiveId((prev) => (prev === outcome.id ? null : outcome.id));
                    }}
                    onTouchEnd={(e) => {
                      e.stopPropagation();
                      touchHandled.current = true;
                      setActiveId((prev) => (prev === outcome.id ? null : outcome.id));
                      setTimeout(() => { touchHandled.current = false; }, 400);
                    }}
                  >
                    <span
                      className={`hero-competency${activeId === outcome.id ? ' active' : ''}`}
                    >
                      {outcome.shortTitle}
                    </span>
                    {activeId === outcome.id && (
                      <div className="hero-stats-tooltip" role="tooltip">
                        <div className="hero-stats-tooltip-header">
                          <span className="hero-stats-tooltip-title">{outcome.title}</span>
                          <span className="hero-stats-tooltip-score">
                            {outcome.score}{' '}
                            <span className="hero-stats-tooltip-max">/ {outcome.maxScore}</span>
                          </span>
                        </div>
                        <div className="hero-stats-tooltip-bar-track">
                          <div
                            className="hero-stats-tooltip-bar-fill"
                            style={{ width: `${(outcome.score / outcome.maxScore) * 100}%` }}
                          />
                        </div>
                        <div className="hero-stats-tooltip-indicators">
                          {outcome.indicators.map((ind) => (
                            <div key={ind.id} className="hero-stats-tooltip-indicator">
                              <span className="hero-stats-tooltip-indicator-text">{ind.text}</span>
                              <div className="hero-stats-tooltip-indicator-dots">
                                {[1, 2, 3, 4, 5].map((n) => (
                                  <span
                                    key={n}
                                    className={`indicator-dot${n <= ind.rating ? ' filled' : ''}`}
                                  />
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="hero-scroll">
          <span>Scroll</span>
          <div className="hero-scroll-line" />
        </div>
      </div>
    </section>
  );
}
