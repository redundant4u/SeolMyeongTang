module.exports = {
    compiler: {
        removeConsole: process.env.NODE_ENV === 'production' ? true : false,
    },
    reactStrictMode: false,
    swcMinify: true,
    images: {
        unoptimized: true,
    },
    trailingSlash: true,
    env: {
        TERMINAL_SOCKET_URL: process.env.TERMINAL_SOCKET_URL,
    },
};
