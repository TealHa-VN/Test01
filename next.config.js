/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Fix for Web Workers
    config.output.webassemblyModuleFilename = 'static/wasm/[modulehash].wasm';
    
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      layers: true,
    };

    // Handle transformers.js ONNX files
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': '/src',
    };

    return config;
  },
  images: {
    domains: ['localhost'],
  },
  reactStrictMode: true,
};

module.exports = nextConfig;
