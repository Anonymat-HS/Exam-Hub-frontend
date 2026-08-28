import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

const TONES = {
  violet: 'bg-gradient-to-br from-primary-600 to-primary-700 text-white shadow-md shadow-primary-200',
  danger: 'bg-red-50 text-red-600',
};

export function Modal({ open, onClose, title, icon: Icon, tone = 'violet', children }) {
  const contentRef = useRef(null);
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        onCloseRef.current();
        return;
      }
      if (e.key === 'Tab' && contentRef.current) {
        const focusable = contentRef.current.querySelectorAll(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    const timer = setTimeout(() => {
      const field = contentRef.current?.querySelector('input:not([type="hidden"]), textarea, select');
      const fallback = contentRef.current?.querySelector('button:not([disabled])');
      (field ?? fallback)?.focus();
    }, 50);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
      clearTimeout(timer);
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div ref={contentRef} className="animate-scale-in relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-5 sm:p-6 shadow-xl">
        <button
          onClick={onClose}
          aria-label="Fermer"
          className="absolute right-4 top-4 rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-200"
        >
          <X size={18} />
        </button>
        {Icon && (
          <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${TONES[tone]}`}>
            <Icon size={22} />
          </div>
        )}
        <h2 className="mb-4 pr-8 text-lg font-bold text-navy">{title}</h2>
        {children}
      </div>
    </div>,
    document.body,
  );
}
