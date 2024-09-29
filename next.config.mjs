/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        workerThreads: false,
        cpus: 2
    }
};

export default nextConfig;
