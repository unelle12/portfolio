import { type ReactNode } from 'react';
import { X } from 'lucide-react';

interface SectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  onSave: () => void;
  saveLabel?: string;
  saveDisabled?: boolean;
  children: ReactNode;
}

export function SectionModal({ isOpen, onClose, title, onSave, saveLabel = 'Save Changes', saveDisabled = false, children }: SectionModalProps) {
  if (!isOpen) return null;

  return (
    <>
      <div className="section-modal-overlay" onClick={onClose}>
        <div className="section-modal" onClick={(e) => e.stopPropagation()}>
          <div className="section-modal-header">
            <h2>{title}</h2>
            <button className="btn btn-ghost btn-sm" onClick={onClose}>
              <X size={20} />
            </button>
          </div>

          <form className="section-modal-body" onSubmit={(e) => { e.preventDefault(); onSave(); }}>
            {children}

            <div className="section-modal-footer">
              <button type="button" className="btn btn-ghost" onClick={onClose}>
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={saveDisabled}
              >
                {saveLabel}
              </button>
            </div>
          </form>
        </div>
      </div>

      <style>{`
        .section-modal-overlay {
          position: fixed;
          inset: 0;
          background: var(--color-overlay);
          z-index: var(--z-modal);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--space-4);
          animation: fadeIn 200ms ease-out;
        }
        .section-modal {
          background: var(--color-card-bg);
          border-radius: var(--radius-xl);
          width: 100%;
          max-width: 600px;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          box-shadow: var(--shadow-xl);
        }
        .section-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--space-4) var(--space-6);
          border-bottom: 1px solid var(--color-border);
        }
        .section-modal-header h2 {
          font-family: var(--font-heading);
          font-size: var(--text-xl);
          font-weight: var(--weight-bold);
          color: var(--color-text-primary);
          margin: 0;
        }
        .section-modal-body {
          padding: var(--space-6);
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }
        .section-modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: var(--space-3);
          padding: var(--space-4) var(--space-6);
          border-top: 1px solid var(--color-border);
        }
        .section-modal-footer .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .modal-field {
          display: flex;
          flex-direction: column;
          gap: var(--space-1);
        }
        .modal-field label {
          font-size: var(--text-sm);
          font-weight: var(--weight-medium);
          color: var(--color-text-primary);
        }
        .modal-field .input,
        .modal-field .textarea {
          width: 100%;
          padding: var(--space-2) var(--space-3);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          font-size: var(--text-sm);
          color: var(--color-text-primary);
          background: var(--color-card-bg);
          transition: border-color var(--duration-fast) var(--ease-in-out);
          font-family: var(--font-sans);
        }
        .modal-field .input:focus,
        .modal-field .textarea:focus {
          outline: none;
          border-color: var(--color-accent);
        }
        .modal-field .textarea {
          resize: vertical;
          min-height: 80px;
        }
        .modal-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-4);
        }
        .modal-section-label {
          font-family: var(--font-heading);
          font-size: var(--text-base);
          font-weight: var(--weight-bold);
          color: var(--color-text-primary);
          padding-bottom: var(--space-2);
          border-bottom: 1px solid var(--color-border);
          margin-top: var(--space-2);
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @media (max-width: 640px) {
          .section-modal {
            max-height: 100vh;
            border-radius: 0;
          }
          .modal-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}
