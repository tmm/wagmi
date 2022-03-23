const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.js',
  unstable_contentDump: true,
  unstable_flexsearch: true,
  unstable_staticImage: true,
})

/** @type {import('next').NextConfig} */
const config = {
  i18n: {
    locales: ['en-US'],
    defaultLocale: 'en-US',
  },
  reactStrictMode: true,
  redirects: () => {
    return [
      {
        source: '/examples',
        destination: '/examples/connect-wallet',
        statusCode: 302,
      },
    ]
  },
}

module.exports = withNextra(config)
