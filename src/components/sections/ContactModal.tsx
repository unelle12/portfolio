import { useState } from 'react';
import { SectionModal } from '../ui/SectionModal';
import { useContent } from '../../context/ContentContext';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

interface ContactForm {
  message: string;
  socialLinks: SocialLink[];
}

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const { content, updateSection } = useContent();
  const contactData = content.contact as ContactForm;
  const [form, setForm] = useState<ContactForm>({
    message: contactData.message,
    socialLinks: contactData.socialLinks.map((link) => ({ ...link })),
  });

  const handleMessageChange = (value: string) => {
    setForm((prev) => ({ ...prev, message: value }));
  };

  const handleLinkChange = (index: number, field: keyof SocialLink, value: string) => {
    setForm((prev) => {
      const socialLinks = prev.socialLinks.map((link, i) =>
        i === index ? { ...link, [field]: value } : link
      );
      return { ...prev, socialLinks };
    });
  };

  const addLink = () => {
    setForm((prev) => ({
      ...prev,
      socialLinks: [...prev.socialLinks, { platform: '', url: '', icon: 'linkedin' }],
    }));
  };

  const removeLink = (index: number) => {
    setForm((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_, i) => i !== index),
    }));
  };

  const handleSave = () => {
    updateSection('contact', form);
    onClose();
  };

  return (
    <SectionModal isOpen={isOpen} onClose={onClose} title="Edit Contact Section" onSave={handleSave}>
      <div className="modal-field">
        <label>Section Description</label>
        <textarea
          className="input textarea"
          rows={3}
          value={form.message}
          onChange={(e) => handleMessageChange(e.target.value)}
        />
      </div>

      <p className="modal-section-label">Social Links</p>

      {form.socialLinks.map((link, i) => (
        <div key={i} className="modal-field" style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: 'var(--space-3)', position: 'relative' }}>
          <div className="modal-row">
            <div className="modal-field">
              <label>Platform</label>
              <input
                className="input"
                value={link.platform}
                onChange={(e) => handleLinkChange(i, 'platform', e.target.value)}
                placeholder="LinkedIn"
              />
            </div>
            <div className="modal-field">
              <label>Icon</label>
              <select
                className="input"
                value={link.icon}
                onChange={(e) => handleLinkChange(i, 'icon', e.target.value)}
              >
                <option value="linkedin">LinkedIn</option>
                <option value="github">GitHub</option>
                <option value="mail">Email</option>
              </select>
            </div>
          </div>
          <div className="modal-field">
            <label>URL</label>
            <input
              className="input"
              value={link.url}
              onChange={(e) => handleLinkChange(i, 'url', e.target.value)}
              placeholder="https://..."
            />
          </div>
          {form.socialLinks.length > 1 && (
            <button
              type="button"
              onClick={() => removeLink(i)}
              style={{
                position: 'absolute',
                top: 'var(--space-2)',
                right: 'var(--space-2)',
                background: 'none',
                border: 'none',
                color: '#dc2626',
                cursor: 'pointer',
                fontSize: 'var(--text-xs)',
              }}
            >
              Remove
            </button>
          )}
        </div>
      ))}

      <button
        type="button"
        className="btn btn-ghost btn-sm"
        onClick={addLink}
        style={{ alignSelf: 'flex-start' }}
      >
        + Add Social Link
      </button>
    </SectionModal>
  );
}
