import { useState } from 'react';
import { SectionModal } from '../ui/SectionModal';
import { useContent } from '../../context/ContentContext';

interface HeroModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface HeroForm {
  giantText: string;
  badge: string;
  headline: string;
  headlineAccent: string;
  description: string;
  ctaText: string;
}

export function HeroModal({ isOpen, onClose }: HeroModalProps) {
  const { content, updateSection } = useContent();
  const [form, setForm] = useState<HeroForm>(content.hero as HeroForm);

  const handleChange = (field: keyof HeroForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    updateSection('hero', form);
    onClose();
  };

  return (
    <SectionModal isOpen={isOpen} onClose={onClose} title="Edit Hero Section" onSave={handleSave}>
      <div className="modal-field">
        <label>Background Text</label>
        <input
          className="input"
          value={form.giantText}
          onChange={(e) => handleChange('giantText', e.target.value)}
        />
      </div>

      <div className="modal-field">
        <label>Badge Text</label>
        <input
          className="input"
          value={form.badge}
          onChange={(e) => handleChange('badge', e.target.value)}
        />
      </div>

      <div className="modal-row">
        <div className="modal-field">
          <label>Headline (line 1)</label>
          <input
            className="input"
            value={form.headline}
            onChange={(e) => handleChange('headline', e.target.value)}
          />
        </div>
        <div className="modal-field">
          <label>Headline Accent (line 2)</label>
          <input
            className="input"
            value={form.headlineAccent}
            onChange={(e) => handleChange('headlineAccent', e.target.value)}
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
        <label>CTA Button Text</label>
        <input
          className="input"
          value={form.ctaText}
          onChange={(e) => handleChange('ctaText', e.target.value)}
        />
      </div>
    </SectionModal>
  );
}
