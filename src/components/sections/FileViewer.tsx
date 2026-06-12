import { useEffect, useCallback, useState } from 'react';
import { X, ExternalLink } from 'lucide-react';

interface FileViewerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  fileUrl: string;
  fileType: string;
  type: string;
}

function getViewerContent(fileUrl: string, fileType: string, type: string) {
  const ext = fileType.toLowerCase();

  if (type === 'video' || ['mp4', 'mov', 'avi', 'webm'].includes(ext)) {
    return (
      <video
        controls
        autoPlay
        style={{ width: '100%', maxHeight: '80vh', borderRadius: 'var(--radius-md)' }}
      >
        <source src={fileUrl} />
        Your browser does not support this video format.
      </video>
    );
  }

  if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(ext)) {
    return (
      <img
        src={fileUrl}
        alt=""
        style={{ maxWidth: '100%', maxHeight: '80vh', borderRadius: 'var(--radius-md)', objectFit: 'contain' }}
      />
    );
  }

  if (ext === 'pdf') {
    const pdfViewUrl = `/api/files/proxy?url=${encodeURIComponent(fileUrl)}`;
    return (
      <embed
        src={pdfViewUrl}
        type="application/pdf"
        style={{ width: '100%', height: '80vh', borderRadius: 'var(--radius-md)' }}
      />
    );
  }

  if (['doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx'].includes(ext)) {
    const officeUrl = `/api/files/proxy?url=${encodeURIComponent(fileUrl)}`;
    return (
      <embed
        src={officeUrl}
        type="application/octet-stream"
        style={{ width: '100%', height: '80vh', borderRadius: 'var(--radius-md)' }}
      />
    );
  }

  return null;
}

function getExternalEmbedUrl(fileUrl: string): string | null {
  const url = fileUrl.trim();

  const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/]+)/;
  const youtubeMatch = youtubeRegex.exec(url);
  if (youtubeMatch) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
  }

  const vimeoRegex = /vimeo\.com\/(\d+)/;
  const vimeoMatch = vimeoRegex.exec(url);
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }

  return null;
}

export function FileViewer({ isOpen, onClose, title, fileUrl, fileType, type }: FileViewerProps) {
  const [mounted, setMounted] = useState(false);
  const [gdriveError, setGdriveError] = useState(false);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => setMounted(true));
      setGdriveError(false);
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      setMounted(false);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen || !fileUrl) return null;

  const isYouTube = /(?:youtube\.com|youtu\.be)/.exec(fileUrl) !== null;
  const isVimeo = /vimeo\.com/.exec(fileUrl) !== null;
  const isGoogleDrive = /drive\.google\.com/.exec(fileUrl) !== null;
  const isEmbeddableExternal = isYouTube || isVimeo;

  const viewerContent = getViewerContent(fileUrl, fileType, type);

  return (
    <div className={`file-viewer-overlay ${mounted ? 'mounted' : ''}`} onClick={onClose}>
      <div className="file-viewer-modal" onClick={(e) => e.stopPropagation()}>
        <div className="file-viewer-header">
          <span className="file-viewer-title">{title}</span>
          <div className="file-viewer-actions">
            <a
              className="file-viewer-btn"
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink size={14} />
              Open in New Tab
            </a>
            <button className="file-viewer-close" onClick={onClose} type="button">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="file-viewer-content">
          {isGoogleDrive && !gdriveError ? (
            <iframe
              src={`/api/files/proxy?url=${encodeURIComponent(fileUrl)}`}
              style={{ width: '100%', height: '80vh', border: 'none', borderRadius: 'var(--radius-md)' }}
              title="Google Drive Viewer"
              onError={() => setGdriveError(true)}
            />
          ) : isGoogleDrive && gdriveError ? (
            <div className="file-viewer-fallback">
              <p>Unable to preview this Google Drive file.</p>
              <a
                className="file-viewer-btn primary"
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink size={14} />
                Open in Google Drive
              </a>
            </div>
          ) : viewerContent ? (
            viewerContent
          ) : isEmbeddableExternal ? (
            <iframe
              src={getExternalEmbedUrl(fileUrl) ?? fileUrl}
              style={{ width: '100%', height: '80vh', border: 'none', borderRadius: 'var(--radius-md)' }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Embedded Content"
            />
          ) : (
            <div className="file-viewer-fallback">
              <p>This file type cannot be previewed in the browser.</p>
              <a
                className="file-viewer-btn primary"
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink size={14} />
                Open in New Tab
              </a>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .file-viewer-overlay {
          position: fixed;
          inset: 0;
          z-index: 1000;
          background: rgba(0, 0, 0, 0.85);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--space-4);
          opacity: 0;
          transition: opacity 0.2s ease-out;
        }
        .file-viewer-overlay.mounted {
          opacity: 1;
        }
        .file-viewer-modal {
          background: var(--color-card-bg);
          border-radius: var(--radius-xl);
          width: 95vw;
          height: 92vh;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          transform: scale(0.95);
          transition: transform 0.2s ease-out;
        }
        .file-viewer-overlay.mounted .file-viewer-modal {
          transform: scale(1);
        }
        .file-viewer-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-3) var(--space-5);
          border-bottom: 1px solid var(--color-border);
          background: var(--color-bg-secondary);
          flex-shrink: 0;
        }
        .file-viewer-title {
          font-size: var(--text-sm);
          font-weight: var(--weight-semibold);
          color: var(--color-text-primary);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          flex: 1;
          margin-right: var(--space-4);
        }
        .file-viewer-actions {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          flex-shrink: 0;
        }
        .file-viewer-btn {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-2) var(--space-3);
          border-radius: var(--radius-md);
          font-size: var(--text-xs);
          font-weight: var(--weight-medium);
          color: var(--color-text-secondary);
          background: var(--color-card-bg);
          border: 1px solid var(--color-border);
          text-decoration: none;
          cursor: pointer;
          transition: all var(--duration-fast) var(--ease-in-out);
        }
        .file-viewer-btn:hover {
          border-color: var(--color-accent);
          color: var(--color-text-primary);
        }
        .file-viewer-btn.primary {
          background: var(--color-accent);
          color: var(--color-burgundy);
          border-color: var(--color-accent);
        }
        .file-viewer-close {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border: none;
          border-radius: var(--radius-md);
          background: none;
          color: var(--color-text-muted);
          cursor: pointer;
          transition: all var(--duration-fast) var(--ease-in-out);
        }
        .file-viewer-close:hover {
          background: var(--color-border);
          color: var(--color-text-primary);
        }
        .file-viewer-content {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--space-4);
          overflow: auto;
          background: #1a1a1a;
        }
        .file-viewer-fallback {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-4);
          color: #999;
          text-align: center;
        }
        .file-viewer-fallback p {
          font-size: var(--text-sm);
          margin: 0;
        }
      `}</style>
    </div>
  );
}
