import { type CSSProperties } from 'react';
import { Container } from '../ui';

interface BarProps {
  width?: string;
  height?: string;
  radius?: string;
  style?: CSSProperties;
  className?: string;
}

function Bar({ width = '100%', height = '16px', radius = 'var(--radius-md)', style, className }: BarProps) {
  return (
    <div
      className={`skeleton-bar ${className ?? ''}`}
      style={{ width, height, borderRadius: radius, ...style }}
    />
  );
}

function Circle({ size = '40px', style }: { size?: string; style?: CSSProperties }) {
  return (
    <div
      className="skeleton-bar"
      style={{ width: size, height: size, borderRadius: 'var(--radius-full)', flexShrink: 0, ...style }}
    />
  );
}

function SectionHeader() {
  return (
    <div className="section-header center" style={{ marginBottom: 'var(--space-10)' }}>
      <Bar width="100px" height="28px" radius="var(--radius-full)" />
      <Bar width="260px" height="32px" style={{ marginTop: 'var(--space-3)' }} />
      <Bar width="400px" height="16px" style={{ marginTop: 'var(--space-3)' }} />
    </div>
  );
}

function HeroSkeleton() {
  return (
    <div className="skeleton-hero">
      <div className="skeleton-hero-nav">
        <Bar width="80px" height="20px" />
        <div className="skeleton-hero-nav-links">
          {[1, 2, 3, 4, 5].map((i) => (
            <Bar key={i} width="60px" height="14px" />
          ))}
        </div>
      </div>

      <div className="skeleton-hero-content">
        <div className="skeleton-hero-left">
          <Bar width="80px" height="28px" radius="var(--radius-full)" />
          <Bar width="280px" height="40px" style={{ marginTop: 'var(--space-4)' }} />
          <Bar width="180px" height="40px" style={{ marginTop: 'var(--space-2)' }} />
          <Bar width="100%" height="16px" style={{ marginTop: 'var(--space-4)' }} />
          <Bar width="70%" height="16px" style={{ marginTop: 'var(--space-2)' }} />
          <Bar width="140px" height="44px" radius="var(--radius-lg)" style={{ marginTop: 'var(--space-6)' }} />
        </div>
        <div className="skeleton-hero-right">
          {[1, 2, 3, 4, 5].map((i) => (
            <Bar key={i} width="120px" height="32px" radius="var(--radius-full)" style={{ marginTop: i > 1 ? 'var(--space-2)' : 0 }} />
          ))}
        </div>
      </div>

      <div className="skeleton-hero-scroll">
        <Bar width="40px" height="12px" />
        <Bar width="2px" height="40px" radius="var(--radius-full)" />
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
    <section className="section" style={{ background: 'var(--section-even-bg)' }}>
      <Container>
        <SectionHeader />
        <div className="skeleton-intro-grid">
          <div className="skeleton-card">
            <Bar width="80px" height="14px" />
            <Bar width="200px" height="28px" style={{ marginTop: 'var(--space-3)' }} />
            <Bar width="140px" height="16px" style={{ marginTop: 'var(--space-2)' }} />
            <Bar width="100%" height="14px" style={{ marginTop: 'var(--space-4)' }} />
            <Bar width="90%" height="14px" style={{ marginTop: 'var(--space-2)' }} />
            <Bar width="95%" height="14px" style={{ marginTop: 'var(--space-2)' }} />
            <Bar width="60%" height="14px" style={{ marginTop: 'var(--space-2)' }} />
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
    <section className="section" style={{ background: 'var(--section-odd-bg)' }}>
      <Container>
        <SectionHeader />
        <div className="skeleton-assessment-grid">
          <div className="skeleton-card" style={{ minHeight: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '280px', height: '280px', borderRadius: 'var(--radius-full)', border: '3px solid var(--color-border)', opacity: 0.4 }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="skeleton-card" style={{ padding: 'var(--space-4)', flexDirection: 'row', alignItems: 'center', gap: 'var(--space-4)' }}>
                <Bar width="48px" height="36px" radius="var(--radius-md)" />
                <div style={{ flex: 1 }}>
                  <Bar width="60%" height="16px" />
                  <Bar width="80%" height="12px" style={{ marginTop: 'var(--space-2)' }} />
                </div>
                <Bar width="20px" height="20px" radius="var(--radius-sm)" />
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
    <section className="section" style={{ background: 'var(--section-even-bg)' }}>
      <Container>
        <SectionHeader />
        <div className="skeleton-evidence-terms">
          {[1, 2].map((term) => (
            <div key={term} className="skeleton-term">
              <div className="skeleton-term-header">
                <Bar width="20px" height="20px" radius="var(--radius-sm)" />
                <div style={{ flex: 1 }}>
                  <Bar width="120px" height="18px" />
                  <Bar width="200px" height="12px" style={{ marginTop: 'var(--space-1)' }} />
                </div>
                <Bar width="100px" height="12px" />
              </div>
              <div style={{ padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                <div className="skeleton-subfolder">
                  <div className="skeleton-subfolder-header">
                    <Bar width="16px" height="16px" radius="var(--radius-sm)" />
                    <div style={{ flex: 1 }}>
                      <Bar width="100px" height="14px" />
                      <Bar width="140px" height="10px" style={{ marginTop: 'var(--space-1)' }} />
                    </div>
                  </div>
                  <div className="skeleton-evidence-grid">
                    {[1, 2, 3].map((card) => (
                      <div key={card} className="skeleton-evidence-card">
                        <div style={{ height: '120px', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md) var(--radius-md) 0 0' }} />
                        <div style={{ padding: 'var(--space-3)' }}>
                          <Bar width="60px" height="10px" />
                          <Bar width="80%" height="14px" style={{ marginTop: 'var(--space-2)' }} />
                          <Bar width="100%" height="10px" style={{ marginTop: 'var(--space-2)' }} />
                          <Bar width="70%" height="10px" style={{ marginTop: 'var(--space-1)' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="skeleton-nested-subfolder" style={{ marginLeft: 'var(--space-6)' }}>
                    <div className="skeleton-subfolder-header">
                      <Bar width="12px" height="12px" radius="var(--radius-sm)" />
                      <Bar width="80px" height="12px" />
                    </div>
                    <div className="skeleton-evidence-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
                      {[1, 2].map((card) => (
                        <div key={card} className="skeleton-evidence-card">
                          <div style={{ height: '80px', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md) var(--radius-md) 0 0' }} />
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
    <section className="section" style={{ background: 'var(--section-odd-bg)' }}>
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
              <Bar width="16px" height="16px" radius="var(--radius-sm)" />
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
    <section className="section" style={{ background: 'var(--section-even-bg)' }}>
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
              <Bar width="60px" height="2px" radius="var(--radius-full)" />
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
    <section className="section" style={{ background: 'var(--section-odd-bg)' }}>
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
            <Bar width="140px" height="44px" radius="var(--radius-md)" style={{ marginTop: 'var(--space-4)' }} />
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
          --skeleton-shine: rgba(255, 255, 255, 0.4);
        }
        [data-theme="dark"] .skeleton-root {
          --skeleton-shine: rgba(255, 255, 255, 0.08);
        }
        .skeleton-bar {
          background: var(--skeleton-base);
          background-image: linear-gradient(
            90deg,
            var(--skeleton-base) 0%,
            var(--skeleton-shine) 50%,
            var(--skeleton-base) 100%
          );
          background-size: 200% 100%;
          animation: shimmer 1.8s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}
