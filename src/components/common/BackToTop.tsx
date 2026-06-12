import { useState, useEffect, useCallback } from 'react';
import { ChevronUp } from 'lucide-react';

export function BackToTop() {
  const [visible, setVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    setVisible(scrollTop > 400);
    setScrollProgress(progress);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!visible) return null;

  const circumference = 2 * Math.PI * 18;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <button
      onClick={scrollToTop}
      className="back-to-top"
      aria-label="Back to top"
      title="Back to top"
    >
      <svg
        className="back-to-top-progress"
        width="48"
        height="48"
        viewBox="0 0 48 48"
        style={{ position: 'absolute', top: 0, left: 0, transform: 'rotate(-90deg)' }}
      >
        <circle
          cx="24"
          cy="24"
          r="18"
          fill="none"
          stroke="var(--color-teal-light)"
          strokeWidth="2"
          opacity="0.3"
        />
        <circle
          cx="24"
          cy="24"
          r="18"
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: 'stroke-dashoffset 0.1s ease-out' }}
        />
      </svg>
      <ChevronUp size={20} style={{ position: 'relative', zIndex: 1 }} />
    </button>
  );
}
