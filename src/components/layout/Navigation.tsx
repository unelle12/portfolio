import { useState, useCallback, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { ThemeToggle } from '../common';

const NAV_LINKS = [
  { href: '#introduction', label: 'Introduction' },
  { href: '#assessment', label: 'Self-Assessment' },
  { href: '#evidence', label: 'Evidence' },
  { href: '#reflections', label: 'Reflections' },
  { href: '#retrospection', label: 'Retrospection' },
  { href: '#contact', label: 'Contact' },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleLinkClick = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <nav
      className={`nav ${scrolled ? 'nav-scrolled' : ''}`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container nav-inner">
        <a href="#" className="nav-logo">
          Portfolio
        </a>

        <div className="nav-links">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="nav-link"
            >
              {link.label}
            </a>
          ))}
          <ThemeToggle />
        </div>

        <button
          className="nav-mobile-toggle"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div
        id="mobile-menu"
        className={`nav-mobile ${isOpen ? 'open' : ''}`}
        aria-hidden={!isOpen}
      >
        {NAV_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="nav-link"
            onClick={handleLinkClick}
          >
            {link.label}
          </a>
        ))}
        <div className="nav-mobile-footer">
          <ThemeToggle />
        </div>
      </div>

      <div
        className={`nav-overlay ${isOpen ? 'visible' : ''}`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />
    </nav>
  );
}
