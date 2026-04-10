/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: false,
  },
  experimental: {
    workerThreads: false,
    cpus: 1,
  },
};

module.exports = nextConfig;
