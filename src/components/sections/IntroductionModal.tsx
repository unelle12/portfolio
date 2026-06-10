import { useState } from 'react';
import { SectionModal } from '../ui/SectionModal';
import { useContent } from '../../context/ContentContext';

interface IntroductionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PersonalInfo {
  name: string;
  title: string;
  tagline: string;
  email: string;
  linkedin: string;
  github: string;
}

interface IntroductionForm {
  personal: PersonalInfo;
  greeting: string;
  bio: string[];
  purpose: string;
  guidingPrinciples: string[];
}

export function IntroductionModal({ isOpen, onClose }: IntroductionModalProps) {
  const { content, updateSection } = useContent();
  const introData = content.introduction as IntroductionForm;
  const [form, setForm] = useState<IntroductionForm>({
    personal: { ...introData.personal },
    greeting: introData.greeting,
    bio: [...introData.bio],
    purpose: introData.purpose,
    guidingPrinciples: [...introData.guidingPrinciples],
  });

  const handlePersonalChange = (field: keyof PersonalInfo, value: string) => {
    setForm((prev) => ({
      ...prev,
      personal: { ...prev.personal, [field]: value },
    }));
  };

  const handleBioChange = (index: number, value: string) => {
    setForm((prev) => {
      const bio = [...prev.bio];
      bio[index] = value;
      return { ...prev, bio };
    });
  };

  const handlePrincipleChange = (index: number, value: string) => {
    setForm((prev) => {
      const principles = [...prev.guidingPrinciples];
      principles[index] = value;
      return { ...prev, guidingPrinciples: principles };
    });
  };

  const handleSave = () => {
    updateSection('introduction', form);
    onClose();
  };

  return (
    <SectionModal isOpen={isOpen} onClose={onClose} title="Edit Introduction" onSave={handleSave}>
      <p className="modal-section-label">Personal Info</p>

      <div className="modal-row">
        <div className="modal-field">
          <label>Name</label>
          <input
            className="input"
            value={form.personal.name}
            onChange={(e) => handlePersonalChange('name', e.target.value)}
          />
        </div>
        <div className="modal-field">
          <label>Title</label>
          <input
            className="input"
            value={form.personal.title}
            onChange={(e) => handlePersonalChange('title', e.target.value)}
          />
        </div>
      </div>

      <div className="modal-field">
        <label>Greeting</label>
        <input
          className="input"
          value={form.greeting}
          onChange={(e) => setForm((prev) => ({ ...prev, greeting: e.target.value }))}
        />
      </div>

      <p className="modal-section-label">Bio</p>

      {form.bio.map((paragraph, i) => (
        <div key={i} className="modal-field">
          <label>Paragraph {i + 1}</label>
          <textarea
            className="input textarea"
            rows={4}
            value={paragraph}
            onChange={(e) => handleBioChange(i, e.target.value)}
          />
        </div>
      ))}

      <p className="modal-section-label">Purpose</p>

      <div className="modal-field">
        <label>Purpose of This Portfolio</label>
        <textarea
          className="input textarea"
          rows={3}
          value={form.purpose}
          onChange={(e) => setForm((prev) => ({ ...prev, purpose: e.target.value }))}
        />
      </div>

      <p className="modal-section-label">Guiding Principles</p>

      {form.guidingPrinciples.map((principle, i) => (
        <div key={i} className="modal-field">
          <label>Principle {i + 1} (Title: Description)</label>
          <input
            className="input"
            value={principle}
            onChange={(e) => handlePrincipleChange(i, e.target.value)}
          />
        </div>
      ))}
    </SectionModal>
  );
}
