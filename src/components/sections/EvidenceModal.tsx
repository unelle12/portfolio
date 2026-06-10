import { useState, useRef } from 'react';
import { SectionModal } from '../ui/SectionModal';
import { useContent } from '../../context/ContentContext';
import { Upload, Link2, X, FileText } from 'lucide-react';

interface EvidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'edit' | 'create';
  evidence?: {
    id: number;
    title: string;
    description: string;
    highlightedSection: string;
    memoNote: string;
    fileUrl: string;
    filePath: string | null;
    outcomeId: string;
    indicatorId: string;
    type: string;
    fileType: string;
    date: string;
    thumbnail: string;
  };
  onSave: (data: Record<string, unknown>) => void;
}

interface Outcome {
  id: string;
  title: string;
  shortTitle: string;
  indicators: Array<{ id: string; text: string; rating: number }>;
}

export function EvidenceModal({ isOpen, onClose, mode, evidence, onSave }: EvidenceModalProps) {
  const { content } = useContent();
  const selfAssessment = content.selfAssessment as { outcomes: Outcome[] } | null;
  const outcomes = selfAssessment?.outcomes ?? [];
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    title: evidence?.title ?? '',
    description: evidence?.description ?? '',
    highlightedSection: evidence?.highlightedSection ?? '',
    memoNote: evidence?.memoNote ?? '',
    fileUrl: evidence?.fileUrl ?? '',
    filePath: evidence?.filePath ?? null,
    outcomeId: evidence?.outcomeId ?? outcomes[0]?.id ?? '',
    indicatorId: evidence?.indicatorId ?? outcomes[0]?.indicators[0]?.id ?? '',
    type: evidence?.type ?? 'document',
    fileType: evidence?.fileType ?? 'pdf',
    date: evidence?.date ?? new Date().toISOString().split('T')[0],
    thumbnail: evidence?.thumbnail ?? '/assets/parallax/hero-placeholder.svg',
  });

  const [uploading, setUploading] = useState(false);
  const [urlMode, setUrlMode] = useState(!!evidence?.fileUrl && !evidence?.filePath);

  const selectedOutcome = outcomes.find((o) => o.id === form.outcomeId);
  const indicators = selectedOutcome?.indicators ?? [];

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleOutcomeChange = (outcomeId: string) => {
    const outcome = outcomes.find((o) => o.id === outcomeId);
    const firstIndicator = outcome?.indicators[0]?.id ?? '';
    setForm((prev) => ({
      ...prev,
      outcomeId,
      indicatorId: firstIndicator,
    }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success) {
        const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
        const fileTypeMap: Record<string, string> = { pdf: 'pdf', doc: 'doc', docx: 'doc', ppt: 'ppt', pptx: 'ppt', mp4: 'mp4', mov: 'mov', avi: 'avi', jpg: 'jpg', jpeg: 'jpg', png: 'png' };
        const typeMap: Record<string, string> = { mp4: 'video', mov: 'video', avi: 'video', webm: 'video' };
        setForm((prev) => ({
          ...prev,
          fileUrl: data.filepath,
          filePath: data.filepath,
          fileType: fileTypeMap[ext] ?? ext,
          type: typeMap[ext] ?? 'document',
        }));
      }
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveFile = () => {
    setForm((prev) => ({ ...prev, fileUrl: '', filePath: null }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSave = () => {
    // Validate required fields
    if (!form.title.trim()) {
      alert('Title is required');
      return;
    }
    if (!form.outcomeId) {
      alert('Outcome is required');
      return;
    }
    if (!form.indicatorId) {
      alert('Indicator is required');
      return;
    }

    onSave({
      ...(evidence?.id ? { id: evidence.id } : {}),
      ...form,
    });
    onClose();
  };

  const currentFileName = form.fileUrl
    ? form.filePath
      ? form.filePath.split('/').pop()
      : form.fileUrl.replace(/^https?:\/\//, '').split('/')[0]
    : null;

  return (
    <SectionModal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? 'Add New Evidence' : 'Edit Evidence'}
      onSave={handleSave}
    >
      <div className="modal-field">
        <label>Title *</label>
        <input
          className="input"
          value={form.title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="e.g., Systems Analysis Term Paper"
        />
      </div>

      <div className="modal-row">
        <div className="modal-field">
          <label>Outcome *</label>
          <select
            className="input"
            value={form.outcomeId}
            onChange={(e) => handleOutcomeChange(e.target.value)}
          >
            {outcomes.map((o) => (
              <option key={o.id} value={o.id}>{o.shortTitle}</option>
            ))}
          </select>
        </div>
        <div className="modal-field">
          <label>Indicator *</label>
          <select
            className="input"
            value={form.indicatorId}
            onChange={(e) => handleChange('indicatorId', e.target.value)}
          >
            {indicators.map((ind) => (
              <option key={ind.id} value={ind.id}>{ind.text}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="modal-row">
        <div className="modal-field">
          <label>Type</label>
          <select
            className="input"
            value={form.type}
            onChange={(e) => handleChange('type', e.target.value)}
          >
            <option value="document">Document</option>
            <option value="video">Video</option>
          </select>
        </div>
        <div className="modal-field">
          <label>Date</label>
          <input
            className="input"
            type="date"
            value={form.date}
            onChange={(e) => handleChange('date', e.target.value)}
          />
        </div>
      </div>

      <div className="modal-field">
        <label>Description</label>
        <textarea
          className="input textarea"
          rows={3}
          value={form.description}
          onChange={(e) => handleChange('description', e.target.value)}
        />
      </div>

      <div className="modal-field">
        <label>Highlighted Section</label>
        <input
          className="input"
          value={form.highlightedSection}
          onChange={(e) => handleChange('highlightedSection', e.target.value)}
        />
      </div>

      <div className="modal-field">
        <label>Memo Note</label>
        <textarea
          className="input textarea"
          rows={3}
          value={form.memoNote}
          onChange={(e) => handleChange('memoNote', e.target.value)}
        />
      </div>

      <p className="modal-section-label">File</p>

      <div className="evidence-file-toggle">
        <button
          type="button"
          className={`file-toggle-btn ${!urlMode ? 'active' : ''}`}
          onClick={() => setUrlMode(false)}
        >
          <Upload size={14} />
          Upload File
        </button>
        <button
          type="button"
          className={`file-toggle-btn ${urlMode ? 'active' : ''}`}
          onClick={() => setUrlMode(true)}
        >
          <Link2 size={14} />
          External URL
        </button>
      </div>

      {!urlMode ? (
        <div className="modal-field">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.ppt,.pptx,.mp4,.mov,.avi,.jpg,.jpeg,.png,.gif"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
          {currentFileName ? (
            <div className="file-preview">
              <FileText size={16} />
              <span className="file-preview-name">{currentFileName}</span>
              <button type="button" className="file-remove-btn" onClick={handleRemoveFile}>
                <X size={14} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="file-upload-btn"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              <Upload size={16} />
              {uploading ? 'Uploading...' : 'Choose File to Upload'}
            </button>
          )}
          <p className="file-hint">PDF, DOC, PPT, MP4, MOV, JPG, PNG (max recommended: 10MB)</p>
        </div>
      ) : (
        <div className="modal-field">
          <label>External URL</label>
          <input
            className="input"
            value={urlMode ? form.fileUrl : ''}
            onChange={(e) => {
              const url = e.target.value;
              setForm((prev) => ({ ...prev, fileUrl: url, filePath: null }));
            }}
            placeholder="https://drive.google.com/... or https://youtube.com/..."
          />
          <p className="file-hint">Paste a link to Google Drive, YouTube, or any online resource</p>
        </div>
      )}

      <style>{`
        .evidence-file-toggle {
          display: flex;
          gap: var(--space-2);
          margin-bottom: var(--space-3);
        }
        .file-toggle-btn {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-2) var(--space-3);
          border-radius: var(--radius-md);
          font-size: var(--text-sm);
          font-weight: var(--weight-medium);
          color: var(--color-text-secondary);
          background: var(--color-card-bg);
          border: 1px solid var(--color-border);
          cursor: pointer;
          transition: all var(--duration-fast) var(--ease-in-out);
        }
        .file-toggle-btn:hover {
          border-color: var(--color-accent);
        }
        .file-toggle-btn.active {
          background: var(--color-accent);
          color: var(--color-burgundy);
          border-color: var(--color-accent);
        }
        .file-upload-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-2);
          width: 100%;
          padding: var(--space-4);
          border-radius: var(--radius-md);
          border: 2px dashed var(--color-border);
          background: var(--color-bg-secondary);
          color: var(--color-text-secondary);
          font-size: var(--text-sm);
          cursor: pointer;
          transition: all var(--duration-fast) var(--ease-in-out);
        }
        .file-upload-btn:hover {
          border-color: var(--color-accent);
          color: var(--color-text-primary);
        }
        .file-upload-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .file-preview {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-3);
          border-radius: var(--radius-md);
          border: 1px solid var(--color-border);
          background: var(--color-bg-secondary);
        }
        .file-preview-name {
          flex: 1;
          font-size: var(--text-sm);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .file-remove-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          border-radius: var(--radius-full);
          border: none;
          background: none;
          color: var(--color-text-muted);
          cursor: pointer;
          transition: color var(--duration-fast) var(--ease-in-out);
        }
        .file-remove-btn:hover {
          color: #dc2626;
        }
        .file-hint {
          font-size: var(--text-xs);
          color: var(--color-text-muted);
          margin-top: var(--space-1);
        }
      `}</style>
    </SectionModal>
  );
}
