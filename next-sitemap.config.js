/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://mathsmine3.xyz',
  generateRobotsTxt: true,
  sitemapSize: 7000,
  changefreq: 'daily',
  priority: 0.7,
  exclude: ['/icon.png'],
  transform: async (config, path) => {
    if (path === '/icon.png') return null // lo filtramos de nuevo por si acaso
    return {
      loc: `${config.siteUrl}${path}`,
      lastmod: new Date().toISOString(),
      changefreq: config.changefreq,
      priority: config.priority,
    }
  },
}
