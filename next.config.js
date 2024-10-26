// next.config.js

const withTM = require('next-transpile-modules')(['@piwikpro/next-piwik-pro']);

module.exports = withTM({
  env: {
    NEXT_PUBLIC_vercel: process.env.vercel,
  },
  reactStrictMode: true,
});