/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  typescript: {
  ignoreBuildErrors: false,
},
eslint: {
  ignoreDuringBuilds: false,
},
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
};

module.exports = nextConfig;