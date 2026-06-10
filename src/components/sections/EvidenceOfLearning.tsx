import { useState } from 'react';
import { Container, Heading, Text, Badge, Card, Button } from '../ui';
import { FileText, Video, ExternalLink, StickyNote, Highlighter, Plus, Trash2 } from 'lucide-react';
import { useContent } from '../../context/ContentContext';
import { api } from '~/trpc/react';
import { EditButton } from '../common/EditButton';
import { EvidenceModal } from './EvidenceModal';

function EvidenceCard({ evidence, outcome, isEditMode, onEdit, onDelete }) {
  const [showMemo, setShowMemo] = useState(false);

  const TypeIcon = evidence.type === 'video' ? Video : FileText;

  return (
    <Card padding="none" className="evidence-card" style={{ position: 'relative' }}>
      {isEditMode && (
        <div className="evidence-card-actions">
          <button
            className="evidence-action-btn edit"
            onClick={() => onEdit(evidence)}
            aria-label="Edit evidence"
            type="button"
          >
            Edit
          </button>
          <button
            className="evidence-action-btn delete"
            onClick={() => onDelete(evidence.id)}
            aria-label="Delete evidence"
            type="button"
          >
            <Trash2 size={12} />
          </button>
        </div>
      )}

      <div className="evidence-thumbnail">
        <img src={evidence.thumbnail} alt={evidence.title} loading="lazy" />
        <div className="evidence-type-badge">
          <TypeIcon size={14} />
          <span>{evidence.fileType.toUpperCase()}</span>
        </div>
      </div>

      <div className="evidence-body">
        <div className="evidence-meta">
          <Badge variant="teal">{outcome?.shortTitle || 'N/A'}</Badge>
          <Text size="xs" muted>{evidence.date}</Text>
        </div>

        <Heading as="h4" variant="h6" style={{ marginBottom: 'var(--space-2)' }}>
          {evidence.title}
        </Heading>

        <Text size="sm" muted style={{ marginBottom: 'var(--space-3)' }}>
          {evidence.description}
        </Text>

        {evidence.highlightedSection && (
          <div className="evidence-highlight">
            <div className="highlight-label">
              <Highlighter size={14} />
              <Text size="xs" style={{ fontWeight: 'var(--weight-semibold)' }}>
                {evidence.highlightedSection}
              </Text>
            </div>
            {evidence.memoNote && <Text size="sm" muted>{evidence.memoNote}</Text>}
          </div>
        )}

        <div className="evidence-actions">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowMemo(!showMemo)}
          >
            <StickyNote size={14} />
            {showMemo ? 'Hide Memo' : 'Show Memo'}
          </Button>

          {evidence.fileUrl && (
            <Button
              variant="outline"
              size="sm"
              as="a"
              href={evidence.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink size={14} />
              View File
            </Button>
          )}
        </div>

        {showMemo && evidence.memoNote && (
          <div className="evidence-memo">
            <div className="memo-header">
              <StickyNote size={14} />
              <Text size="xs" style={{ fontWeight: 'var(--weight-semibold)' }}>
                Memo to Evaluator
              </Text>
            </div>
            <Text size="sm">{evidence.memoNote}</Text>
          </div>
        )}
      </div>
    </Card>
  );
}

