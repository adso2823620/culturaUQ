'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface VideoModalProps {
  url: string;
  titulo: string;
  onClose: () => void;
}

function esYouTube(url: string): boolean {
  return url.includes('youtube.com') || url.includes('youtu.be');
}

function getYouTubeEmbedUrl(url: string): string {
  const regExp = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regExp);
  if (match && match[1]) {
    return `https://www.youtube.com/embed/${match[1]}?autoplay=1`;
  }
  return url;
}

export default function VideoModal({ url, titulo, onClose }: VideoModalProps) {
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

  const esYT = esYouTube(url);

  // createPortal renderiza el modal directamente en document.body,
  // escapando cualquier stacking context del árbol de componentes.
  return createPortal(
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 px-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-[#1E2B5C] rounded-2xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
          <p className="text-white text-sm truncate pr-4">{titulo}</p>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors flex-shrink-0"
            aria-label="Cerrar video"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video */}
        <div className="aspect-video w-full bg-black">
          {esYT ? (
            <iframe
              src={getYouTubeEmbedUrl(url)}
              title={titulo}
              className="w-full h-full"
              allowFullScreen
              allow="autoplay; fullscreen; picture-in-picture"
            />
          ) : (
            <video
              src={url}
              controls
              autoPlay
              className="w-full h-full"
              controlsList="nodownload"
            >
              Tu navegador no soporta el reproductor de video.
            </video>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}