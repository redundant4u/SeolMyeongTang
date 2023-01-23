module.exports = {
    compiler: {
        removeConsole: process.env.NODE_ENV === 'prod' ? true : false,
    },
    reactStrictMode: true,
    swcMinify: true,
    images: {
        unoptimized: true,
    },
};
