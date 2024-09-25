/** @type {import('next').NextConfig} */
const nextConfig = {reactStrictMode: true,
    images: { 
          remotePatterns: [
            {
              protocol: 'https',
              hostname: 'eventia-media-storage.s3.amazonaws.com',
              port: '',
              pathname: '/**',
            },
          ],
        
      domains: ['eventia-media-storage.s3.amazonaws.com' , 'img.clerk.com'],
    },
  };
  
  export default nextConfig;