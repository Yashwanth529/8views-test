
module.exports = {
  output: 'export',
  compress: true,
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true, 
    domains: [
      "downloads.maa.care",
      'www.freepik.com',
      'www.thewowstyle.com',
      'images.pexels.com',
    ],
  },
  webpack: (config, { dev, isServer }) => {
    if (dev && isServer) {
      config.plugins = config.plugins.filter(
        (plugin) => plugin.constructor.name !== "HotModuleReplacementPlugin"
      );
    }
    return config;
  },
};
