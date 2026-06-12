import { useState, useEffect } from 'react';
import { SectionModal } from '../ui/SectionModal';
import { useContent } from '../../context/ContentContext';
import { api } from '~/trpc/react';
import { Plus, Trash2 } from 'lucide-react';

interface ReflectionsModalProps {
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

export function ReflectionsModal({ isOpen, onClose }: ReflectionsModalProps) {
  const { content, updateReflection, addReflection, deleteReflection } = useContent();
  const reflections = (content.reflections as Array<{ evidenceId: string; paragraphs: string[] }>) ?? [];
  const { data: terms = [] } = api.evidence.getAll.useQuery();

  const evidenceItems: FlatEvidence[] = terms.flatMap((term) =>
    flattenEvidence(term.subfolders as FlatSubfolder[])
  );

  const [selectedIdx, setSelectedIdx] = useState(0);
  const [paragraphs, setParagraphs] = useState<string[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [addEvidenceId, setAddEvidenceId] = useState('');

  const currentReflection = reflections[selectedIdx];

  useEffect(() => {
    if (isOpen) {
      setSelectedIdx(0);
      setParagraphs(reflections[0]?.paragraphs ?? []);
      setIsAdding(false);
      setAddEvidenceId('');
    }
  }, [isOpen]);

  useEffect(() => {
    if (currentReflection) {
      setParagraphs([...currentReflection.paragraphs]);
    }
  }, [selectedIdx]);

  const evidenceWithoutReflection = evidenceItems.filter(
    (ev) => !reflections.some((r) => r.evidenceId === `ev-${ev.id}`)
  );

  const handleSelectChange = (idx: number) => {
    setIsAdding(false);
    setSelectedIdx(idx);
    setParagraphs([...(reflections[idx]?.paragraphs ?? [])]);
  };

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

  const handleAddReflection = () => {
    if (!addEvidenceId) return;
    addReflection(addEvidenceId);
    const newIdx = reflections.length;
    setSelectedIdx(newIdx);
    setParagraphs([]);
    setIsAdding(false);
    setAddEvidenceId('');
  };

  const handleDeleteReflection = () => {
    if (!currentReflection) return;
    const evidenceId = currentReflection.evidenceId;
    if (!confirm('Are you sure you want to delete this reflection?')) return;
    deleteReflection(evidenceId);
    const newIdx = Math.min(selectedIdx, reflections.length - 2);
    setSelectedIdx(Math.max(0, newIdx));
  };

  const handleSave = () => {
    if (currentReflection) {
      updateReflection(currentReflection.evidenceId, paragraphs);
    }
    onClose();
  };

  const currentEvidence = currentReflection
    ? evidenceItems.find(
        (ev) => ev.id.toString() === currentReflection.evidenceId.replace('ev-', '')
      )
    : null;

  return (
    <SectionModal isOpen={isOpen} onClose={onClose} title="Edit Reflections" onSave={handleSave}>
      <div className="modal-field">
        <div className="reflections-modal-actions">
          <select
            className="input"
            value={isAdding ? 'add' : selectedIdx}
            onChange={(e) => {
              if (e.target.value === 'add') {
                setIsAdding(true);
              } else {
                handleSelectChange(Number(e.target.value));
              }
            }}
          >
            {reflections.map((r, i) => {
              const ev = evidenceItems.find(
                (e) => e.id.toString() === r.evidenceId.replace('ev-', '')
              );
              return (
                <option key={r.evidenceId} value={i}>
                  {ev?.title || r.evidenceId}
                </option>
              );
            })}
            {evidenceWithoutReflection.length > 0 && (
              <option value="add">+ Add New Reflection</option>
            )}
          </select>
          {currentReflection && !isAdding && (
            <button
              type="button"
              className="reflection-delete-btn"
              onClick={handleDeleteReflection}
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>

      {isAdding ? (
        <>
          <div className="modal-field">
            <label>Select Evidence</label>
            <select
              className="input"
              value={addEvidenceId}
              onChange={(e) => setAddEvidenceId(e.target.value)}
            >
              <option value="">-- Choose an evidence item --</option>
              {evidenceWithoutReflection.map((ev) => (
                <option key={ev.id} value={`ev-${ev.id}`}>
                  {ev.title}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            className="reflection-add-confirm-btn"
            onClick={handleAddReflection}
            disabled={!addEvidenceId}
          >
            <Plus size={16} />
            Add Reflection
          </button>
        </>
      ) : currentReflection ? (
        <>
          {currentEvidence && (
            <div className="reflection-modal-info">
              <strong>{currentEvidence.title}</strong>
              <span>{currentEvidence.type} · {currentEvidence.date}</span>
            </div>
          )}
          {paragraphs.map((paragraph, i) => (
            <div key={i} className="modal-field reflection-paragraph-field">
              <div className="reflection-paragraph-header">
                <label>Paragraph {i + 1}</label>
                {paragraphs.length > 1 && (
                  <button
                    type="button"
                    className="reflection-remove-para-btn"
                    onClick={() => handleRemoveParagraph(i)}
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
              />
            </div>
          ))}
          <button
            type="button"
            className="reflection-add-para-btn"
            onClick={handleAddParagraph}
          >
            <Plus size={16} />
            Add Paragraph
          </button>
        </>
      ) : (
        <div className="reflection-modal-empty">
          <p>No reflections yet. Click "+ Add New Reflection" to create one.</p>
        </div>
      )}

      <style>{`
        .reflections-modal-actions {
          display: flex;
          gap: var(--space-2);
          align-items: center;
        }
        .reflections-modal-actions select {
          flex: 1;
        }
        .reflection-delete-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          background: var(--color-card-bg);
          color: #e74c3c;
          cursor: pointer;
          flex-shrink: 0;
          transition: all var(--duration-fast) var(--ease-in-out);
        }
        .reflection-delete-btn:hover {
          background: #e74c3c;
          color: white;
          border-color: #e74c3c;
        }
        .reflection-modal-info {
          display: flex;
          flex-direction: column;
          gap: var(--space-1);
          padding: var(--space-3);
          background: var(--color-bg-secondary);
          border-radius: var(--radius-md);
          margin-bottom: var(--space-3);
        }
        .reflection-modal-info strong {
          font-size: var(--text-sm);
          color: var(--color-text-primary);
        }
        .reflection-modal-info span {
          font-size: var(--text-xs);
          color: var(--color-text-muted);
        }
        .reflection-paragraph-field {
          position: relative;
        }
        .reflection-paragraph-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: var(--space-1);
        }
        .reflection-paragraph-header label {
          font-size: var(--text-sm);
          font-weight: var(--weight-medium);
          color: var(--color-text-secondary);
        }
        .reflection-remove-para-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          border: none;
          border-radius: var(--radius-sm);
          background: none;
          color: var(--color-text-muted);
          cursor: pointer;
          transition: all var(--duration-fast) var(--ease-in-out);
        }
        .reflection-remove-para-btn:hover {
          background: rgba(231, 76, 60, 0.1);
          color: #e74c3c;
        }
        .reflection-add-para-btn,
        .reflection-add-confirm-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-2);
          width: 100%;
          padding: var(--space-3);
          border: 2px dashed var(--color-border);
          border-radius: var(--radius-md);
          background: none;
          color: var(--color-text-secondary);
          font-size: var(--text-sm);
          font-weight: var(--weight-medium);
          cursor: pointer;
          transition: all var(--duration-fast) var(--ease-in-out);
        }
        .reflection-add-para-btn:hover,
        .reflection-add-confirm-btn:hover {
          border-color: var(--color-accent);
          color: var(--color-accent);
          background: rgba(0, 0, 0, 0.02);
        }
        .reflection-add-confirm-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
        .reflection-modal-empty {
          text-align: center;
          padding: var(--space-6);
          color: var(--color-text-muted);
        }
        .reflection-modal-empty p {
          font-size: var(--text-sm);
          margin: 0;
        }
      `}</style>
    </SectionModal>
  );
}
