// next-sitemap.config.js
module.exports = {
  siteUrl: 'https://holycrosscollege.edu.bd',
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
      'https://holycrosscollege.edu.bd/sitemap-0.xml',
    ],
  },
  exclude: ['/admin/*', '/private/*', '/api/*', '/server-sitemap.xml'],
  changefreq: 'weekly',
  priority: 0.7,
}