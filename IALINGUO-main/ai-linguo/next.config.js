/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuração para GitHub Pages
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  
  // Base path para GitHub Pages (será definido durante o build)
  basePath: process.env.NODE_ENV === 'production' ? process.env.BASE_PATH || '' : '',
  
  // Configuração para desenvolvimento
  experimental: {
    esmExternals: 'loose',
  },
  
  // Webpack configuration
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };
    }
    return config;
  },
  
  // Redirects (apenas em desenvolvimento)
  async redirects() {
    return [];
  },
  
  // Headers customizados
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'ALLOWALL',
          },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' *.preview.app.github.dev *.codespaces.githubusercontent.com;",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
