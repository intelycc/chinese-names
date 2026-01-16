/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    // Allow LAN access during dev (adjust if your dev IP changes).
    allowedDevOrigins: ["http://192.168.50.61:3000"],
  },
}

export default nextConfig
