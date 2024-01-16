import './env.mjs';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'i.ytimg.com',
      },
      {
        hostname: 'images.unsplash.com',
      },
    ],
  },
  telemetry: false,
};

export default nextConfig;
