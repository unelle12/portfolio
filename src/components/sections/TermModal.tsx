import { useState } from 'react';
import { SectionModal } from '../ui/SectionModal';

interface TermModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  term?: {
    id: number;
    name: string;
    description: string | null;
  };
  onSave: (data: { id?: number; name: string; description: string }) => void;
}

export function TermModal({ isOpen, onClose, mode, term, onSave }: TermModalProps) {
  const [form, setForm] = useState({
    name: term?.name ?? '',
    description: term?.description ?? '',
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!form.name.trim()) {
      alert('Term name is required');
      return;
    }

    onSave({
      ...(term?.id ? { id: term.id } : {}),
      name: form.name,
      description: form.description,
    });
    onClose();
  };

  return (
    <SectionModal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? 'Add New Term' : 'Edit Term'}
      onSave={handleSave}
    >
      <div className="modal-field">
        <label>Term Name *</label>
        <input
          className="input"
          value={form.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="e.g., Term 1, Term 2, Term 3"
        />
      </div>

      <div className="modal-field">
        <label>Description (Optional)</label>
        <textarea
          className="input textarea"
          rows={3}
          value={form.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Brief description of this term..."
        />
      </div>
    </SectionModal>
  );
}
