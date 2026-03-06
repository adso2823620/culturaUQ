import HomePageNext from '@/components/HomePageNext';
import SectoresCulturales from '@/components/SectoresCulturales';

export default function Page() {
  return (
    <>
      {/* Hero con carrusel — fondo navy, pantalla completa */}
      <HomePageNext />

      {/* Sección sectores culturales — fondo gris claro, fuera del hero */}
      <SectoresCulturales />
    </>
  );
}