export function EvidenceOfLearning() {
  const [selectedOutcome, setSelectedOutcome] = useState('all');
  const [editingEvidence, setEditingEvidence] = useState(null);
  const [modalMode, setModalMode] = useState<'edit' | 'create'>('edit');

  const { content, isEditMode } = useContent();
  const selfAssessment = content.selfAssessment as { outcomes: Array<{
    id: string;
    shortTitle: string;
    indicators: Array<{ id: string; text: string; rating: number }>;
  }> } | null;
  const outcomes = selfAssessment?.outcomes ?? [];

  const { data: evidenceItems = [], refetch } = api.evidence.getAll.useQuery();

  const filteredItems = selectedOutcome === 'all'
    ? evidenceItems
    : evidenceItems.filter((ev) => ev.outcomeId === selectedOutcome);

  const createMutation = api.evidence.create.useMutation({
    onSuccess: () => {
      void refetch();
      setEditingEvidence(null);
    },
    onError: (error) => {
      console.error('Create evidence failed:', error);
      alert(`Failed to create evidence: ${error.message}`);
    },
  });

  const updateMutation = api.evidence.update.useMutation({
    onSuccess: () => {
      void refetch();
      setEditingEvidence(null);
    },
    onError: (error) => {
      console.error('Update evidence failed:', error);
      alert(`Failed to update evidence: ${error.message}`);
    },
  });

  const deleteMutation = api.evidence.delete.useMutation({
    onSuccess: () => {
      void refetch();
    },
    onError: (error) => {
      console.error('Delete evidence failed:', error);
      alert(`Failed to delete evidence: ${error.message}`);
    },
  });

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this evidence item?')) {
      deleteMutation.mutate({ id });
    }
  };

  const handleAdd = () => {
    const firstOutcome = outcomes[0];
    const firstIndicator = firstOutcome?.indicators?.[0];
    
    if (!firstOutcome || !firstIndicator) {
      alert('Please add outcomes and indicators in Self Assessment first');
      return;
    }
    
    setEditingEvidence(null);
    setModalMode('create');
    setEditingEvidence({
      id: 0,
      title: '',
      description: '',
      highlightedSection: '',
      memoNote: '',
      fileUrl: '',
      filePath: null,
      outcomeId: firstOutcome.id,
      indicatorId: firstIndicator.id,
      type: 'document',
      fileType: 'pdf',
      date: new Date().toISOString().split('T')[0],
    } as never);
  };

  const handleEdit = (evidence) => {
    setModalMode('edit');
    setEditingEvidence(evidence);
  };

  const handleSave = (data: Record<string, unknown>) => {
    if (modalMode === 'create') {
      const { id, ...createData } = data;
      createMutation.mutate(createData as Parameters<typeof createMutation.mutate>[0]);
    } else {
      updateMutation.mutate(data as Parameters<typeof updateMutation.mutate>[0]);
    }
  };

  return (
    <section id="evidence" className="section" style={{ background: 'var(--section-even-bg)', position: 'relative' }}>
      <Container>
        <div className="section-header center">
          <Badge variant="yellow" className="section-badge">MOVs</Badge>
          <Heading as="h2" variant="h2" center className="section-title">
            Evidence of Learning
          </Heading>
          <Text size="lg" muted className="section-description" style={{ marginInline: 'auto' }}>
            Samples of my best coursework demonstrating competencies across institutional outcomes.
          </Text>
        </div>

        {isEditMode && (
          <div className="evidence-toolbar">
            <Button variant="primary" size="sm" onClick={handleAdd}>
              <Plus size={16} />
              Add Evidence
            </Button>
          </div>
        )}

        <div className="evidence-filters">
          <button
            className={`filter-btn ${selectedOutcome === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedOutcome('all')}
          >
            All Evidence
          </button>
          {outcomes.map((outcome) => (
            <button
              key={outcome.id}
              className={`filter-btn ${selectedOutcome === outcome.id ? 'active' : ''}`}
              onClick={() => setSelectedOutcome(outcome.id)}
            >
              {outcome.shortTitle}
            </button>
          ))}
        </div>

        <div className="evidence-grid">
          {filteredItems.map((evidence) => {
            const outcome = outcomes.find((o) => o.id === evidence.outcomeId);
            return (
              <EvidenceCard
                key={evidence.id}
                evidence={evidence}
                outcome={outcome}
                isEditMode={isEditMode}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            );
          })}
        </div>

        <div className="evidence-count">
          <Text size="sm" muted>
            Showing {filteredItems.length} of {evidenceItems.length} evidence items
          </Text>
        </div>
      </Container>

      {editingEvidence && (
        <EvidenceModal
          isOpen={!!editingEvidence}
          onClose={() => setEditingEvidence(null)}
          mode={modalMode}
          evidence={modalMode === 'edit' ? editingEvidence : undefined}
          onSave={handleSave}
        />
      )}

      <style>{`
        .evidence-toolbar {
          display: flex;
          justify-content: center;
          margin-bottom: var(--space-6);
        }
        .evidence-toolbar .btn {
          display: flex;
          align-items: center;
          gap: var(--space-2);
        }
        .evidence-filters {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-2);
          justify-content: center;
          margin-bottom: var(--space-8);
        }
        .filter-btn {
          padding: var(--space-2) var(--space-4);
          border-radius: var(--radius-full);
          font-size: var(--text-sm);
          font-weight: var(--weight-medium);
          color: var(--color-text-secondary);
          background: var(--color-card-bg);
          border: 1px solid var(--color-border);
          cursor: pointer;
          transition: all var(--duration-fast) var(--ease-in-out);
        }
        .filter-btn:hover {
          border-color: var(--color-accent);
          color: var(--color-text-primary);
        }
        .filter-btn.active {
          background: var(--color-accent);
          color: var(--color-burgundy);
          border-color: var(--color-accent);
        }
        .evidence-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-6);
        }
        @media (min-width: 640px) {
          .evidence-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (min-width: 1024px) {
          .evidence-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        .evidence-card {
          overflow: hidden;
          transition: transform var(--duration-normal) var(--ease-in-out),
            box-shadow var(--duration-normal) var(--ease-in-out);
        }
        .evidence-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
        }
        .evidence-card-actions {
          position: absolute;
          top: var(--space-2);
          left: var(--space-2);
          display: flex;
          gap: var(--space-1);
          z-index: 5;
        }
        .evidence-action-btn {
          display: flex;
          align-items: center;
          gap: var(--space-1);
          padding: var(--space-1) var(--space-3);
          border-radius: var(--radius-md);
          border: none;
          cursor: pointer;
          font-size: var(--text-xs);
          font-weight: var(--weight-semibold);
          transition: all var(--duration-fast) var(--ease-in-out);
        }
        .evidence-action-btn.edit {
          background: var(--color-accent);
          color: var(--color-burgundy);
        }
        .evidence-action-btn.delete {
          background: #fee2e2;
          color: #dc2626;
        }
        .evidence-action-btn:hover {
          transform: scale(1.05);
          box-shadow: var(--shadow-md);
        }
        .evidence-thumbnail {
          position: relative;
          height: 160px;
          overflow: hidden;
          background: var(--color-bg-secondary);
        }
        .evidence-thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .evidence-type-badge {
          position: absolute;
          top: var(--space-2);
          right: var(--space-2);
          display: flex;
          align-items: center;
          gap: var(--space-1);
          padding: var(--space-1) var(--space-2);
          background: var(--color-card-bg);
          border-radius: var(--radius-md);
          font-size: var(--text-xs);
          font-weight: var(--weight-medium);
          color: var(--color-text-secondary);
          box-shadow: var(--shadow-sm);
        }
        .evidence-body {
          padding: var(--space-4);
        }
        .evidence-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: var(--space-2);
        }
        .evidence-highlight {
          background: var(--evidence-highlight-bg);
          border-left: 3px solid var(--color-accent);
          padding: var(--space-3);
          border-radius: 0 var(--radius-md) var(--radius-md) 0;
          margin-bottom: var(--space-3);
        }
        .highlight-label {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          margin-bottom: var(--space-1);
          color: var(--color-accent);
        }
        .evidence-actions {
          display: flex;
          gap: var(--space-2);
        }
        .evidence-memo {
          margin-top: var(--space-3);
          padding: var(--space-3);
          background: var(--evidence-memo-bg);
          border-left: 3px solid var(--evidence-memo-border);
          border-radius: 0 var(--radius-md) var(--radius-md) 0;
        }
        .memo-header {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          margin-bottom: var(--space-2);
          color: var(--color-accent);
        }
        .evidence-count {
          text-align: center;
          margin-top: var(--space-6);
        }
      `}</style>
    </section>
  );
}
