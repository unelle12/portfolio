import { useState } from 'react';
import { SectionModal } from '../ui/SectionModal';

interface SubfolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  termId: number;
  subfolder?: {
    id: number;
    name: string;
    description: string | null;
    termId: number;
  };
  onSave: (data: { id?: number; termId: number; name: string; description: string }) => void;
}

export function SubfolderModal({ isOpen, onClose, mode, termId, subfolder, onSave }: SubfolderModalProps) {
  const [form, setForm] = useState({
    name: subfolder?.name ?? '',
    description: subfolder?.description ?? '',
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!form.name.trim()) {
      alert('Subfolder name is required');
      return;
    }

    onSave({
      ...(subfolder?.id ? { id: subfolder.id } : {}),
      termId: subfolder?.termId ?? termId,
      name: form.name,
      description: form.description,
    });
    onClose();
  };

  return (
    <SectionModal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? 'Add New Subfolder' : 'Edit Subfolder'}
      onSave={handleSave}
    >
      <div className="modal-field">
        <label>Subfolder Name *</label>
        <input
          className="input"
          value={form.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="e.g., Module 1, Project, Assignments"
        />
      </div>

      <div className="modal-field">
        <label>Description (Optional)</label>
        <textarea
          className="input textarea"
          rows={3}
          value={form.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Brief description of this subfolder..."
        />
      </div>
    </SectionModal>
  );
}
