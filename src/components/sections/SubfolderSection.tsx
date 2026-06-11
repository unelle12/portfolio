import { useState } from 'react';
import { ChevronDown, ChevronRight, Plus, Edit2, Trash2, FileText, Video, ExternalLink, StickyNote, Highlighter } from 'lucide-react';
import { FileViewer } from './FileViewer';

type EvidenceItem = {
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
};

type SubfolderItem = {
  id: number;
  name: string;
  description: string | null;
  order: number;
  termId: number;
  parentId: number | null;
  evidence: EvidenceItem[];
  children: SubfolderItem[];
};

function countEvidence(subfolders: SubfolderItem[]): number {
  return subfolders.reduce((acc, sf) => acc + sf.evidence.length + countEvidence(sf.children), 0);
}

function countSubfolders(subfolders: SubfolderItem[]): number {
  return subfolders.reduce((acc, sf) => acc + 1 + countSubfolders(sf.children), 0);
}

interface SubfolderSectionProps {
  subfolder: SubfolderItem;
  isEditMode: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onCreateSubfolder: (termId: number, parentId?: number | null) => void;
  onEditSubfolder: (subfolder: { id: number; name: string; description: string | null; termId: number }) => void;
  onDeleteSubfolder: (subfolderId: number) => void;
  onCreateEvidence: (subfolderId: number) => void;
  onEditEvidence: (evidence: EvidenceItem) => void;
  onDeleteEvidence: (evidenceId: number) => void;
}

function EvidenceCard({ evidence, isEditMode, onEdit, onDelete }: {
  evidence: EvidenceItem;
  isEditMode: boolean;
  onEdit: (evidence: EvidenceItem) => void;
  onDelete: (evidenceId: number) => void;
}) {
  const [showMemo, setShowMemo] = useState(false);
  const [viewerEvidence, setViewerEvidence] = useState<EvidenceItem | null>(null);

  const TypeIcon = evidence.type === 'video' ? Video : FileText;

  return (
    <div className={`evidence-card ${viewerEvidence ? 'viewer-open' : ''}`}>
      {isEditMode && (
        <div className="evidence-card-actions">
          <button
            className="evidence-action-btn edit"
            onClick={() => onEdit(evidence)}
            type="button"
          >
            Edit
          </button>
          <button
            className="evidence-action-btn delete"
            onClick={() => onDelete(evidence.id)}
            type="button"
          >
            <Trash2 size={12} />
          </button>
        </div>
      )}

      {evidence.thumbnail !== '/assets/parallax/hero-placeholder.svg' && (
        <div className="evidence-thumbnail">
          <img src={evidence.thumbnail} alt={evidence.title} loading="lazy" />
          <div className="evidence-type-badge">
            <TypeIcon size={14} />
            <span>{evidence.fileType.toUpperCase()}</span>
          </div>
        </div>
      )}

      <div className="evidence-body">
        <div className="evidence-meta">
          <span className="evidence-date">{evidence.date}</span>
        </div>

        <h4 className="evidence-title">{evidence.title}</h4>

        <p className="evidence-description">{evidence.description}</p>

        {evidence.highlightedSection && (
          <div className="evidence-highlight">
            <div className="highlight-label">
              <Highlighter size={14} />
              <span className="highlight-text">{evidence.highlightedSection}</span>
            </div>
            {evidence.memoNote && <p className="highlight-memo">{evidence.memoNote}</p>}
          </div>
        )}

        <div className="evidence-actions">
          <button
            className="evidence-action-btn memo"
            onClick={() => setShowMemo(!showMemo)}
            type="button"
          >
            <StickyNote size={14} />
            {showMemo ? 'Hide Memo' : 'Show Memo'}
          </button>

          {evidence.fileUrl && (
            <button
              className="evidence-action-btn view"
              onClick={(e) => { e.stopPropagation(); setViewerEvidence(evidence); }}
              type="button"
            >
              <ExternalLink size={14} />
              View File
            </button>
          )}
        </div>

        {showMemo && evidence.memoNote && (
          <div className="evidence-memo">
            <div className="memo-header">
              <StickyNote size={14} />
              <span className="memo-title">Memo to Evaluator</span>
            </div>
            <p className="memo-content">{evidence.memoNote}</p>
          </div>
        )}
      </div>

      <FileViewer
        isOpen={!!viewerEvidence}
        onClose={() => setViewerEvidence(null)}
        title={viewerEvidence?.title ?? ''}
        fileUrl={viewerEvidence?.fileUrl ?? ''}
        fileType={viewerEvidence?.fileType ?? ''}
        type={viewerEvidence?.type ?? ''}
      />
    </div>
  );
}

