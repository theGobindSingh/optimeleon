import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../.env") });
// dotenv.config({ path: path.resolve(__dirname, "../../.env") });

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    ...Object.fromEntries(
      Object.entries(process.env).filter(([k]) => k.startsWith("NEXT_PUBLIC_")),
    ),
  },
  images: {
    remotePatterns: [],
  },
};

export default nextConfig;
