import { useState } from 'react';
import { SectionModal } from '../ui/SectionModal';
import { useContent } from '../../context/ContentContext';
import { api } from '~/trpc/react';
import { Plus, Trash2 } from 'lucide-react';

interface AddReflectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type FlatEvidence = {
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
};

type FlatSubfolder = {
  evidence: FlatEvidence[];
  children: FlatSubfolder[];
};

function flattenEvidence(subfolders: FlatSubfolder[]): FlatEvidence[] {
  return subfolders.flatMap((sf) => [...sf.evidence, ...flattenEvidence(sf.children)]);
}

export function AddReflectionModal({ isOpen, onClose }: AddReflectionModalProps) {
  const { content, addReflection, updateReflection } = useContent();
  const reflections = (content.reflections as Array<{ evidenceId: string; paragraphs: string[] }>) ?? [];
  const { data: terms = [] } = api.evidence.getAll.useQuery();

  const evidenceItems: FlatEvidence[] = terms.flatMap((term) =>
    flattenEvidence(term.subfolders as FlatSubfolder[])
  );

  const evidenceWithoutReflection = evidenceItems.filter(
    (ev) => !reflections.some((r) => r.evidenceId === `ev-${ev.id}`)
  );

  const [selectedEvidenceId, setSelectedEvidenceId] = useState('');
  const [paragraphs, setParagraphs] = useState<string[]>(['']);

  const handleParagraphChange = (index: number, value: string) => {
    setParagraphs((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const handleAddParagraph = () => {
    setParagraphs((prev) => [...prev, '']);
  };

  const handleRemoveParagraph = (index: number) => {
    setParagraphs((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!selectedEvidenceId) {
      alert('Please select an evidence item');
      return;
    }

    const nonEmptyParagraphs = paragraphs.filter((p) => p.trim() !== '');
    addReflection(selectedEvidenceId);
    updateReflection(selectedEvidenceId, nonEmptyParagraphs);

    setSelectedEvidenceId('');
    setParagraphs(['']);
    onClose();
  };

  return (
    <SectionModal isOpen={isOpen} onClose={onClose} title="Add New Reflection" onSave={handleSave}>
      <div className="modal-field">
        <label>Evidence *</label>
        <select
          className="input"
          value={selectedEvidenceId}
          onChange={(e) => setSelectedEvidenceId(e.target.value)}
        >
          <option value="">-- Select an evidence item --</option>
          {evidenceWithoutReflection.map((ev) => (
            <option key={ev.id} value={`ev-${ev.id}`}>
              {ev.title}
            </option>
          ))}
        </select>
        {evidenceWithoutReflection.length === 0 && (
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 'var(--space-1)' }}>
            All evidence items already have reflections.
          </p>
        )}
      </div>

      {paragraphs.map((paragraph, i) => (
        <div key={i} className="modal-field">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-1)' }}>
            <label>Paragraph {i + 1}</label>
            {paragraphs.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveParagraph(i)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: '24px', height: '24px', border: 'none', borderRadius: 'var(--radius-sm)',
                  background: 'none', color: 'var(--color-text-muted)', cursor: 'pointer',
                }}
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
          <textarea
            className="input textarea"
            rows={5}
            value={paragraph}
            onChange={(e) => handleParagraphChange(i, e.target.value)}
            placeholder="Write your reflection paragraph..."
          />
        </div>
      ))}

      <button
        type="button"
        onClick={handleAddParagraph}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-2)',
          width: '100%', padding: 'var(--space-3)', border: '2px dashed var(--color-border)',
          borderRadius: 'var(--radius-md)', background: 'none', color: 'var(--color-text-secondary)',
          fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)', cursor: 'pointer',
        }}
      >
        <Plus size={16} />
        Add Paragraph
      </button>
    </SectionModal>
  );
}
