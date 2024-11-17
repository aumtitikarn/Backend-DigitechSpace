module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['lh3.googleusercontent.com', 'm1r.ai', 'upload.wikimedia.org'], // เพิ่มโดเมนที่ต้องการให้รองรับ
  },
  eslint :{
    ignoreDuringBuilds: true
  },
  output: "standalone",
  experimental: {
    serverActions: true,
  }
};
