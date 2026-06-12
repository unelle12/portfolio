import { type CSSProperties } from 'react';
import { Container } from '../ui';

interface BarProps {
  width?: string;
  height?: string;
  radius?: string;
  style?: CSSProperties;
  className?: string;
  variant?: 'default' | 'pulse' | 'rounded';
}

function Bar({ width = '100%', height = '16px', radius = 'var(--radius-md)', style, className, variant = 'default' }: BarProps) {
  const variantClass = variant === 'pulse' ? 'skeleton-bar-pulse' : variant === 'rounded' ? 'skeleton-bar-rounded' : '';
  return (
    <div
      className={`skeleton-bar ${variantClass} ${className ?? ''}`}
      style={{ width, height, borderRadius: radius, ...style }}
    />
  );
}

function Circle({ size = '40px', style }: { size?: string; style?: CSSProperties }) {
  return (
    <div
      className="skeleton-bar skeleton-bar-circle"
      style={{ width: size, height: size, borderRadius: 'var(--radius-full)', flexShrink: 0, ...style }}
    />
  );
}

function ImagePlaceholder({ height = '120px', style }: { height?: string; style?: CSSProperties }) {
  return (
    <div className="skeleton-image-placeholder" style={{ height, ...style }}>
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.3 }}>
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    </div>
  );
}

function SectionHeader() {
  return (
    <div className="section-header center" style={{ marginBottom: 'var(--space-10)' }}>
      <Bar width="100px" height="28px" radius="var(--radius-full)" variant="rounded" />
      <Bar width="260px" height="32px" style={{ marginTop: 'var(--space-3)' }} />
      <Bar width="400px" height="16px" style={{ marginTop: 'var(--space-3)' }} />
    </div>
  );
}

function HeroSkeleton() {
  return (
    <div className="skeleton-hero skeleton-stagger-1">
      <div className="skeleton-hero-nav">
        <Bar width="80px" height="20px" variant="rounded" />
        <div className="skeleton-hero-nav-links">
          {[1, 2, 3, 4, 5].map((i) => (
            <Bar key={i} width="60px" height="14px" variant="rounded" />
          ))}
        </div>
      </div>

      <div className="skeleton-hero-content">
        <div className="skeleton-hero-left">
          <Bar width="90px" height="28px" radius="var(--radius-full)" variant="pulse" />
          <Bar width="280px" height="44px" style={{ marginTop: 'var(--space-4)' }} />
          <Bar width="180px" height="44px" style={{ marginTop: 'var(--space-2)' }} />
          <Bar width="100%" height="16px" style={{ marginTop: 'var(--space-4)' }} />
          <Bar width="70%" height="16px" style={{ marginTop: 'var(--space-2)' }} />
          <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-6)' }}>
            <Bar width="140px" height="48px" radius="var(--radius-lg)" variant="rounded" />
            <Bar width="120px" height="48px" radius="var(--radius-lg)" />
          </div>
        </div>
        <div className="skeleton-hero-right">
          {[1, 2, 3, 4, 5].map((i) => (
            <Bar key={i} width={`${140 - i * 8}px`} height="36px" radius="var(--radius-full)" style={{ marginTop: i > 1 ? 'var(--space-2)' : 0 }} />
          ))}
        </div>
      </div>

      <div className="skeleton-hero-scroll">
        <Bar width="40px" height="12px" variant="rounded" />
        <div className="skeleton-scroll-line" />
      </div>

      <style>{`
        .skeleton-hero {
          position: relative;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: var(--gradient-hero);
          overflow: hidden;
        }
        .skeleton-hero-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-4) var(--space-6);
          max-width: var(--container-xl);
          margin: 0 auto;
          width: 100%;
        }
        .skeleton-hero-nav-links {
          display: flex;
          gap: var(--space-4);
        }
        .skeleton-hero-content {
          flex: 1;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-8);
          max-width: var(--container-xl);
          margin: 0 auto;
          width: 100%;
          padding: var(--space-8) var(--space-6);
          align-items: center;
        }
        .skeleton-hero-left {
          display: flex;
          flex-direction: column;
        }
        .skeleton-hero-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }
        .skeleton-hero-scroll {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-2);
          padding-bottom: var(--space-6);
        }
        .skeleton-scroll-line {
          width: 2px;
          height: 40px;
          border-radius: var(--radius-full);
          background: linear-gradient(to bottom, var(--color-accent), transparent);
          animation: pulseGlow 2s ease-in-out infinite;
        }
        @media (max-width: 768px) {
          .skeleton-hero-content {
            grid-template-columns: 1fr;
            text-align: center;
          }
          .skeleton-hero-right {
            align-items: center;
          }
          .skeleton-hero-nav-links {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}

function IntroductionSkeleton() {
  return (
    <section className="section skeleton-stagger-2" style={{ background: 'var(--section-even-bg)' }}>
      <Container>
        <SectionHeader />
        <div className="skeleton-intro-grid">
          <div className="skeleton-card">
            <Bar width="80px" height="14px" variant="rounded" />
            <Bar width="200px" height="28px" style={{ marginTop: 'var(--space-3)' }} />
            <Bar width="140px" height="16px" style={{ marginTop: 'var(--space-2)' }} />
            <div style={{ marginTop: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <Bar width="100%" height="14px" />
              <Bar width="90%" height="14px" />
              <Bar width="95%" height="14px" />
              <Bar width="60%" height="14px" />
            </div>
          </div>
          <div className="skeleton-card">
            <Bar width="180px" height="20px" style={{ marginBottom: 'var(--space-3)' }} />
            <Bar width="100%" height="14px" />
            <Bar width="80%" height="14px" style={{ marginTop: 'var(--space-2)' }} />
            <Bar width="140px" height="20px" style={{ marginTop: 'var(--space-5)', marginBottom: 'var(--space-3)' }} />
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginTop: i > 1 ? 'var(--space-3)' : 0 }}>
                <Circle size="40px" />
                <div style={{ flex: 1 }}>
                  <Bar width="70%" height="14px" />
                  <Bar width="90%" height="12px" style={{ marginTop: 'var(--space-1)' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>

      <style>{`
        .skeleton-intro-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-6);
        }
        .skeleton-card {
          background: var(--color-card-bg);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-xl);
          padding: var(--space-6);
          display: flex;
          flex-direction: column;
        }
        @media (max-width: 768px) {
          .skeleton-intro-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}

