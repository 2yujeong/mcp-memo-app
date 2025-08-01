import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // MDEditor를 클라이언트 사이드에서만 로드되도록 설정
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      }
    }
    return config
  },
  transpilePackages: ['@uiw/react-md-editor']
}

export default nextConfig
