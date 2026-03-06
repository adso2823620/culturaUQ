import { Card, CardContent } from '@/components/ui/card';
import PageLayout from '@/components/PageLayout';
import { Map, Users, Building2, Palette, MapPin, Search } from 'lucide-react';

const stats = [
  { icon: <Users className="w-8 h-8" />,     number: '450+', label: 'Organizaciones Culturales', color: 'orange' },
  { icon: <Building2 className="w-8 h-8" />, number: '120+', label: 'Espacios Culturales',        color: 'blue'   },
  { icon: <Palette className="w-8 h-8" />,   number: '27',   label: 'Municipios Activos',         color: 'orange' },
  { icon: <MapPin className="w-8 h-8" />,    number: '850+', label: 'Puntos Culturales',          color: 'blue'   },
];

const categories = [
  { name: 'Museos y Galerías',     count: 45,  icon: '🖼️' },
  { name: 'Teatros',               count: 28,  icon: '🎭' },
  { name: 'Bibliotecas',           count: 67,  icon: '📚' },
  { name: 'Casas de la Cultura',   count: 35,  icon: '🏛️' },
  { name: 'Colectivos Artísticos', count: 156, icon: '🎨' },
  { name: 'Grupos Musicales',      count: 89,  icon: '🎵' },
  { name: 'Gestores Culturales',   count: 142, icon: '👥' },
  { name: 'Espacios Alternativos', count: 58,  icon: '🌟' },
];

const steps = [
  { num: '1', color: 'orange', title: 'Registra tu organización', desc: 'Completa el formulario con tu información' },
  { num: '2', color: 'blue',   title: 'Verificación',             desc: 'Revisamos y validamos tu información' },
  { num: '3', color: 'orange', title: '¡Apareces en el mapa!',    desc: 'Conecta con la comunidad cultural' },
];

