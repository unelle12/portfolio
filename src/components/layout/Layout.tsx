"use client";

import { type ReactNode, useEffect } from "react";
import { Footer } from "./Footer";
import { BackToTop } from "../common";
import { useContent } from "~/context/ContentContext";
import { Pencil, X } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
}

function EditModeIndicator() {
  const { isEditMode, setEditMode } = useContent();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "e") {
        e.preventDefault();
        setEditMode(!isEditMode);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isEditMode, setEditMode]);

  if (!isEditMode) return null;

  return (
    <div className="edit-mode-indicator">
      <Pencil size={14} />
      <span>Edit Mode</span>
      <span className="edit-mode-shortcut">Ctrl+E to exit</span>
      <button
        className="edit-mode-close"
        onClick={() => setEditMode(false)}
        aria-label="Exit edit mode"
      >
        <X size={14} />
      </button>

      <style>{`
        .edit-mode-indicator {
          position: fixed;
          bottom: var(--space-4);
          left: var(--space-4);
          display: flex;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-2) var(--space-4);
          background: var(--color-accent);
          color: var(--color-burgundy);
          border-radius: var(--radius-full);
          font-size: var(--text-sm);
          font-weight: var(--weight-semibold);
          z-index: var(--z-tooltip);
          box-shadow: var(--shadow-lg);
          animation: slideUp 200ms ease-out;
        }
        .edit-mode-shortcut {
          font-weight: var(--weight-normal);
          opacity: 0.7;
          font-size: var(--text-xs);
        }
        .edit-mode-close {
          display: flex;
          align-items: center;
          justify-content: center;
          background: none;
          border: none;
          color: inherit;
          cursor: pointer;
          padding: 2px;
          border-radius: var(--radius-full);
          opacity: 0.7;
          transition: opacity var(--duration-fast) var(--ease-in-out);
        }
        .edit-mode-close:hover {
          opacity: 1;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="app">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <main id="main-content" className="app-main">
        {children}
      </main>
      <Footer />
      <BackToTop />
      <EditModeIndicator />
    </div>
  );
}
