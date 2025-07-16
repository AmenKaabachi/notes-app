/** @type {import('next').NextConfig} */
const nextConfig = {
  // Temporarily skip TypeScript errors during build
  typescript: {
    ignoreBuildErrors: true,
  },
  // Disable static exports due to NextAuth v5 compatibility
  output: undefined,
  // Enable experimental features for better Turbopack compatibility
  experimental: {
    // Turbopack is automatically enabled when using --turbo flag
    turbo: {
      // Configure Turbopack-specific options here if needed
      rules: {
        // Custom rules can be added here for specific file types
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
      resolveAlias: {
        // Optimize common imports for Turbopack
        '@': './',
        '@/app': './app',
        '@/components': './app/components',
        '@/lib': './lib',
        '@/types': './types',
        '@/hooks': './app/hooks',
        '@/styles': './styles',
      },
    },
    // Optimize package imports for better tree shaking
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-avatar',
      '@radix-ui/react-dialog', 
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-label',
      'react-markdown',
      'date-fns'
    ],
    // Configure server components to exclude Prisma from client bundle
    serverComponentsExternalPackages: ['@prisma/client', '@prisma/extension-accelerate'],
  },
  // Optimize for development with Turbopack
  webpack: (config, { dev, isServer }) => {
    // Exclude Prisma from client-side bundles
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      }
    }
    
    // Only apply webpack optimizations when not using Turbopack
    if (dev && !process.env.TURBOPACK) {
      // Development optimizations for webpack fallback
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
            },
          },
        },
      };
    }
    return config;
  },
  
  // Optimize images
  images: {
    formats: ['image/webp', 'image/avif'],
  },
}

module.exports = nextConfig