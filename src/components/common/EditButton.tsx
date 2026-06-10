import { Pencil } from 'lucide-react';
import { useContent } from '../../context/ContentContext';

interface EditButtonProps {
  onClick?: () => void;
  label?: string;
}

export function EditButton({ onClick, label = 'Edit section' }: EditButtonProps) {
  const { isEditMode } = useContent();

  if (!isEditMode) return null;

  return (
    <>
      <button
        className="edit-section-btn"
        onClick={onClick}
        aria-label={label}
        type="button"
      >
        <Pencil size={14} />
      </button>

      <style>{`
        .edit-section-btn {
          position: absolute;
          top: var(--space-4);
          right: var(--space-4);
          width: 32px;
          height: 32px;
          border-radius: var(--radius-full);
          background: var(--color-accent);
          color: var(--color-burgundy);
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
          transition: all var(--duration-fast) var(--ease-in-out);
          box-shadow: var(--shadow-md);
        }
        .edit-section-btn:hover {
          transform: scale(1.1);
          box-shadow: var(--shadow-lg);
        }
      `}</style>
    </>
  );
}
