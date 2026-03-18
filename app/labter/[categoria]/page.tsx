'use client';

import { useState, useEffect, use, Suspense } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import PageLayout from '@/components/PageLayout';
import VideoModal from '@/components/VideoModal';
import PDFModal from '@/components/PDFModal';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Play, Download, FileText, Video,
  Book, ClipboardList, BookOpen,
  User, Calendar, Eye,
} from 'lucide-react';
import { supabase, type Capacitacion, type CapacitacionArchivo } from '@/lib/supabase';

// ── Tipo interno ───────────────────────────────────────────
type CapacitacionConArchivos = Capacitacion & {
  archivos: CapacitacionArchivo[];
};

// ── Configuración de categorías ────────────────────────────
const categoriasConfig: Record<string, {
  title: string;
  description: string;
  image: string;
  icon: React.ReactNode;
  tipo: string | null;
}> = {
  capacitaciones: {
    title: 'Capacitaciones',
    description: 'Grabaciones y recursos de las sesiones de formación',
   // image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200&q=80',
   image: "/cap3.jpg",
    icon: <Video className="w-8 h-8" />,
    tipo: null,
  },
  presentaciones: {
    title: 'Presentaciones',
    description: 'Diapositivas y slides de cada sesión',
   // image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&q=80',
   image: "/cap4.jpg",
    icon: <FileText className="w-8 h-8" />,
    tipo: 'presentacion',
  },
  'material-apoyo': {
    title: 'Material de Apoyo',
    description: 'Recursos complementarios de las capacitaciones',
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200&q=80',
    icon: <BookOpen className="w-8 h-8" />,
    tipo: 'material_apoyo',
  },
  bibliografia: {
    title: 'Bibliografía',
    description: 'Fuentes y lecturas recomendadas',
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&q=80',
    icon: <Book className="w-8 h-8" />,
    tipo: 'bibliografia',
  },
  propuestas: {
    title: 'Propuestas',
    description: 'Propuestas de proyectos culturales desarrolladas',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80',
    icon: <ClipboardList className="w-8 h-8" />,
    tipo: 'propuesta',
  },
};

// ── Helpers ────────────────────────────────────────────────
function formatFecha(fecha: string): string {
  const meses = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
  const d = new Date(fecha + 'T00:00:00');
  return `${d.getDate()} ${meses[d.getMonth()]} ${d.getFullYear()}`;
}

