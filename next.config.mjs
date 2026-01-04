/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.assets.gnmotors.co.nz',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'assets.gnmotors.co.nz',
        pathname: '/**',
      },
    ],
    // Disable automatic image optimization for external URLs to avoid retries on 404
    unoptimized: process.env.NEXT_PUBLIC_IMAGE_UNOPTIMIZED === 'true',
    // Reduce cache time for failed image requests
    minimumCacheTTL: 60,
  },
};

export default nextConfig;
