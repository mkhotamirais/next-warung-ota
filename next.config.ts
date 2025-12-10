import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // {
      //   protocol: "https",
      //   hostname: "lh3.googleusercontent.com",
      //   // port: "",
      //   // pathname: "/**",
      // },
      {
        protocol: "https",
        hostname: "evufnvrzl0kwruxc.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
