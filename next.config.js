module.exports = {
    compiler: {
        removeConsole: process.env.NODE_ENV === 'production' ? true : false,
    },
    trailingSlash: false,
    reactStrictMode: false,
    swcMinify: true,
    images: {
        unoptimized: true,
    },
    env: {
        TERMINAL_SOCKET_URL: process.env.TERMINAL_SOCKET_URL,
        CRDT_SOCKET_URL: process.env.CRDT_SOCKET_URL,
    },
    webpack: (config) => {
        config.module.rules.push({
            test: /\.svg$/i,
            issuer: /\.[jt]sx?$/,
            use: ['@svgr/webpack'],
        });
        return config;
    },
};
