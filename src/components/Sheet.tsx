import { useEffect, type ReactNode } from 'react';

/** Bottom Sheet – dient als Dialog fuer Bewertung und Rezeptauswahl. */
export function Sheet({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div className="sheet-backdrop" onClick={onClose} role="presentation">
      <div
        className="sheet"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sheet-handle" />
        <div className="row-between" style={{ marginBottom: 14 }}>
          <h2>{title}</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Schließen">
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
