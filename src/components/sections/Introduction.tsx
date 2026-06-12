import { Container, Heading, Text, Badge, Card } from '../ui';
import { Target, BookOpen, Users, Lightbulb, FlaskConical } from 'lucide-react';
import { useContent } from '../../context/ContentContext';
import { EditButton } from '../common/EditButton';
import { IntroductionModal } from './IntroductionModal';
import { ScrollReveal, ScrollRevealGroup } from '../common/ScrollReveal';
import { useState } from 'react';

const principleIcons = [Target, BookOpen, Users, Lightbulb, FlaskConical];

export function Introduction() {
  const { content, isEditMode } = useContent();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const intro = content.introduction as {
    personal: { name: string; title: string; tagline: string; email: string; linkedin: string; github: string };
    greeting: string;
    bio: string[];
    purpose: string;
    guidingPrinciples: string[];
  } | null;

  if (!intro) return null;

  const { personal, greeting, bio, purpose, guidingPrinciples } = intro;

  return (
    <section id="introduction" className="section" style={{ background: 'var(--section-even-bg)', position: 'relative' }}>
      {isEditMode && <EditButton onClick={() => setIsModalOpen(true)} label="Edit Introduction" />}

      <Container>
        <ScrollReveal variant="fadeUp" useSpring>
          <div className="section-header center">
            <Badge variant="teal" className="section-badge">About Me</Badge>
            <Heading as="h2" variant="h2" center className="section-title">
              Introduction
            </Heading>
            <Text size="lg" muted className="section-description" style={{ marginInline: 'auto' }}>
              Get to know me and the purpose behind this portfolio.
            </Text>
          </div>
        </ScrollReveal>

        <div className="intro-content">
          <ScrollReveal variant="fadeLeft" delay={0.1} useSpring>
            <Card padding="lg" className="intro-main">
            <Text size="sm" muted style={{ marginBottom: 'var(--space-2)' }}>
              {greeting}
            </Text>
            <Heading as="h3" variant="h3" style={{ marginBottom: 'var(--space-4)' }}>
              {personal.name}
            </Heading>
            <Text size="base" muted style={{ marginBottom: 'var(--space-4)' }}>
              {personal.title}
            </Text>

            {bio.map((paragraph, i) => (
              <Text key={i} size="base" style={{ marginBottom: 'var(--space-3)' }}>
                {paragraph}
              </Text>
            ))}
          </Card>
          </ScrollReveal>

          <ScrollReveal variant="fadeRight" delay={0.2} useSpring>
          <Card padding="lg" className="intro-purpose">
            <Heading as="h4" variant="h4" style={{ marginBottom: 'var(--space-3)' }}>
              Purpose of This Portfolio
            </Heading>
            <Text size="base" style={{ marginBottom: 'var(--space-6)' }}>
              {purpose}
            </Text>

            <Heading as="h4" variant="h5" style={{ marginBottom: 'var(--space-4)' }}>
              My Guiding Principles
            </Heading>

            <div className="principles-list">
              {guidingPrinciples.map((principle, i) => {
                const Icon = principleIcons[i] || Target;
                const [title, ...descParts] = principle.split(': ');
                const description = descParts.join(': ');
                return (
                  <div key={i} className="principle-item">
                    <div className="principle-icon">
                      <Icon size={20} />
                    </div>
                    <div className="principle-text">
                      <Text size="base" style={{ fontWeight: 'var(--weight-semibold)', marginBottom: 'var(--space-1)' }}>
                        {title}
                      </Text>
                      <Text size="sm" muted>
                        {description}
                      </Text>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
          </ScrollReveal>
        </div>
      </Container>

      <IntroductionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <style>{`
        .intro-content {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-6);
        }
        @media (min-width: 768px) {
          .intro-content {
            grid-template-columns: 1fr 1fr;
          }
        }
        .intro-main, .intro-purpose {
          height: fit-content;
        }
        .principles-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }
        .principle-item {
          display: flex;
          gap: var(--space-3);
          align-items: flex-start;
        }
        .principle-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: var(--radius-lg);
          background: var(--color-accent);
          color: var(--color-burgundy);
          flex-shrink: 0;
        }
        .principle-text {
          flex: 1;
        }
      `}</style>
    </section>
  );
}