export function SubfolderSection({
  subfolder,
  isEditMode,
  onEdit,
  onDelete,
  onCreateSubfolder,
  onEditSubfolder,
  onDeleteSubfolder,
  onCreateEvidence,
  onEditEvidence,
  onDeleteEvidence,
}: SubfolderSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const totalEvidence = subfolder.evidence.length + countEvidence(subfolder.children);
  const totalSubfolders = countSubfolders(subfolder.children);

  return (
    <>
      <div className={`subfolder-section depth-${Math.min(subfolder.parentId ? 1 : 0, 2)}`}>
        <div className="subfolder-header">
          <button
            className="subfolder-toggle"
            onClick={() => setIsExpanded(!isExpanded)}
            type="button"
          >
            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>

          <div className="subfolder-info">
            <h4 className="subfolder-name">{subfolder.name}</h4>
            {subfolder.description && (
              <p className="subfolder-description">{subfolder.description}</p>
            )}
            <span className="subfolder-count">
              {totalSubfolders > 0 && `${totalSubfolders} subfolders, `}
              {totalEvidence} evidence items
            </span>
          </div>

          {isEditMode && (
            <div className="subfolder-actions">
              <button
                className="action-btn add-nested"
                onClick={() => onCreateSubfolder(subfolder.termId, subfolder.id)}
                type="button"
                title="Add nested subfolder"
              >
                <Plus size={12} />
              </button>
              <button
                className="action-btn edit"
                onClick={onEdit}
                type="button"
                title="Edit subfolder"
              >
                <Edit2 size={12} />
              </button>
              <button
                className="action-btn delete"
                onClick={onDelete}
                type="button"
                title="Delete subfolder"
              >
                <Trash2 size={12} />
              </button>
            </div>
          )}
        </div>

        {isExpanded && (
          <div className="subfolder-content">
            {subfolder.children.length > 0 && (
              <div className="nested-subfolders">
                {subfolder.children.map((child) => (
                  <SubfolderSection
                    key={child.id}
                    subfolder={child}
                    isEditMode={isEditMode}
                    onEdit={() => onEditSubfolder(child)}
                    onDelete={() => onDeleteSubfolder(child.id)}
                    onCreateSubfolder={onCreateSubfolder}
                    onEditSubfolder={onEditSubfolder}
                    onDeleteSubfolder={onDeleteSubfolder}
                    onCreateEvidence={onCreateEvidence}
                    onEditEvidence={onEditEvidence}
                    onDeleteEvidence={onDeleteEvidence}
                  />
                ))}
              </div>
            )}

            <div className="evidence-grid">
              {subfolder.evidence.map((evidence) => (
                <EvidenceCard
                  key={evidence.id}
                  evidence={evidence}
                  isEditMode={isEditMode}
                  onEdit={onEditEvidence}
                  onDelete={onDeleteEvidence}
                />
              ))}
            </div>

            {isEditMode && (
              <button
                className="add-evidence-btn"
                onClick={() => onCreateEvidence(subfolder.id)}
                type="button"
              >
                <Plus size={14} />
                Add Evidence
              </button>
            )}
          </div>
        )}
      </div>

      <style>{`
        .subfolder-section {
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          background: var(--color-bg-secondary);
          overflow: hidden;
        }
        .subfolder-section.expanded {
          background: var(--color-card-bg);
        }
        .subfolder-section.depth-1 {
          border-left: 3px solid var(--color-accent);
        }
        .subfolder-header {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-3) var(--space-4);
          background: var(--color-bg-secondary);
          border-bottom: 1px solid var(--color-border);
        }
        .subfolder-section.expanded .subfolder-header {
          border-bottom: 1px solid var(--color-border);
        }
        .subfolder-toggle {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          border: none;
          background: none;
          color: var(--color-text-primary);
          cursor: pointer;
          border-radius: var(--radius-sm);
          transition: all var(--duration-fast) var(--ease-in-out);
          flex-shrink: 0;
        }
        .subfolder-toggle:hover {
          background: var(--color-border);
        }
        .subfolder-info {
          flex: 1;
          min-width: 0;
        }
        .subfolder-name {
          font-size: var(--text-base);
          font-weight: var(--weight-semibold);
          color: var(--color-text-primary);
          margin: 0;
        }
        .subfolder-description {
          font-size: var(--text-xs);
          color: var(--color-text-secondary);
          margin: var(--space-1) 0 0;
        }
        .subfolder-count {
          font-size: var(--text-xs);
          color: var(--color-text-muted);
          margin-top: var(--space-1);
          display: block;
        }
        .subfolder-actions {
          display: flex;
          gap: var(--space-1);
        }
        .action-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          border: none;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: all var(--duration-fast) var(--ease-in-out);
        }
        .action-btn.edit {
          background: var(--color-accent);
          color: var(--color-burgundy);
        }
        .action-btn.delete {
          background: #fee2e2;
          color: #dc2626;
        }
        .action-btn.add-nested {
          background: #dbeafe;
          color: #2563eb;
        }
        .action-btn:hover {
          transform: scale(1.05);
        }
        .subfolder-content {
          padding: var(--space-4);
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }
        .nested-subfolders {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }
        .evidence-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-4);
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
          position: relative;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          background: var(--color-card-bg);
          overflow: hidden;
          transition: all var(--duration-normal) var(--ease-in-out);
        }
        .evidence-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }
        .evidence-card.viewer-open,
        .evidence-card.viewer-open:hover {
          transform: none;
          transition: none;
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
          padding: var(--space-1) var(--space-2);
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
        .evidence-action-btn.memo {
          background: var(--color-bg-secondary);
          color: var(--color-text-secondary);
        }
        .evidence-action-btn.view {
          background: var(--color-bg-secondary);
          color: var(--color-text-secondary);
          text-decoration: none;
        }
        .evidence-action-btn:hover {
          transform: scale(1.05);
        }
        .evidence-thumbnail {
          position: relative;
          height: 120px;
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
          padding: var(--space-3);
        }
        .evidence-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: var(--space-2);
        }
        .evidence-date {
          font-size: var(--text-xs);
          color: var(--color-text-muted);
        }
        .evidence-title {
          font-size: var(--text-sm);
          font-weight: var(--weight-semibold);
          color: var(--color-text-primary);
          margin: 0 0 var(--space-2);
          line-height: 1.3;
        }
        .evidence-description {
          font-size: var(--text-xs);
          color: var(--color-text-secondary);
          margin: 0 0 var(--space-3);
          line-height: 1.5;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .evidence-highlight {
          background: var(--evidence-highlight-bg);
          border-left: 3px solid var(--color-accent);
          padding: var(--space-2);
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
        .highlight-text {
          font-size: var(--text-xs);
          font-weight: var(--weight-semibold);
        }
        .highlight-memo {
          font-size: var(--text-xs);
          color: var(--color-text-secondary);
          margin: 0;
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
        .memo-title {
          font-size: var(--text-xs);
          font-weight: var(--weight-semibold);
        }
        .memo-content {
          font-size: var(--text-xs);
          color: var(--color-text-primary);
          margin: 0;
        }
        .add-evidence-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-2);
          width: 100%;
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
        .add-evidence-btn:hover {
          border-color: var(--color-accent);
          color: var(--color-text-primary);
          background: var(--color-bg-secondary);
        }
      `}</style>
    </>
  );
}
