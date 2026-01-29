import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["lesia-arrestive-bettyann.ngrok-free.dev"],
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
