import { useState } from 'react';
import { Container, Heading, Text, Badge, Card, Button, Input, Textarea } from '../ui';
import { Send, Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { useContent } from '../../context/ContentContext';
import { EditButton } from '../common/EditButton';
import { ContactModal } from './ContactModal';

const GithubIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

const LinkedinIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const SOCIAL_ICONS = {
  linkedin: LinkedinIcon,
  github: GithubIcon,
  mail: Mail,
};

interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

export function Contact() {
  const { content, isEditMode } = useContent();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const contact = content.contact as {
    message: string;
    socialLinks: SocialLink[];
  } | null;

  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState('idle');

  const handleChange = (e) => {
    setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setStatus('success');
    setFormState({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setStatus('idle'), 5000);
  };

  const socialLinks = contact?.socialLinks ?? [];

  return (
    <section id="contact" className="section" style={{ background: 'var(--section-odd-bg)', position: 'relative' }}>
      {isEditMode && <EditButton onClick={() => setIsModalOpen(true)} label="Edit Contact" />}

      <Container>
        <div className="section-header center">
          <Badge variant="teal" className="section-badge">Get in Touch</Badge>
          <Heading as="h2" variant="h2" center className="section-title">
            Contact
          </Heading>
          <Text size="lg" muted className="section-description" style={{ marginInline: 'auto' }}>
            {contact?.message ?? 'Feel free to reach out!'}
          </Text>
        </div>

        <div className="contact-layout">
          <Card padding="lg" className="contact-form-card">
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-grid form-grid-2">
                <Input
                  id="contact-name"
                  name="name"
                  label="Name"
                  placeholder="Your name"
                  value={formState.name}
                  onChange={handleChange}
                  required
                />
                <Input
                  id="contact-email"
                  name="email"
                  type="email"
                  label="Email"
                  placeholder="your@email.com"
                  value={formState.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <Input
                id="contact-subject"
                name="subject"
                label="Subject"
                placeholder="What is this about?"
                value={formState.subject}
                onChange={handleChange}
                required
              />
              <Textarea
                id="contact-message"
                name="message"
                label="Message"
                placeholder="Write your message here..."
                rows={5}
                value={formState.message}
                onChange={handleChange}
                required
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={status === 'submitting'}
                className="contact-submit"
              >
                {status === 'submitting' ? (
                  <>
                    <span className="spinner" />
                    Sending...
                  </>
                ) : status === 'success' ? (
                  <>
                    <CheckCircle size={18} />
                    Message Sent!
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Send Message
                  </>
                )}
              </Button>

              {status === 'error' && (
                <div className="contact-error">
                  <AlertCircle size={16} />
                  <Text size="sm">Something went wrong. Please try again.</Text>
                </div>
              )}
            </form>
          </Card>

          <div className="contact-info">
            <Card padding="lg" className="contact-info-card">
              <Heading as="h4" variant="h5" style={{ marginBottom: 'var(--space-4)' }}>
                Connect with Me
              </Heading>
              <Text size="base" muted style={{ marginBottom: 'var(--space-6)' }}>
                Feel free to reach out through the form or connect with me on social media.
              </Text>

              <div className="contact-social-links">
                {socialLinks.map((link) => {
                  const IconComponent = SOCIAL_ICONS[link.icon];
                  return (
                    <a
                      key={link.platform}
                      href={link.url}
                      className="contact-social-link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div className="contact-social-icon">
                        <IconComponent />
                      </div>
                      <div className="contact-social-text">
                        <Text size="base" style={{ fontWeight: 'var(--weight-medium)' }}>
                          {link.platform}
                        </Text>
                        <Text size="sm" muted>
                          {link.url.replace('mailto:', '').replace('https://', '')}
                        </Text>
                      </div>
                    </a>
                  );
                })}
              </div>
            </Card>
          </div>
        </div>
      </Container>

      <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <style>{`
        .contact-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-6);
        }
        @media (min-width: 768px) {
          .contact-layout {
            grid-template-columns: 1.5fr 1fr;
          }
        }
        .contact-form {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }
        .contact-submit {
          margin-top: var(--space-2);
        }
        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid transparent;
          border-top-color: currentColor;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }
        .contact-error {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          color: #dc2626;
        }
        .contact-info-card {
          background: var(--color-bg-secondary);
        }
        .contact-social-links {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }
        .contact-social-link {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-3) var(--space-4);
          border-radius: var(--radius-lg);
          background: var(--contact-social-bg);
          transition: all var(--duration-fast) var(--ease-in-out);
        }
        .contact-social-link:hover {
          background: var(--contact-social-hover);
          transform: translateX(4px);
        }
        .contact-social-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          border-radius: var(--radius-lg);
          background: var(--color-card-bg);
          color: var(--color-accent);
          flex-shrink: 0;
        }
        .contact-social-text {
          min-width: 0;
        }
      `}</style>
    </section>
  );
}
