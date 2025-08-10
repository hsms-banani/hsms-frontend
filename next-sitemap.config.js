// next-sitemap.config.js
module.exports = {
  siteUrl: 'https://hsms-banani.org',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/private', '/api'],
      },
    ],
    additionalSitemaps: [
      'https://hsms-banani.org/sitemap-0.xml',
    ],
  },
  exclude: ['/admin/*', '/private/*', '/api/*', '/server-sitemap.xml'],
  changefreq: 'weekly',
  priority: 0.7,
}