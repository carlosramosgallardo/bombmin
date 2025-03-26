import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Configuración de Sentry
  sentry: {
    // Esto deshabilita reactComponentAnnotation en producción, activándolo solo en desarrollo
    reactComponentAnnotation: {
      enabled: process.env.NODE_ENV === 'development',
    },
    // Puedes agregar aquí otras opciones de Sentry si las necesitas
  },
};

export default nextConfig;

