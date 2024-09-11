/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: 'localhost'
            },
            {
                hostname:'play-with-docker.com',
                protocol:'http'
            }
        ]
    }
};

export default nextConfig;
