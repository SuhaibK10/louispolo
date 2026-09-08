/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['192.168.106.183','192.168.1.15','192.168.1.6','192.168.1.19','192.168.1.18'],
  images: {
    // Custom loader rewrites each Cloudflare Images URL's own w= flexible-
    // variant param to the width Next requests (see lib/cloudflareLoader.ts),
    // giving real srcset generation without proxying through Vercel's
    // metered Image Optimization API.
    loader:     'custom',
    loaderFile: './lib/cloudflareLoader.ts',
    // Trimmed width table — matches real breakpoints/crop presets in use
    // (see lib/cloudflareImages.ts) instead of Next's default 16-entry table.
    deviceSizes: [640, 828, 1080, 1280, 1920],
    imageSizes:  [96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'imagedelivery.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.zyrosite.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'assets.louispoloworld.com',
        pathname: '/**',
      },
      {
        // Cloudflare Stream video posters/thumbnails (see lib/cloudflareStream.ts).
        // The custom loader above passes these straight through untouched
        // (it only rewrites imagedelivery.net URLs), so this is just the
        // remote-image allowlist entry next/image needs to render them.
        protocol: 'https',
        hostname: 'customer-*.cloudflarestream.com',
        pathname: '/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  compress: true,
  poweredByHeader: false,
  // Pages used to live under /store/* — permanent redirects keep old
  // bookmarks and already-indexed Google results working.
  async redirects() {
    return [
      {
        source: '/store',
        destination: '/',
        permanent: true,
      },
      {
        source: '/store/:path*',
        destination: '/:path*',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