export default function ConexionCulturalPage() {
  return (
    <PageLayout letter="M" letterPosition="top-right">
      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block px-6 py-2 bg-[#3B82F6]/10 rounded-full mb-6">
            <span className="text-[#3B82F6] text-sm tracking-widest">SISTEMA DE INFORMACIÓN</span>
          </div>
          <div className="flex items-center justify-center gap-3 mb-4">
            <Map className="w-10 h-10 text-[#F47920]" />
            <h1 className="text-5xl text-[#1E2B5C]">CONEXIÓN CULTURAL</h1>
          </div>
          <p className="text-xl text-[#6B7280] max-w-3xl mx-auto leading-relaxed">
            Explora el mapa interactivo de organizaciones y espacios culturales de Caldas.
            Descubre, conecta y colabora con la comunidad cultural del departamento.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {stats.map((s, i) => (
            <div key={i} className={`rounded-2xl p-6 border text-center hover:shadow-lg transition-shadow duration-300 ${
              s.color === 'orange'
                ? 'bg-gradient-to-br from-[#F47920]/10 to-[#F47920]/5 border-[#F47920]/20'
                : 'bg-gradient-to-br from-[#3B82F6]/10 to-[#3B82F6]/5 border-[#3B82F6]/20'
            }`}>
              <div className={`mb-3 flex justify-center ${s.color === 'orange' ? 'text-[#F47920]' : 'text-[#3B82F6]'}`}>
                {s.icon}
              </div>
              <div className={`text-3xl mb-1 ${s.color === 'orange' ? 'text-[#F47920]' : 'text-[#3B82F6]'}`}>
                {s.number}
              </div>
              <div className="text-sm text-[#6B7280]">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filtros */}
        <Card className="mb-8 border-2 border-[#F47920]/20">
          <CardContent className="p-8">
            <div className="flex items-center gap-4 mb-4">
              <Search className="w-7 h-7 text-[#F47920]" />
              <h2 className="text-2xl text-[#1E2B5C]">Explora el Ecosistema Cultural</h2>
            </div>
            <p className="text-[#6B7280] mb-5 leading-relaxed">
              Utiliza el mapa interactivo para encontrar organizaciones culturales, espacios,
              colectivos y gestores cerca de ti. Filtra por tipo de organización, municipio o área de interés.
            </p>
            <div className="flex flex-wrap gap-3">
              <button className="px-4 py-2 bg-[#F47920] text-white rounded-full hover:bg-[#FB923C] transition-colors text-sm">Ver todo</button>
              <button className="px-4 py-2 bg-[#3B82F6] text-white rounded-full hover:bg-[#60A5FA] transition-colors text-sm">Manizales</button>
              <button className="px-4 py-2 border-2 border-[#F47920]/30 text-[#F47920] rounded-full hover:bg-[#F47920]/10 transition-colors text-sm">Teatros</button>
              <button className="px-4 py-2 border-2 border-[#3B82F6]/30 text-[#3B82F6] rounded-full hover:bg-[#3B82F6]/10 transition-colors text-sm">Colectivos</button>
            </div>
          </CardContent>
        </Card>

        {/* Mapa embed real */}
        <Card className="mb-12 overflow-hidden border-2 border-[#F47920]/30 shadow-xl">
          <CardContent className="p-0">
            <div className="bg-gradient-to-r from-[#1E2B5C] to-[#3B82F6] p-6 text-white">
              <div className="flex items-center gap-3 mb-1">
                <Map className="w-6 h-6" />
                <h3 className="text-2xl">Mapa Interactivo de Organizaciones</h3>
              </div>
              <p className="text-white/80 text-sm">
                Visualiza y conecta con más de 450 organizaciones culturales en Caldas
              </p>
            </div>

            <div className="w-full" style={{ height: '600px' }}>
              <iframe
                src="https://mapa-fong.web.app"
                className="w-full h-full border-0"
                title="Mapa de Organizaciones Culturales de Caldas"
                loading="lazy"
                allowFullScreen
              />
            </div>

            <div className="bg-[#F47920]/10 p-5 border-t-2 border-[#F47920]/20 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                <MapPin className="w-4 h-4 text-[#F47920]" />
                <span>Haz clic en los marcadores para ver más información</span>
              </div>
              <a
                href="https://mapa-fong.web.app"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2 bg-[#F47920] text-white rounded-full hover:bg-[#FB923C] transition-colors text-sm"
              >
                Abrir en pantalla completa
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Categorías */}
        <div className="mb-12">
          <h2 className="text-3xl mb-8 text-[#1E2B5C] text-center">Categorías de Organizaciones</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat, i) => (
              <Card key={i} className="border-[#F47920]/20 hover:border-[#F47920]/40 hover:shadow-lg transition-all duration-300 cursor-pointer group">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-3">{cat.icon}</div>
                  <h3 className="text-sm mb-1 text-[#1E2B5C] group-hover:text-[#F47920] transition-colors">{cat.name}</h3>
                  <div className="text-2xl text-[#F47920]">{cat.count}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Registro en el mapa */}
        <div className="bg-gradient-to-r from-[#F47920]/10 via-[#3B82F6]/10 to-[#F47920]/10 rounded-3xl p-10 border border-[#F47920]/20 mb-8">
          <h2 className="text-3xl mb-4 text-[#1E2B5C] text-center">¿Quieres Aparecer en el Mapa?</h2>
          <p className="text-lg text-[#6B7280] leading-relaxed mb-8 text-center max-w-2xl mx-auto">
            Si eres una organización cultural, colectivo artístico, espacio cultural o gestor
            independiente en Caldas, puedes registrarte para aparecer en nuestro mapa interactivo
            y conectar con la comunidad.
          </p>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {steps.map((step, i) => (
              <div key={i} className="text-center">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 ${
                  step.color === 'orange' ? 'bg-[#F47920]/20' : 'bg-[#3B82F6]/20'
                }`}>
                  <span className={`text-xl font-bold ${step.color === 'orange' ? 'text-[#F47920]' : 'text-[#3B82F6]'}`}>
                    {step.num}
                  </span>
                </div>
                <h4 className="text-[#1E2B5C] font-medium mb-1">{step.title}</h4>
                <p className="text-sm text-[#6B7280]">{step.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <button className="px-8 py-4 bg-[#F47920] text-white rounded-full hover:bg-[#FB923C] transition-colors text-base inline-flex items-center gap-2">
              <Users className="w-5 h-5" />
              Registrar mi Organización
            </button>
          </div>
        </div>

        {/* Soporte */}
        <div className="bg-[#3B82F6]/10 rounded-2xl p-6 border border-[#3B82F6]/20">
          <h4 className="text-[#1E2B5C] font-medium mb-2">¿Necesitas ayuda con el mapa?</h4>
          <p className="text-sm text-[#6B7280] mb-4">
            Si tienes preguntas o necesitas actualizar la información de tu organización:
          </p>
          <div className="flex flex-wrap gap-6 text-sm">
            <a href="mailto:mapa@culturacaldas.gov.co" className="text-[#F47920] hover:underline flex items-center gap-2">
              📧 mapa@culturacaldas.gov.co
            </a>
            <a href="tel:+576068841122" className="text-[#F47920] hover:underline flex items-center gap-2">
              📞 (606) 884 1122
            </a>
          </div>
        </div>

      </div>
    </PageLayout>
  );
}