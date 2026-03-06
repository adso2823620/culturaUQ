'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Download } from 'lucide-react';

interface PDFModalProps {
  url: string;
  titulo: string;
  onClose: () => void;
}

export default function PDFModal({ url, titulo, onClose }: PDFModalProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return createPortal(
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 px-4 py-6"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl h-full max-h-[90vh] bg-[#1E2B5C] rounded-2xl overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 flex-shrink-0">
          <p className="text-white text-sm truncate pr-4">{titulo}</p>
          <div className="flex items-center gap-3 flex-shrink-0">
            <a
              href={url}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 hover:text-white transition-colors"
              aria-label="Descargar PDF"
            >
              <Download className="w-5 h-5" />
            </a>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white transition-colors"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="flex-1 bg-gray-100">
          <iframe
            src={`${url}#toolbar=0`}
            title={titulo}
            className="w-full h-full"
          />
        </div>
      </div>
    </div>,
    document.body
  );
}