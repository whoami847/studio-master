
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  // IMPORTANT: Replace <repository-name> with the name of your GitHub repository.
  // For example, if your repository URL is https://github.com/your-username/my-topup-store,
  // then the basePath should be '/my-topup-store'.
  basePath: '/burnertop',
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'telegra.ph',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.postimg.cc',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
