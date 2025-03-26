import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: ['next-mdx-remote'],
  redirects: async () => [
    {
      source: '/docs',
      destination: '/docs/intro',
      permanent: false,
    },
    {
      source: '/filters',
      destination: '/docs/data-table-filter',
      permanent: false,
    },
    {
      source: '/r/filters',
      destination: '/r/data-table-filter.json',
      permanent: false,
    },
  ],
}

export default nextConfig
