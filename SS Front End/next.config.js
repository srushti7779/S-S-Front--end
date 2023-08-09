/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["store-and-share-vault.s3.amazonaws.com", "res.cloudinary.com"],
  },
};

module.exports = nextConfig;
