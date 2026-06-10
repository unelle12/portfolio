import { useState } from 'react';
import { SectionModal } from '../ui/SectionModal';
import { useContent } from '../../context/ContentContext';

interface RetrospectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface RetrospectionData {
  paragraphs: string[];
}

export function RetrospectionModal({ isOpen, onClose }: RetrospectionModalProps) {
  const { content, updateSection } = useContent();
  const retrospectionData = content.retrospection as RetrospectionData;
  const [paragraphs, setParagraphs] = useState(() => [...retrospectionData.paragraphs]);

  const handleChange = (index: number, value: string) => {
    setParagraphs((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const handleSave = () => {
    updateSection('retrospection', { paragraphs });
    onClose();
  };

  return (
    <SectionModal isOpen={isOpen} onClose={onClose} title="Edit Retrospection" onSave={handleSave}>
      {paragraphs.map((paragraph, i) => (
        <div key={i} className="modal-field">
          <label>Paragraph {i + 1}</label>
          <textarea
            className="input textarea"
            rows={5}
            value={paragraph}
            onChange={(e) => handleChange(i, e.target.value)}
          />
        </div>
      ))}
    </SectionModal>
  );
}
