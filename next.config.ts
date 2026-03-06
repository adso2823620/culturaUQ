/** @type {import('next').NextConfig} */
const nextConfig = {
   eslint: {
    ignoreDuringBuilds: true,  // ← agrega esto
  },
  images: {
    remotePatterns: [
      {
        // Unsplash — imágenes de placeholder mientras llegan las reales
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        // Supabase Storage — cuando subas imágenes desde el admin
        // Reemplaza TU-PROYECTO con el ID de tu proyecto en Supabase
        protocol: 'https',
        hostname: 'larjoveilfuwsxzigtsc.supabase.co',
      },
    ],
  },
};



module.exports = nextConfig;