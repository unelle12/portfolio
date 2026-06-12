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
    <button
      className="edit-section-btn"
      onClick={onClick}
      aria-label={label}
      type="button"
    >
      <Pencil size={14} />
    </button>
  );
}
