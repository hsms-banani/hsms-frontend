/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/media/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/media/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        pathname: '/**',
      },
      // Add your production domain here when you deploy
      // {
      //   protocol: 'https',
      //   hostname: 'yourdomain.com',
      //   pathname: '/media/**',
      // },
    ],
    // Disable optimization for local development if having issues
    unoptimized: process.env.NODE_ENV === 'development',
    // Add these additional settings for better image loading
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Add cache control headers for development
  async headers() {
    return [
      {
        // Apply cache control to API routes and images in development
        source: '/(api|_next/image|hero)/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: process.env.NODE_ENV === 'development' 
              ? 'no-cache, no-store, must-revalidate, proxy-revalidate'
              : 'public, max-age=31536000, immutable',
          },
          {
            key: 'Pragma',
            value: process.env.NODE_ENV === 'development' ? 'no-cache' : 'cache',
          },
          {
            key: 'Expires',
            value: process.env.NODE_ENV === 'development' ? '0' : '31536000',
          },
        ],
      },
    ];
  },

  // Add experimental features for better navigation
  experimental: {
    optimizeCss: false, // Disable CSS optimization in development
  },
};

module.exports = nextConfig;