function SelfAssessmentSkeleton() {
  return (
    <section className="section skeleton-stagger-3" style={{ background: 'var(--section-odd-bg)' }}>
      <Container>
        <SectionHeader />
        <div className="skeleton-assessment-grid">
          <div className="skeleton-card" style={{ minHeight: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="skeleton-radar-placeholder">
              <svg viewBox="0 0 200 200" width="220" height="220" style={{ opacity: 0.15 }}>
                <polygon points="100,10 190,75 160,170 40,170 10,75" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <polygon points="100,40 160,82 142,148 58,148 40,82" fill="none" stroke="currentColor" strokeWidth="1" />
                <polygon points="100,70 130,89 124,126 76,126 70,89" fill="none" stroke="currentColor" strokeWidth="0.75" />
                <line x1="100" y1="10" x2="100" y2="100" stroke="currentColor" strokeWidth="0.5" />
                <line x1="190" y1="75" x2="100" y2="100" stroke="currentColor" strokeWidth="0.5" />
                <line x1="160" y1="170" x2="100" y2="100" stroke="currentColor" strokeWidth="0.5" />
                <line x1="40" y1="170" x2="100" y2="100" stroke="currentColor" strokeWidth="0.5" />
                <line x1="10" y1="75" x2="100" y2="100" stroke="currentColor" strokeWidth="0.5" />
              </svg>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="skeleton-card" style={{ padding: 'var(--space-4)', flexDirection: 'row', alignItems: 'center', gap: 'var(--space-4)' }}>
                <Bar width="48px" height="36px" radius="var(--radius-md)" variant="rounded" />
                <div style={{ flex: 1 }}>
                  <Bar width="60%" height="16px" />
                  <Bar width="80%" height="12px" style={{ marginTop: 'var(--space-2)' }} />
                </div>
                <Bar width="24px" height="24px" radius="var(--radius-sm)" />
              </div>
            ))}
          </div>
        </div>
      </Container>

      <style>{`
        .skeleton-assessment-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-6);
        }
        .skeleton-radar-placeholder {
          color: var(--color-text-muted);
        }
        @media (max-width: 1024px) {
          .skeleton-assessment-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}

function EvidenceSkeleton() {
  return (
    <section className="section skeleton-stagger-4" style={{ background: 'var(--section-even-bg)' }}>
      <Container>
        <SectionHeader />
        <div className="skeleton-evidence-terms">
          {[1, 2].map((term) => (
            <div key={term} className="skeleton-term">
              <div className="skeleton-term-header">
                <Bar width="20px" height="20px" radius="var(--radius-sm)" variant="rounded" />
                <div style={{ flex: 1 }}>
                  <Bar width="120px" height="18px" />
                  <Bar width="200px" height="12px" style={{ marginTop: 'var(--space-1)' }} />
                </div>
                <Bar width="100px" height="12px" variant="rounded" />
              </div>
              <div style={{ padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                <div className="skeleton-subfolder">
                  <div className="skeleton-subfolder-header">
                    <Bar width="16px" height="16px" radius="var(--radius-sm)" variant="rounded" />
                    <div style={{ flex: 1 }}>
                      <Bar width="100px" height="14px" />
                      <Bar width="140px" height="10px" style={{ marginTop: 'var(--space-1)' }} />
                    </div>
                  </div>
                  <div className="skeleton-evidence-grid">
                    {[1, 2, 3].map((card) => (
                      <div key={card} className="skeleton-evidence-card">
                        <ImagePlaceholder height="120px" />
                        <div style={{ padding: 'var(--space-3)' }}>
                          <Bar width="60px" height="10px" variant="rounded" />
                          <Bar width="80%" height="14px" style={{ marginTop: 'var(--space-2)' }} />
                          <Bar width="100%" height="10px" style={{ marginTop: 'var(--space-2)' }} />
                          <Bar width="70%" height="10px" style={{ marginTop: 'var(--space-1)' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="skeleton-nested-subfolder" style={{ marginLeft: 'var(--space-6)' }}>
                    <div className="skeleton-subfolder-header">
                      <Bar width="12px" height="12px" radius="var(--radius-sm)" variant="rounded" />
                      <Bar width="80px" height="12px" />
                    </div>
                    <div className="skeleton-evidence-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
                      {[1, 2].map((card) => (
                        <div key={card} className="skeleton-evidence-card">
                          <ImagePlaceholder height="80px" />
                          <div style={{ padding: 'var(--space-2)' }}>
                            <Bar width="60%" height="12px" />
                            <Bar width="80%" height="8px" style={{ marginTop: 'var(--space-1)' }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>

      <style>{`
        .skeleton-evidence-terms {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }
        .skeleton-term {
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          background: var(--color-card-bg);
          overflow: hidden;
        }
        .skeleton-term-header {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-4) var(--space-6);
          background: var(--color-bg-secondary);
        }
        .skeleton-subfolder {
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          background: var(--color-bg-secondary);
          overflow: hidden;
        }
        .skeleton-subfolder-header {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-3) var(--space-4);
          background: var(--color-bg-secondary);
          border-bottom: 1px solid var(--color-border);
        }
        .skeleton-nested-subfolder {
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          background: var(--color-card-bg);
          overflow: hidden;
          border-left: 3px solid var(--color-accent);
        }
        .skeleton-evidence-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-4);
          padding: var(--space-4);
        }
        .skeleton-evidence-card {
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          overflow: hidden;
          background: var(--color-card-bg);
        }
        .skeleton-image-placeholder {
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--color-bg-secondary);
          color: var(--color-text-muted);
        }
        @media (max-width: 1024px) {
          .skeleton-evidence-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 640px) {
          .skeleton-evidence-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}

