import { useState } from 'react';
import { Container, Heading, Text, Badge, Card } from '../ui';
import { Sparkles } from 'lucide-react';
import { useContent } from '../../context/ContentContext';
import { EditButton } from '../common/EditButton';
import { RetrospectionModal } from './RetrospectionModal';
import { ScrollReveal } from '../common/ScrollReveal';

export function OverallRetrospection() {
  const { content, isEditMode } = useContent();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const retrospection = content.retrospection as { paragraphs: string[] } | null;
  const paragraphs = retrospection?.paragraphs ?? [];

  return (
    <section id="retrospection" className="section" style={{ background: 'var(--section-even-bg)', position: 'relative' }}>
      {isEditMode && <EditButton onClick={() => setIsModalOpen(true)} label="Edit Retrospection" />}

      <Container>
        <ScrollReveal variant="fadeUp" useSpring>
          <div className="section-header center">
            <Badge variant="accent" className="section-badge">Year 1 Summary</Badge>
            <Heading as="h2" variant="h2" center className="section-title">
              Overall Retrospection
            </Heading>
            <Text size="lg" muted className="section-description" style={{ marginInline: 'auto' }}>
              A final reflection on my key insights, learning, and progress throughout Year 1.
            </Text>
          </div>
        </ScrollReveal>

        <ScrollReveal variant="scale" delay={0.2} useSpring>
        <div className="retrospection-wrapper">
          <Card padding="lg" className="retrospection-card">
            <div className="retrospection-icon">
              <Sparkles size={24} />
            </div>

            <div className="retrospection-content">
              {paragraphs.map((paragraph, i) => (
                <Text key={i} size="base" className="retrospection-paragraph">
                  {paragraph}
                </Text>
              ))}
            </div>

            <div className="retrospection-footer">
              <div className="retrospection-divider" />
              <Text size="sm" muted style={{ textAlign: 'center' }}>
                End of Year 1 Portfolio
              </Text>
            </div>
          </Card>
        </div>
        </ScrollReveal>
      </Container>

      <RetrospectionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <style>{`
        .retrospection-wrapper {
          max-width: 800px;
          margin-inline: auto;
        }
        .retrospection-card {
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .retrospection-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, var(--color-teal-light), var(--color-accent), var(--color-burgundy));
        }
        .retrospection-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 56px;
          height: 56px;
          border-radius: var(--radius-full);
          background: var(--color-accent);
          color: var(--color-burgundy);
          margin-bottom: var(--space-6);
        }
        .retrospection-content {
          display: flex;
          flex-direction: column;
          gap: var(--space-5);
          text-align: left;
        }
        .retrospection-paragraph {
          line-height: var(--leading-relaxed);
        }
        .retrospection-footer {
          margin-top: var(--space-8);
        }
        .retrospection-divider {
          width: 60px;
          height: 2px;
          background: var(--color-border);
          margin: 0 auto var(--space-4);
        }
      `}</style>
    </section>
  );
}
