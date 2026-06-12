import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ChevronDown, ChevronRight, GripVertical, Plus, Edit2, Trash2 } from 'lucide-react';
import { SubfolderSection } from './SubfolderSection';

type SubfolderItem = {
  id: number;
  name: string;
  description: string | null;
  order: number;
  termId: number;
  parentId: number | null;
  evidence: Array<{
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
  }>;
  children: SubfolderItem[];
};

function countEvidence(subfolders: SubfolderItem[]): number {
  return subfolders.reduce((acc, sf) => acc + sf.evidence.length + countEvidence(sf.children), 0);
}

function countSubfolders(subfolders: SubfolderItem[]): number {
  return subfolders.reduce((acc, sf) => acc + 1 + countSubfolders(sf.children), 0);
}

interface TermAccordionProps {
  term: {
    id: number;
    name: string;
    description: string | null;
    order: number;
    subfolders: SubfolderItem[];
  };
  isEditMode: boolean;
  isExpanded: boolean;
  onToggle: () => void;
  onEditTerm: (term: TermAccordionProps['term']) => void;
  onDeleteTerm: (termId: number) => void;
  onCreateSubfolder: (termId: number, parentId?: number | null) => void;
  onEditSubfolder: (subfolder: { id: number; name: string; description: string | null; termId: number }) => void;
  onDeleteSubfolder: (subfolderId: number) => void;
  onCreateEvidence: (subfolderId: number) => void;
  onEditEvidence: (evidence: SubfolderItem['evidence'][0]) => void;
  onDeleteEvidence: (evidenceId: number) => void;
}

export function TermAccordion({
  term,
  isEditMode,
  isExpanded,
  onToggle,
  onEditTerm,
  onDeleteTerm,
  onCreateSubfolder,
  onEditSubfolder,
  onDeleteSubfolder,
  onCreateEvidence,
  onEditEvidence,
  onDeleteEvidence,
}: TermAccordionProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: term.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const totalEvidence = countEvidence(term.subfolders);
  const totalSubfolders = countSubfolders(term.subfolders);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`term-accordion ${isExpanded ? 'expanded' : ''} ${isDragging ? 'dragging' : ''}`}
    >
      <div className="term-header">
        {isEditMode && (
          <button
            className="drag-handle"
            {...attributes}
            {...listeners}
            type="button"
          >
            <GripVertical size={16} />
          </button>
        )}

        <button
          className="term-toggle"
          onClick={onToggle}
          type="button"
        >
          {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
        </button>

        <div className="term-info">
          <h3 className="term-name">{term.name}</h3>
          {term.description && (
            <p className="term-description">{term.description}</p>
          )}
          <span className="term-count">
            {totalSubfolders} subfolders, {totalEvidence} evidence items
          </span>
        </div>

        {isEditMode && (
          <div className="term-actions">
            <button
              className="action-btn edit"
              onClick={() => onEditTerm(term)}
              type="button"
              title="Edit term"
            >
              <Edit2 size={14} />
            </button>
            <button
              className="action-btn delete"
              onClick={() => onDeleteTerm(term.id)}
              type="button"
              title="Delete term"
            >
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </div>

      {isExpanded && (
        <div className="term-content">
          {term.subfolders.map((subfolder) => (
            <SubfolderSection
              key={subfolder.id}
              subfolder={subfolder}
              isEditMode={isEditMode}
              onEdit={() => onEditSubfolder(subfolder)}
              onDelete={() => onDeleteSubfolder(subfolder.id)}
              onCreateSubfolder={onCreateSubfolder}
              onEditSubfolder={onEditSubfolder}
              onDeleteSubfolder={onDeleteSubfolder}
              onCreateEvidence={onCreateEvidence}
              onEditEvidence={onEditEvidence}
              onDeleteEvidence={onDeleteEvidence}
            />
          ))}

          {isEditMode && (
            <button
              className="add-subfolder-btn"
              onClick={() => onCreateSubfolder(term.id)}
              type="button"
            >
              <Plus size={16} />
              Add Subfolder
            </button>
          )}
        </div>
      )}

      <style>{`
        .term-accordion {
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          background: var(--color-card-bg);
          margin-bottom: var(--space-4);
          overflow: hidden;
          transition: all var(--duration-normal) var(--ease-in-out);
        }
        .term-accordion.expanded {
          box-shadow: var(--shadow-md);
        }
        .term-accordion.dragging {
          box-shadow: var(--shadow-xl);
          z-index: 10;
        }
        .term-header {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-4) var(--space-6);
          background: var(--color-bg-secondary);
          border-bottom: 1px solid var(--color-border);
        }
        .term-accordion.expanded .term-header {
          border-bottom: none;
        }
        .drag-handle {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border: none;
          background: none;
          color: var(--color-text-muted);
          cursor: grab;
          border-radius: var(--radius-md);
          transition: all var(--duration-fast) var(--ease-in-out);
        }
        .drag-handle:hover {
          background: var(--color-border);
          color: var(--color-text-primary);
        }
        .drag-handle:active {
          cursor: grabbing;
        }
        .term-toggle {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border: none;
          background: none;
          color: var(--color-text-primary);
          cursor: pointer;
          border-radius: var(--radius-md);
          transition: all var(--duration-fast) var(--ease-in-out);
        }
        .term-toggle:hover {
          background: var(--color-border);
        }
        .term-info {
          flex: 1;
          min-width: 0;
        }
        .term-name {
          font-family: var(--font-heading);
          font-size: var(--text-lg);
          font-weight: var(--weight-bold);
          color: var(--color-text-primary);
          margin: 0;
        }
        .term-description {
          font-size: var(--text-sm);
          color: var(--color-text-secondary);
          margin: var(--space-1) 0 0;
        }
        .term-count {
          font-size: var(--text-xs);
          color: var(--color-text-muted);
          margin-top: var(--space-1);
          display: block;
        }
        .term-actions {
          display: flex;
          gap: var(--space-2);
        }
        .action-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border: none;
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all var(--duration-fast) var(--ease-in-out);
        }
        .action-btn.edit {
          background: var(--color-accent);
          color: var(--color-burgundy);
        }
        .action-btn.delete {
          background: var(--color-delete-bg);
          color: var(--color-delete-text);
        }
        .action-btn:hover {
          transform: scale(1.05);
        }
        .term-content {
          padding: var(--space-4);
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }
        .add-subfolder-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-2);
          padding: var(--space-3);
          border: 2px dashed var(--color-border);
          border-radius: var(--radius-md);
          background: transparent;
          color: var(--color-text-secondary);
          font-size: var(--text-sm);
          font-weight: var(--weight-medium);
          cursor: pointer;
          transition: all var(--duration-fast) var(--ease-in-out);
        }
        .add-subfolder-btn:hover {
          border-color: var(--color-accent);
          color: var(--color-text-primary);
          background: var(--color-bg-secondary);
        }
      `}</style>
    </div>
  );
}