function ReflectionsSkeleton() {
  return (
    <section className="section skeleton-stagger-5" style={{ background: 'var(--section-odd-bg)' }}>
      <Container>
        <SectionHeader />
        <div className="skeleton-reflections-list">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton-reflection-card">
              <Circle size="36px" />
              <div style={{ flex: 1 }}>
                <Bar width="60%" height="14px" />
                <Bar width="30%" height="10px" style={{ marginTop: 'var(--space-1)' }} />
              </div>
              <Bar width="20px" height="20px" radius="var(--radius-sm)" variant="rounded" />
            </div>
          ))}
        </div>
      </Container>

      <style>{`
        .skeleton-reflections-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
          max-width: 800px;
          margin: 0 auto;
        }
        .skeleton-reflection-card {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-4) var(--space-5);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          background: var(--color-card-bg);
        }
      `}</style>
    </section>
  );
}

function RetrospectionSkeleton() {
  return (
    <section className="section skeleton-stagger-6" style={{ background: 'var(--section-even-bg)' }}>
      <Container>
        <SectionHeader />
        <div className="skeleton-retrospection-wrapper">
          <div className="skeleton-retrospection-card">
            <Circle size="56px" style={{ margin: '0 auto' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
              <Bar width="100%" height="14px" />
              <Bar width="100%" height="14px" />
              <Bar width="90%" height="14px" />
              <Bar width="100%" height="14px" style={{ marginTop: 'var(--space-2)' }} />
              <Bar width="70%" height="14px" />
              <Bar width="95%" height="14px" />
              <Bar width="80%" height="14px" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 'var(--space-6)' }}>
              <Bar width="60px" height="2px" radius="var(--radius-full)" variant="rounded" />
              <Bar width="120px" height="12px" style={{ marginTop: 'var(--space-3)' }} />
            </div>
          </div>
        </div>
      </Container>

      <style>{`
        .skeleton-retrospection-wrapper {
          max-width: 800px;
          margin: 0 auto;
        }
        .skeleton-retrospection-card {
          background: var(--color-card-bg);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-xl);
          padding: var(--space-8);
          border-top: 4px solid var(--color-accent);
          text-align: center;
        }
      `}</style>
    </section>
  );
}

