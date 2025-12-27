/**
 * @type {import('next').NextConfig}
 */
module.exports = {
    compiler: {
        removeConsole: process.env.NODE_ENV === 'production' ? true : false,
    },
    output: 'export',
    trailingSlash: false,
    reactStrictMode: true,
    images: {
        unoptimized: true,
    },
    compress: true,
    webpack: (config) => {
        config.module.rules.push({
            test: /\.svg$/i,
            issuer: /\.[jt]sx?$/,
            use: ['@svgr/webpack'],
        });
        return config;
    },
};
