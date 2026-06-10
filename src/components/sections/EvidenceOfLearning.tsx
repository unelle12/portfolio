import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Container, Heading, Text, Badge, Button } from '../ui';
import { Plus } from 'lucide-react';
import { useContent } from '../../context/ContentContext';
import { api } from '~/trpc/react';
import { TermAccordion } from './TermAccordion';
import { TermModal } from './TermModal';
import { SubfolderModal } from './SubfolderModal';
import { EvidenceModal } from './EvidenceModal';

type Term = {
  id: number;
  name: string;
  description: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
  subfolders: {
    id: number;
    name: string;
    description: string | null;
    order: number;
    termId: number;
    createdAt: string;
    updatedAt: string;
    evidence: {
      id: number;
      title: string;
      type: string;
      fileType: string;
      description: string;
      thumbnail: string;
      fileUrl: string;
      filePath: string | null;
      highlightedSection: string;
      memoNote: string;
      date: string;
      subfolderId: number | null;
      createdAt: string;
      updatedAt: string;
    }[];
  }[];
};

export function EvidenceOfLearning() {
  const [expandedTermIds, setExpandedTermIds] = useState<Set<number>>(new Set());
  const [editingTerm, setEditingTerm] = useState<Term | null>(null);
  const [editingSubfolder, setEditingSubfolder] = useState<{ id: number; name: string; description: string | null; termId: number } | null>(null);
  const [editingEvidence, setEditingEvidence] = useState<Term['subfolders'][0]['evidence'][0] | null>(null);
  const [termModalMode, setTermModalMode] = useState<'create' | 'edit' | null>(null);
  const [subfolderModalMode, setSubfolderModalMode] = useState<'create' | 'edit' | null>(null);
  const [evidenceModalMode, setEvidenceModalMode] = useState<'create' | 'edit' | null>(null);
  const [creatingSubfolderForTermId, setCreatingSubfolderForTermId] = useState<number | null>(null);
  const [creatingEvidenceForSubfolderId, setCreatingEvidenceForSubfolderId] = useState<number | null>(null);

  const { isEditMode } = useContent();

  const { data: terms = [], refetch: refetchTerms } = api.evidence.getAll.useQuery();

  const reorderTermsMutation = api.evidence.reorderTerms.useMutation({
    onSuccess: () => void refetchTerms(),
  });

  const createTermMutation = api.evidence.createTerm.useMutation({
    onSuccess: () => void refetchTerms(),
    onError: (error) => console.error('createTerm error:', error.message, error),
  });

  const updateTermMutation = api.evidence.updateTerm.useMutation({
    onSuccess: () => void refetchTerms(),
  });

  const deleteTermMutation = api.evidence.deleteTerm.useMutation({
    onSuccess: () => void refetchTerms(),
  });

  const createSubfolderMutation = api.evidence.createSubfolder.useMutation({
    onSuccess: () => void refetchTerms(),
  });

  const updateSubfolderMutation = api.evidence.updateSubfolder.useMutation({
    onSuccess: () => void refetchTerms(),
  });

  const deleteSubfolderMutation = api.evidence.deleteSubfolder.useMutation({
    onSuccess: () => void refetchTerms(),
  });

  const createEvidenceMutation = api.evidence.create.useMutation({
    onSuccess: () => void refetchTerms(),
  });

  const updateEvidenceMutation = api.evidence.update.useMutation({
    onSuccess: () => void refetchTerms(),
  });

  const deleteEvidenceMutation = api.evidence.delete.useMutation({
    onSuccess: () => void refetchTerms(),
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = terms.findIndex((t) => t.id === active.id);
    const newIndex = terms.findIndex((t) => t.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      const newOrder = arrayMove(terms, oldIndex, newIndex).map((t) => t.id);
      reorderTermsMutation.mutate({ termIds: newOrder });
    }
  };

  const toggleTerm = (termId: number) => {
    setExpandedTermIds((prev) => {
      const next = new Set(prev);
      if (next.has(termId)) {
        next.delete(termId);
      } else {
        next.add(termId);
      }
      return next;
    });
  };

  const handleCreateTerm = () => {
    setEditingTerm(null);
    setTermModalMode('create');
  };

  const handleEditTerm = (term: Term) => {
    setEditingTerm(term);
    setTermModalMode('edit');
  };

  const handleDeleteTerm = (termId: number) => {
    if (window.confirm('Are you sure you want to delete this term and all its subfolders and evidence?')) {
      deleteTermMutation.mutate({ id: termId });
    }
  };

  const handleSaveTerm = (data: { id?: number; name: string; description: string }) => {
    console.log('handleSaveTerm called with:', data, 'mode:', termModalMode);
    if (termModalMode === 'create') {
      createTermMutation.mutate(data);
    } else if (data.id) {
      updateTermMutation.mutate({ id: data.id, name: data.name, description: data.description });
    }
  };

  const handleCreateSubfolder = (termId: number) => {
    setCreatingSubfolderForTermId(termId);
    setEditingSubfolder(null);
    setSubfolderModalMode('create');
  };

  const handleEditSubfolder = (subfolder: { id: number; name: string; description: string | null; termId: number }) => {
    setEditingSubfolder(subfolder);
    setSubfolderModalMode('edit');
  };

  const handleDeleteSubfolder = (subfolderId: number) => {
    if (window.confirm('Are you sure you want to delete this subfolder and all its evidence?')) {
      deleteSubfolderMutation.mutate({ id: subfolderId });
    }
  };

  const handleSaveSubfolder = (data: { id?: number; termId: number; name: string; description: string }) => {
    if (subfolderModalMode === 'create') {
      const payload = { termId: data.termId, name: data.name, description: data.description || undefined };
      console.log('createSubfolder payload:', payload);
      createSubfolderMutation.mutate(payload, {
        onError: (error) => console.error('createSubfolder error:', error.message),
      });
    } else if (data.id) {
      updateSubfolderMutation.mutate({ id: data.id, name: data.name, description: data.description });
    }
  };

  const handleCreateEvidence = (subfolderId: number) => {
    setCreatingEvidenceForSubfolderId(subfolderId);
    setEditingEvidence(null);
    setEvidenceModalMode('create');
  };

  const handleEditEvidence = (evidence: Term['subfolders'][0]['evidence'][0]) => {
    setEditingEvidence(evidence);
    setEvidenceModalMode('edit');
  };

  const handleDeleteEvidence = (evidenceId: number) => {
    if (window.confirm('Are you sure you want to delete this evidence item?')) {
      deleteEvidenceMutation.mutate({ id: evidenceId });
    }
  };

  const handleSaveEvidence = (data: Record<string, unknown>) => {
    if (evidenceModalMode === 'create') {
      createEvidenceMutation.mutate({
        title: data.title as string,
        subfolderId: creatingEvidenceForSubfolderId,
        type: data.type as string,
        fileType: data.fileType as string,
        description: data.description as string,
        fileUrl: data.fileUrl as string,
        filePath: data.filePath as string | null,
        date: data.date as string,
        highlightedSection: data.highlightedSection as string,
        memoNote: data.memoNote as string,
        thumbnail: data.thumbnail as string,
      });
    } else if (data.id) {
      updateEvidenceMutation.mutate({
        id: data.id as number,
        title: data.title as string,
        subfolderId: data.subfolderId as number | null,
        type: data.type as string,
        fileType: data.fileType as string,
        description: data.description as string,
        fileUrl: data.fileUrl as string,
        filePath: data.filePath as string | null,
        date: data.date as string,
        highlightedSection: data.highlightedSection as string,
        memoNote: data.memoNote as string,
        thumbnail: data.thumbnail as string,
      });
    }
  };

  const totalEvidence = terms.reduce((acc, term) =>
    acc + term.subfolders.reduce((acc2, sf) => acc2 + sf.evidence.length, 0), 0
  );

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
            <Button variant="primary" size="sm" onClick={handleCreateTerm}>
              <Plus size={16} />
              Add Term
            </Button>
          </div>
        )}

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={terms.map((t) => t.id)} strategy={verticalListSortingStrategy}>
            <div className="terms-container">
              {terms.map((term) => (
                <TermAccordion
                  key={term.id}
                  term={term as Term}
                  isEditMode={isEditMode}
                  isExpanded={expandedTermIds.has(term.id)}
                  onToggle={() => toggleTerm(term.id)}
                  onEditTerm={handleEditTerm}
                  onDeleteTerm={handleDeleteTerm}
                  onCreateSubfolder={handleCreateSubfolder}
                  onEditSubfolder={handleEditSubfolder}
                  onDeleteSubfolder={handleDeleteSubfolder}
                  onCreateEvidence={handleCreateEvidence}
                  onEditEvidence={handleEditEvidence}
                  onDeleteEvidence={handleDeleteEvidence}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        <div className="evidence-count">
          <Text size="sm" muted>
            {terms.length} terms, {totalEvidence} evidence items
          </Text>
        </div>
      </Container>

      {termModalMode !== null && (
        <TermModal
          isOpen={!!editingTerm || termModalMode === 'create'}
          onClose={() => {
            setEditingTerm(null);
            setTermModalMode(null);
          }}
          mode={termModalMode}
          term={editingTerm ?? undefined}
          onSave={handleSaveTerm}
        />
      )}

      {subfolderModalMode !== null && (
        <SubfolderModal
          isOpen={!!editingSubfolder || subfolderModalMode === 'create'}
          onClose={() => {
            setEditingSubfolder(null);
            setSubfolderModalMode(null);
            setCreatingSubfolderForTermId(null);
          }}
          mode={subfolderModalMode}
          termId={creatingSubfolderForTermId ?? editingSubfolder?.termId ?? 1}
          subfolder={editingSubfolder ?? undefined}
          onSave={handleSaveSubfolder}
        />
      )}

      {evidenceModalMode !== null && (
        <EvidenceModal
          isOpen={!!editingEvidence || evidenceModalMode === 'create'}
          onClose={() => {
            setEditingEvidence(null);
            setEvidenceModalMode(null);
            setCreatingEvidenceForSubfolderId(null);
          }}
          mode={evidenceModalMode}
          evidence={editingEvidence ?? undefined}
          onSave={handleSaveEvidence}
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
        .terms-container {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }
        .evidence-count {
          text-align: center;
          margin-top: var(--space-6);
        }
      `}</style>
    </section>
  );
}