function ContactSkeleton() {
  return (
    <section className="section skeleton-stagger-7" style={{ background: 'var(--section-odd-bg)' }}>
      <Container>
        <SectionHeader />
        <div className="skeleton-contact-grid">
          <div className="skeleton-card">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              <Bar width="100%" height="44px" radius="var(--radius-md)" />
              <Bar width="100%" height="44px" radius="var(--radius-md)" />
            </div>
            <Bar width="100%" height="44px" radius="var(--radius-md)" style={{ marginTop: 'var(--space-4)' }} />
            <Bar width="100%" height="120px" radius="var(--radius-md)" style={{ marginTop: 'var(--space-4)' }} />
            <Bar width="140px" height="44px" radius="var(--radius-md)" style={{ marginTop: 'var(--space-4)' }} variant="rounded" />
          </div>
          <div className="skeleton-card" style={{ background: 'var(--color-bg-secondary)' }}>
            <Bar width="140px" height="20px" />
            <Bar width="100%" height="14px" style={{ marginTop: 'var(--space-3)' }} />
            <Bar width="80%" height="14px" style={{ marginTop: 'var(--space-2)' }} />
            <div style={{ marginTop: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {[1, 2, 3].map((i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <Circle size="44px" style={{ background: 'var(--color-card-bg)' }} />
                  <div>
                    <Bar width="80px" height="14px" />
                    <Bar width="120px" height="10px" style={{ marginTop: 'var(--space-1)' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>

      <style>{`
        .skeleton-contact-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: var(--space-6);
        }
        @media (max-width: 768px) {
          .skeleton-contact-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}

export function PageSkeleton() {
  return (
    <>
      <div className="skeleton-root">
        <HeroSkeleton />
        <IntroductionSkeleton />
        <SelfAssessmentSkeleton />
        <EvidenceSkeleton />
        <ReflectionsSkeleton />
        <RetrospectionSkeleton />
        <ContactSkeleton />
      </div>

      <style>{`
        .skeleton-root {
          --skeleton-base: var(--color-bg-secondary);
          --skeleton-shine: rgba(255, 255, 255, 0.5);
          --skeleton-shimmer-speed: 2s;
        }
        [data-theme="dark"] .skeleton-root {
          --skeleton-shine: rgba(255, 255, 255, 0.06);
        }
        .skeleton-bar {
          background: var(--skeleton-base);
          background-image: linear-gradient(
            90deg,
            var(--skeleton-base) 0%,
            var(--skeleton-base) 35%,
            var(--skeleton-shine) 50%,
            var(--skeleton-base) 65%,
            var(--skeleton-base) 100%
          );
          background-size: 300% 100%;
          animation: shimmerWave var(--skeleton-shimmer-speed) ease-in-out infinite;
          will-change: background-position;
        }
        .skeleton-bar-pulse {
          animation: shimmerWave var(--skeleton-shimmer-speed) ease-in-out infinite,
                     pulseGlow 2.5s ease-in-out infinite;
        }
        .skeleton-bar-rounded {
          opacity: 0.7;
        }
        .skeleton-bar-circle {
          opacity: 0.6;
        }
        @media (prefers-reduced-motion: reduce) {
          .skeleton-bar {
            animation: none;
            opacity: 0.5;
          }
          .skeleton-bar-pulse {
            animation: none;
            opacity: 0.5;
          }
        }
      `}</style>
    </>
  );
}
