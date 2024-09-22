/** @type {import('next').NextConfig} */
const nextConfig = {
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