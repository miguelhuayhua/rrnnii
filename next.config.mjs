/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: 'localhost'
            },
            {
                hostname:'play-with-docker'
            }
        ]
    }
};

export default nextConfig;
