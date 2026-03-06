'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PageLayout from '@/components/PageLayout';
import { Calendar, DollarSign, ExternalLink } from 'lucide-react';

type Status = 'abierta' | 'proxima' | 'cerrada';

const filters = [
  { id: 'todas',    label: 'Todas',    count: 5 },
  { id: 'abierta',  label: 'Abiertas', count: 3 },
  { id: 'proxima',  label: 'Próximas', count: 1 },
  { id: 'cerrada',  label: 'Cerradas', count: 1 },
];

const statusConfig: Record<Status, { label: string; classes: string }> = {
  abierta: { label: 'Abierta',  classes: 'bg-green-100 text-green-700' },
  proxima: { label: 'Próxima',  classes: 'bg-blue-100 text-[#3B82F6]' },
  cerrada: { label: 'Cerrada',  classes: 'bg-gray-100 text-gray-500' },
};

const convocatorias = [
  {
    id: 1,
    title: 'Estímulos para Artes Escénicas 2024',
    entity: 'Ministerio de Cultura',
    category: 'Estímulos',
    description: 'Apoyo económico para proyectos de teatro, danza y artes circenses en todo el país.',
    amount: 'Hasta $30.000.000',
    deadline: '30 Nov 2024',
    daysLeft: 15,
    status: 'abierta' as Status,
    image: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=600&h=400&fit=crop',
  },
  {
    id: 2,
    title: 'Becas de Investigación Cultural',
    entity: 'Gobernación de Caldas',
    category: 'Becas',
    description: 'Financiamiento para investigaciones sobre patrimonio cultural material e inmaterial de Caldas.',
    amount: 'Hasta $15.000.000',
    deadline: '15 Dic 2024',
    daysLeft: 30,
    status: 'abierta' as Status,
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=400&fit=crop',
  },
  {
    id: 3,
    title: 'Residencias Artísticas Internacionales',
    entity: 'Idartes',
    category: 'Residencias',
    description: 'Programa de intercambio para artistas visuales, músicos y escritores.',
    amount: 'Todos los gastos cubiertos',
    deadline: '5 Ene 2025',
    daysLeft: 51,
    status: 'proxima' as Status,
    image: 'https://images.unsplash.com/photo-1577083552431-6e5fd01988ec?w=600&h=400&fit=crop',
  },
  {
    id: 4,
    title: 'Formación en Gestión Cultural',
    entity: 'Universidad de Caldas',
    category: 'Formación',
    description: 'Diplomado gratuito en gestión y producción de proyectos culturales.',
    amount: 'Gratuito',
    deadline: '20 Dic 2024',
    daysLeft: 35,
    status: 'abierta' as Status,
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&h=400&fit=crop',
  },
  {
    id: 5,
    title: 'Apoyo a Festivales Musicales',
    entity: 'Alcaldía de Manizales',
    category: 'Estímulos',
    description: 'Cofinanciación para festivales de música en Manizales.',
    amount: 'Hasta $20.000.000',
    deadline: '10 Dic 2024',
    daysLeft: 25,
    status: 'cerrada' as Status,
    image: 'https://images.unsplash.com/photo-1511735111819-9a3f7709049c?w=600&h=400&fit=crop',
  },
];

export default function ConvocatoriasPage() {
  const [selectedFilter, setSelectedFilter] = useState('todas');

  const filtered = selectedFilter === 'todas'
    ? convocatorias
    : convocatorias.filter((c) => c.status === selectedFilter);

  return (
    <PageLayout letter="P" letterPosition="top-right">
      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="mb-12">
          <div className="inline-block px-6 py-2 bg-[#F47920]/10 rounded-full mb-6">
            <span className="text-[#F47920] text-sm tracking-widest">PORTAL DE CONVOCATORIAS</span>
          </div>
          <h1 className="text-5xl mb-4 text-[#1E2B5C]">Participa y Postula</h1>
          <p className="text-xl text-[#6B7280] max-w-3xl leading-relaxed">
            Accede a las convocatorias culturales disponibles. Encuentra oportunidades de
            financiación, formación y reconocimiento para tus proyectos creativos.
          </p>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-3 mb-8">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedFilter(f.id)}
              className={`rounded-full px-5 py-2 text-sm transition-all duration-300 ${
                selectedFilter === f.id
                  ? 'bg-[#F47920] text-white shadow-sm'
                  : 'border border-gray-200 text-[#6B7280] hover:border-[#F47920] hover:text-[#F47920]'
              }`}
            >
              {f.label} ({f.count})
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((conv) => {
            const statusInfo = statusConfig[conv.status];
            return (
              <Card key={conv.id} className="border-[#F47920]/20 hover:shadow-xl hover:border-[#F47920]/40 transition-all duration-300 overflow-hidden group cursor-pointer">
                {/* Imagen */}
                <div className="aspect-[16/10] relative overflow-hidden">
                  <Image
                    src={conv.image}
                    alt={conv.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  {/* Categoría */}
                  <div className="absolute top-4 left-4 bg-[#F47920] text-white px-3 py-1 rounded-full text-xs">
                    {conv.category}
                  </div>
                  {/* Días restantes */}
                  {conv.status !== 'cerrada' && (
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-[#1E2B5C] px-3 py-1 rounded-full text-xs flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {conv.daysLeft} días
                    </div>
                  )}
                </div>

                <CardContent className="p-5">
                  {/* Entidad + estado */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-[#6B7280]">{conv.entity}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusInfo.classes}`}>
                      {statusInfo.label}
                    </span>
                  </div>

                  <h3 className="text-base mb-2 text-[#1E2B5C] group-hover:text-[#F47920] transition-colors line-clamp-2">
                    {conv.title}
                  </h3>

                  <p className="text-sm text-[#6B7280] mb-4 line-clamp-2 leading-relaxed">
                    {conv.description}
                  </p>

                  <div className="space-y-1.5 mb-4 text-sm">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-[#F47920]" />
                      <span className="text-[#1E2B5C]">{conv.amount}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#F47920]" />
                      <span className="text-[#6B7280]">Cierra: {conv.deadline}</span>
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    disabled={conv.status === 'cerrada'}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    {conv.status === 'cerrada' ? 'Convocatoria Cerrada' : 'Ver Detalles'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Estado vacío */}
        {filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-[#F47920]/10 rounded-full flex items-center justify-center mx-auto mb-5">
              <Calendar className="w-10 h-10 text-[#F47920]" />
            </div>
            <h3 className="text-2xl text-[#1E2B5C] mb-2">No hay convocatorias en esta categoría</h3>
            <p className="text-[#6B7280]">Vuelve pronto para ver nuevas oportunidades.</p>
          </div>
        )}

        {/* Banner CTA */}
        <div className="mt-14 rounded-2xl bg-gradient-to-r from-[#1E2B5C] to-[#1E3A8A] p-8 md:p-12 text-white text-center">
          <h2 className="text-3xl mb-3">¿Tienes una convocatoria para publicar?</h2>
          <p className="text-white/70 mb-6 max-w-xl mx-auto">
            Si eres una entidad o institución cultural y quieres difundir una convocatoria,
            contáctanos y la publicamos gratuitamente.
          </p>
          <Button variant="outline" className="border-white text-white hover:bg-white hover:text-[#1E2B5C]">
            Publicar Convocatoria
          </Button>
        </div>
      </div>
    </PageLayout>
  );
}