'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from './ui/button';

export default function HomePageNext() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      title: "LABTER CULTURAL",
      subtitle: "FORMACIÓN",
      description: "Fortalece tus habilidades en el sector cultural con nuestros programas de formación especializados",
      //image: "https://images.unsplash.com/photo-1759532047744-6b5f1b15d52f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvbWJpYSUyMGN1bHR1cmFsJTIwZmVzdGl2YWx8ZW58MXx8fHwxNzYyNTM3NzYwfDA&ixlib=rb-4.1.0&q=80&w=1080",
      image: '/catedral.jpg',
      category: "Formación",
      color: "from-orange-600/20 to-orange-400/20",
      route: "/labter-cultural"
    },
    {
      id: 2,
      title: "CALDAS CULTURAL",
      subtitle: "CALENDARIO COLABORATIVO",
      description: "Descubre y participa en los eventos culturales de Caldas en tiempo real",
      image: "https://images.unsplash.com/photo-1755509464545-b217d484eb5d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdWx0dXJhbCUyMGNhbGVuZGFyJTIwZXZlbnRzfGVufDF8fHx8MTc2MjUzNzc2MXww&ixlib=rb-4.1.0&q=80&w=1080",
      category: "Calendario",
      color: "from-blue-600/20 to-blue-400/20",
      route: "/caldas-cultural"
    },
    {
      id: 3,
      title: "PARTICIPA Y POSTULA",
      subtitle: "PORTAL DE CONVOCATORIAS",
      description: "Accede a las convocatorias culturales y postula tus proyectos creativos",
      image: "https://images.unsplash.com/photo-1614341769411-4f23f701e3e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvbWJpYW4lMjB0cmFkaXRpb25hbCUyMGRhbmNlfGVufDF8fHx8MTc2MjUzNzc2MXww&ixlib=rb-4.1.0&q=80&w=1080",
      category: "Convocatorias",
      color: "from-orange-500/20 to-blue-500/20",
      route: "/convocatorias"
    },
    {
      id: 4,
      title: "CONEXIÓN CULTURAL",
      subtitle: "SISTEMA DE INFORMACIÓN",
      description: "Información completa sobre la oferta cultural de Manizales y Caldas",
      //image: "https://images.unsplash.com/photo-1542995719-322a54d791ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdWx0dXJhbCUyMGluZm9ybWF0aW9uJTIwc3lzdGVtfGVufDF8fHx8MTc2MjUzNzc2MXww&ixlib=rb-4.1.0&q=80&w=1080",
      image: '/pt.jpg',
      category: "Información",
      color: "from-blue-600/20 to-orange-600/20",
      route: "/conexion-cultural"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const getCardPosition = (index: number) => {
    const diff = index - currentSlide;
    const totalSlides = slides.length;
    
    let normalizedDiff = diff;
    if (Math.abs(diff) > totalSlides / 2) {
      normalizedDiff = diff > 0 ? diff - totalSlides : diff + totalSlides;
    }

    const isCenter = normalizedDiff === 0;
    const isVisible = Math.abs(normalizedDiff) <= 2;

    if (!isVisible) return { display: 'none' };

    const translateX = normalizedDiff * 520;
    const scale = isCenter ? 1 : 0.75;
    const opacity = isCenter ? 1 : 0.5;
    const zIndex = isCenter ? 30 : 20 - Math.abs(normalizedDiff);

    return {
      transform: `translateX(${translateX}px) scale(${scale})`,
      opacity,
      zIndex,
      transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    };
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Orange & Navy Cultural Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1E2B5C] via-[#1E3A8A] to-[#1E2B5C]">
        {/* Cultural Lighting Effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-radial from-[#F47920]/30 via-[#FB923C]/15 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-20 right-1/4 w-80 h-80 bg-gradient-radial from-[#3B82F6]/25 via-[#3B82F6]/12 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-radial from-[#F47920]/25 via-[#FB923C]/12 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 right-1/6 w-64 h-64 bg-gradient-radial from-[#3B82F6]/20 via-[#DBEAFE]/10 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }}></div>
        
        {/* Cultural Venue Elements */}
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#F47920]/10 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#1E2B5C]/40 to-transparent"></div>
        </div>

        {/* Glitter Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Large Glitter Particles */}
          {[...Array(25)].map((_, i) => (
            <div
              key={`large-glitter-${i}`}
              className="absolute w-1 h-1 bg-white rounded-full animate-glitter-large"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
                boxShadow: '0 0 6px rgba(255, 255, 255, 0.8), 0 0 12px rgba(244, 121, 32, 0.5)',
              }}
            />
          ))}
          
          {/* Medium Glitter Particles */}
          {[...Array(35)].map((_, i) => (
            <div
              key={`medium-glitter-${i}`}
              className="absolute w-0.5 h-0.5 bg-orange-200 rounded-full animate-glitter-medium"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${1.5 + Math.random() * 2}s`,
                boxShadow: '0 0 4px rgba(251, 146, 60, 0.9), 0 0 8px rgba(244, 121, 32, 0.4)',
              }}
            />
          ))}
          
          {/* Small Glitter Particles */}
          {[...Array(50)].map((_, i) => (
            <div
              key={`small-glitter-${i}`}
              className="absolute w-px h-px bg-blue-300 rounded-full animate-glitter-small"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random() * 1.5}s`,
                boxShadow: '0 0 3px rgba(147, 197, 253, 0.9), 0 0 6px rgba(59, 130, 246, 0.5)',
              }}
            />
          ))}

          {/* Floating Sparkles */}
          {[...Array(20)].map((_, i) => (
            <div
              key={`sparkle-${i}`}
              className="absolute animate-sparkle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
              }}
            >
              <div className="w-2 h-2 relative">
                <div className="absolute inset-0 bg-white rounded-full opacity-80"></div>
                <div className="absolute top-0 left-1/2 w-px h-2 bg-white transform -translate-x-1/2"></div>
                <div className="absolute left-0 top-1/2 w-2 h-px bg-white transform -translate-y-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Glassmorphism Header */}
      <div className="relative z-50 glass-effect-orange border-b border-orange-300/20">
        <div className="flex items-center justify-between px-8 py-6">
          <div className="text-2xl text-white">
            <span className="text-[#F47920]">Cultura</span> Caldas
          </div>
          <nav className="hidden md:flex space-x-8">
            <Link 
              href="/labter-cultural"
              className="text-white/70 hover:text-[#F47920] transition-all duration-300"
            >
              LABTER CULTURAL
            </Link>
            <Link 
              href="/caldas-cultural"
              className="text-white/90 hover:text-[#F47920] border-b-2 border-[#F47920] pb-1 transition-all duration-300"
            >
              CALDAS CULTURAL
            </Link>
            <Link 
              href="/convocatorias"
              className="text-white/70 hover:text-white transition-all duration-300"
            >
              PARTICIPA Y POSTULATE
            </Link>
            <Link 
              href="/conexion-cultural"
              className="text-white/70 hover:text-white transition-all duration-300"
            >
              CONEXION CULTURAL
            </Link>
          </nav>
          <Link href="/contacts">
            <Button 
              className="bg-gradient-to-r from-[#F47920] to-[#FB923C] hover:from-[#F47920]/80 hover:to-[#FB923C]/80 text-white px-8 py-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              CONTACTO
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Carousel */}
      <div className="relative flex items-center justify-center min-h-[calc(100vh-160px)]">
        {/* Enhanced Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-12 z-40 group"
        >
          <div className="glass-effect-orange w-20 h-20 rounded-full flex items-center justify-center text-white hover:bg-orange-500/20 transition-all duration-300 shadow-2xl group-hover:shadow-[#F47920]/20 group-hover:border-[#F47920]/30">
            <svg className="w-10 h-10 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#F47920]/20 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-12 z-40 group"
        >
          <div className="glass-effect-orange w-20 h-20 rounded-full flex items-center justify-center text-white hover:bg-orange-500/20 transition-all duration-300 shadow-2xl group-hover:shadow-[#F47920]/20 group-hover:border-[#F47920]/30">
            <svg className="w-10 h-10 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
          <div className="absolute inset-0 bg-gradient-to-l from-[#F47920]/20 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>

        {/* Carousel Cards */}
        <div className="relative w-full max-w-[90rem] mx-auto px-8">
          <div className="relative h-[700px] flex items-center justify-center">
            {slides.map((slide, index) => {
              const style = getCardPosition(index);
              const isCenter = (index - currentSlide) % slides.length === 0;

              return (
                <Link 
                  key={slide.id}
                  href={slide.route}
                  className="absolute w-[500px] h-[650px] cursor-pointer group"
                  style={style as React.CSSProperties}
                >
                  <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl group-hover:shadow-[0_25px_50px_-12px_rgba(244,121,32,0.4)] transition-all duration-500">
                    <Image
                      src={slide.image}
                      alt={slide.title}
                      fill
                      className="object-cover"
                      sizes="500px"
                    />
                    
                    {/* Orange-toned Glassmorphism Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1E2B5C]/80 via-[#1E3A8A]/20 to-transparent" />
                    <div className={`absolute inset-0 bg-gradient-to-br ${slide.color} opacity-60`} />
                    
                    {/* Category Tag with Orange Glassmorphism */}
                    <div className="absolute top-8 left-8">
                      <div className="glass-effect-orange px-6 py-3 rounded-full">
                        <span className="text-white text-sm tracking-wide">
                          {slide.category.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* Enhanced Content */}
                    <div className="absolute bottom-8 left-8 right-8 text-white">
                      <h2 className="text-4xl mb-3 leading-tight text-shadow-soft">
                        {slide.title}
                      </h2>
                      <h3 className="text-xl text-[#F47920] mb-4 tracking-wide">
                        {slide.subtitle}
                      </h3>
                      <p className="text-gray-200 text-lg leading-relaxed max-w-md">
                        {slide.description}
                      </p>
                      
                      {/* Action Button */}
                      <button 
                        className="mt-6 glass-effect-orange px-6 py-3 rounded-full text-white hover:bg-orange-500/20 transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0"
                      >
                        Explorar Más
                      </button>
                    </div>

                    {/* Center Highlight Effect */}
                    {isCenter && (
                      <div className="absolute inset-0 border-2 border-[#F47920]/50 rounded-3xl animate-pulse-orange"></div>
                    )}

                    {/* Hover Interaction */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#F47920]/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
                      <div className="glass-effect-orange w-24 h-24 rounded-full flex items-center justify-center transform scale-90 group-hover:scale-100 transition-transform duration-300">
                        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Enhanced Pagination Dots */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2">
          <div className="glass-effect-orange px-6 py-3 rounded-full">
            <div className="flex space-x-3">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`transition-all duration-300 ${
                    index === currentSlide
                      ? 'w-8 h-3 bg-[#F47920] rounded-full animate-pulse-orange'
                      : 'w-3 h-3 bg-white/40 hover:bg-white/60 rounded-full'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Glassmorphism Bottom Statistics */}
      <div className="absolute bottom-0 left-0 right-0">
        <div className="glass-effect-orange border-t border-orange-300/20 p-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="text-white group cursor-pointer">
                <div className="text-3xl text-[#F47920] mb-2 group-hover:scale-110 transition-transform duration-300 drop-shadow-lg">1.200+</div>
                <div className="text-white/80 tracking-wide">Eventos Culturales</div>
              </div>
              <div className="text-white group cursor-pointer">
                <div className="text-3xl text-[#F47920] mb-2 group-hover:scale-110 transition-transform duration-300 drop-shadow-lg">300+</div>
                <div className="text-white/80 tracking-wide">Artistas Locales</div>
              </div>
              <div className="text-white group cursor-pointer">
                <div className="text-3xl text-[#F47920] mb-2 group-hover:scale-110 transition-transform duration-300 drop-shadow-lg">50+</div>
                <div className="text-white/80 tracking-wide">Espacios Culturales</div>
              </div>
              <div className="text-white group cursor-pointer">
                <div className="text-3xl text-[#F47920] mb-2 group-hover:scale-110 transition-transform duration-300 drop-shadow-lg">24/7</div>
                <div className="text-white/80 tracking-wide">Información Disponible</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}