// ── Componente interno ─────────────────────────────────────
function CategoriaContent({ categoria }: { categoria: string }) {
  const config = categoriasConfig[categoria];
  if (!config) notFound();

  const [capacitaciones, setCapacitaciones] = useState<CapacitacionConArchivos[]>([]);
  const [cargando, setCargando] = useState(true);
  const [videoActivo, setVideoActivo] = useState<{ url: string; titulo: string } | null>(null);
  const [pdfActivo, setPdfActivo] = useState<{ url: string; titulo: string } | null>(null);

  useEffect(() => {
    async function fetchDatos() {
      setCargando(true);

      const { data: caps, error: errorCaps } = await supabase
        .from('capacitaciones')
        .select('*')
        .eq('activa', true)
        .order('fecha', { ascending: false });

      if (errorCaps || !caps) {
        console.error('Error cargando capacitaciones:', errorCaps?.message);
        setCargando(false);
        return;
      }

      let query = supabase
        .from('capacitacion_archivos')
        .select('*')
        .order('orden', { ascending: true });

      if (config.tipo) {
        query = query.eq('tipo', config.tipo);
      }

      const { data: archivos, error: errorArchivos } = await query;

      if (errorArchivos) {
        console.error('Error cargando archivos:', errorArchivos.message);
        setCargando(false);
        return;
      }

      const resultado: CapacitacionConArchivos[] = caps
        .map((cap) => ({
          ...cap,
          archivos: (archivos ?? []).filter((a) => a.capacitacion_id === cap.id),
        }))
        .filter((cap) => config.tipo === null || cap.archivos.length > 0);

      setCapacitaciones(resultado);
      setCargando(false);
    }

    fetchDatos();
  }, [categoria, config.tipo]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">

      {/* Hero */}
      <div className="relative mb-14 rounded-3xl overflow-hidden h-[280px]">
        <Image
          src={config.image}
          alt={config.title}
          fill
          className="object-cover"
          sizes="(max-width: 1200px) 100vw, 1200px"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#2a9d8f]/90 via-[#1E3A8A]/70 to-transparent flex items-center">
          <div className="px-12 text-white">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-14 h-14 bg-[#e63947]/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-[#e63947] border border-[#e63947]/30">
                {config.icon}
              </div>
              <div>
                <p className="text-[#FB923C] text-sm tracking-widest mb-1">LABTER CULTURAL</p>
                <h1 className="text-4xl font-bold">{config.title}</h1>
              </div>
            </div>
            <p className="text-gray-200 text-lg max-w-2xl">{config.description}</p>
          </div>
        </div>
      </div>

      {/* Skeleton */}
      {cargando && (
        <div className="space-y-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-gray-200 overflow-hidden animate-pulse">
              <div className="flex">
                <div className="w-72 h-56 bg-gray-200 flex-shrink-0" />
                <div className="flex-1 p-7 space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-2/3" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tarjetas */}
      {!cargando && (
        <div className="space-y-6">
          {capacitaciones.map((cap) => (
            <Card
              key={cap.id}
              className="border-[#e63947]/20 hover:shadow-xl hover:border-[#e63947]/50 transition-all duration-300 overflow-hidden group"
            >
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row">

                  {/* Imagen — object-contain para mostrar completa sobre fondo navy */}
                  <div className="relative w-full sm:w-72 min-h-[220px] bg-[#2a9d8f] flex-shrink-0 overflow-hidden flex items-center justify-center">
                    {cap.imagen_url ? (
                      <Image
                        src={cap.imagen_url}
                        alt={cap.titulo}
                        fill
                        className="object-contain p-2"
                        sizes="288px"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-[#e63947]/20 flex items-center justify-center">
                        <Play className="w-8 h-8 text-[#e63947] ml-1" />
                      </div>
                    )}
                  </div>

                  {/* Info + archivos */}
                  <div className="flex-1 p-7 flex flex-col justify-between">
                    <div>
                      <span className="inline-block text-xs text-[#e63947] bg-[#e63947]/10 px-3 py-1 rounded-full mb-3">
                        {config.title}
                      </span>
                      <h3 className="text-xl font-semibold text-[#2a9d8f] mb-2 group-hover:text-[#e63947] transition-colors duration-300">
                        {cap.titulo}
                      </h3>
                      {cap.descripcion && (
                        <p className="text-[#6B7280] text-sm leading-relaxed mb-4">
                          {cap.descripcion}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-4 text-xs text-[#9CA3AF] mb-6">
                        {cap.ponente && (
                          <span className="flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5" /> {cap.ponente}
                          </span>
                        )}
                        {cap.fecha && (
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" /> {formatFecha(cap.fecha)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <div className="border-t border-gray-100 mb-4" />
                      <div className="flex flex-wrap gap-2">
                        {cap.archivos.map((archivo) => (
                          archivo.tipo === 'video' ? (
                            <Button
                              key={archivo.id}
                              size="sm"
                              className="bg-[#e63947] hover:bg-[#d4681a] text-white shadow-sm"
                              onClick={() => setVideoActivo({
                                url: archivo.url,
                                titulo: archivo.titulo_archivo ?? cap.titulo,
                              })}
                            >
                              <Play className="w-4 h-4 mr-1.5" />
                              {archivo.titulo_archivo ?? 'Ver grabación'}
                            </Button>
                          ) : (
                            <div key={archivo.id} className="flex gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-[#2a9d8f]/20 text-[#2a9d8f] hover:bg-[#2a9d8f]/5 hover:border-[#2a9d8f]/40"
                                onClick={() => setPdfActivo({
                                  url: archivo.url,
                                  titulo: archivo.titulo_archivo ?? 'Documento',
                                })}
                              >
                                <Eye className="w-4 h-4 mr-1.5" />
                                {archivo.titulo_archivo ?? 'Ver documento'}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-[#2a9d8f]/20 text-[#2a9d8f] hover:bg-[#2a9d8f]/5 hover:border-[#2a9d8f]/40 px-2.5"
                                asChild
                              >
                                <a href={archivo.url} download target="_blank" rel="noopener noreferrer">
                                  <Download className="w-4 h-4" />
                                </a>
                              </Button>
                            </div>
                          )
                        ))}
                      </div>
                    </div>
                  </div>

                </div>
              </CardContent>
            </Card>
          ))}

          {/* Estado vacío */}
          {capacitaciones.length === 0 && (
            <div className="text-center py-24">
              <div className="w-20 h-20 bg-[#e63947]/10 rounded-full flex items-center justify-center mx-auto mb-5 text-[#e63947]">
                {config.icon}
              </div>
              <h3 className="text-2xl font-semibold text-[#2a9d8f] mb-2">Próximamente</h3>
              <p className="text-[#6B7280]">Estamos preparando el contenido de esta sección.</p>
            </div>
          )}
        </div>
      )}

      {/* Modales */}
      {videoActivo && (
        <VideoModal
          url={videoActivo.url}
          titulo={videoActivo.titulo}
          onClose={() => setVideoActivo(null)}
        />
      )}
      {pdfActivo && (
        <PDFModal
          url={pdfActivo.url}
          titulo={pdfActivo.titulo}
          onClose={() => setPdfActivo(null)}
        />
      )}

    </div>
  );
}

// ── Wrapper con Suspense ───────────────────────────────────
export default function LabterCategoriaPage({
  params,
}: {
  params: Promise<{ categoria: string }>;
}) {
  const { categoria } = use(params);

  return (
    <PageLayout letter="L" letterPosition="top-right">
      <Suspense fallback={
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="space-y-5">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-gray-200 overflow-hidden animate-pulse">
                <div className="flex">
                  <div className="w-72 h-56 bg-gray-200 flex-shrink-0" />
                  <div className="flex-1 p-7 space-y-4">
                    <div className="h-6 bg-gray-200 rounded w-2/3" />
                    <div className="h-4 bg-gray-200 rounded w-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      }>
        <CategoriaContent categoria={categoria} />
      </Suspense>
    </PageLayout>
  );
}
