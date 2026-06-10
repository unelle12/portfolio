import { useState } from 'react';
import { Container, Heading, Text, Badge, Card } from '../ui';
import { ChevronDown, ChevronUp, BookOpen } from 'lucide-react';
import { useContent } from '../../context/ContentContext';
import { api } from '~/trpc/react';
import { EditButton } from '../common/EditButton';
import { ReflectionsModal } from './ReflectionsModal';

function ReflectionCard({ reflection, evidence }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card padding="none" className="reflection-card">
      <button
        className="reflection-header"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
      >
        <div className="reflection-header-content">
          <div className="reflection-icon">
            <BookOpen size={18} />
          </div>
          <div className="reflection-title-group">
            <Heading as="h4" variant="h6">
              {evidence?.title || 'Reflection'}
            </Heading>
            <Text size="xs" muted>
              {evidence?.type === 'video' ? 'Video Presentation' : 'Written Document'} · {evidence?.date}
            </Text>
          </div>
        </div>
        {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>

      {expanded && (
        <div className="reflection-body">
          {reflection.paragraphs.map((paragraph, i) => (
            <Text key={i} size="base" className="reflection-paragraph">
              {paragraph}
            </Text>
          ))}
        </div>
      )}
    </Card>
  );
}

export function Reflections() {
  const { content, isEditMode } = useContent();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const reflections = (content.reflections as Array<{
    evidenceId: string;
    paragraphs: string[];
  }>) ?? [];

  const { data: evidenceItems = [] } = api.evidence.getAll.useQuery();

  return (
    <section id="reflections" className="section" style={{ background: 'var(--section-odd-bg)', position: 'relative' }}>
      {isEditMode && <EditButton onClick={() => setIsModalOpen(true)} label="Edit Reflections" />}

      <Container>
        <div className="section-header center">
          <Badge variant="outline" className="section-badge">Reflections</Badge>
          <Heading as="h2" variant="h2" center className="section-title">
            Reflections
          </Heading>
          <Text size="lg" muted className="section-description" style={{ marginInline: 'auto' }}>
            What each piece of evidence taught me and how it contributed to my professional growth.
          </Text>
        </div>

        <div className="reflections-list">
          {reflections.map((reflection) => {
            const evidence = evidenceItems.find((ev) => ev.id.toString() === reflection.evidenceId.replace('ev-', ''));
            return (
              <ReflectionCard
                key={reflection.evidenceId}
                reflection={reflection}
                evidence={evidence}
              />
            );
          })}
        </div>
      </Container>

      <ReflectionsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <style>{`
        .reflections-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
          max-width: 800px;
          margin-inline: auto;
        }
        .reflection-card {
          overflow: hidden;
        }
        .reflection-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          text-align: left;
          padding: var(--space-4);
          gap: var(--space-3);
          color: var(--color-text-primary);
        }
        .reflection-header-content {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          flex: 1;
          min-width: 0;
        }
        .reflection-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: var(--radius-lg);
          background: var(--color-accent);
          color: var(--color-burgundy);
          flex-shrink: 0;
        }
        .reflection-title-group {
          flex: 1;
          min-width: 0;
        }
        .reflection-title-group h4 {
          margin-bottom: var(--space-1);
        }
        .reflection-body {
          padding: 0 var(--space-4) var(--space-4);
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
          border-top: 1px solid var(--color-border);
          padding-top: var(--space-4);
        }
        .reflection-paragraph {
          line-height: var(--leading-relaxed);
        }
      `}</style>
    </section>
  );
}
