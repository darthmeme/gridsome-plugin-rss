const RSS = require('rss')
const fs = require('fs-extra')
const path = require('path')
const url = require('url')

function absolutizeUrls (html, siteUrl) {
  // Currently playing it conservative and only modifying things that are explicitly relative URLs
  const relativeRefs = /(href|src)=("|')((?=\.{1,2}\/|\/).+?)\2/gi
  return html.replace(relativeRefs, (_, attribute, quote, relUrl) => {
    return [attribute, '=', quote, new url.URL(relUrl, siteUrl).href, quote].join('')
  })
}

module.exports = function (api, options) {
  api.afterBuild(({ config }) => {
    if (!config.siteUrl) {
      throw new Error('RSS plugin is missing required siteUrl config.')
    }
    if (!options.contentTypeName) {
      throw new Error('RSS plugin is missing required `options.contentTypeName` setting.')
    }
    // Note new breaking change, for those using a custom output directory
    if (options.output && options.output.dir !== './static') {
      throw new Error('RSS plugin no longer supports custom `options.output.dir` setting.')
    }

    const store = api.store
    const pathPrefix = config.pathPrefix !== '/' ? config.pathPrefix : ''
    const siteUrl = options.feedOptions.site_url || new url.URL(pathPrefix, config.siteUrl).href
    // Backwards compatibility for the original "build it in /static" approach
    const oldOutputName = (options.output && options.output.name) || null
    let outputPath = oldOutputName || options.outputPath
    outputPath = outputPath.endsWith('.xml') ? outputPath : `${outputPath}.xml`
    const feedOptions = {
      ...options.feedOptions,
      title: options.feedOptions.title || config.siteName,
      site_url: siteUrl,
      feed_url: options.feedOptions.feed_url || new url.URL(outputPath, siteUrl).href
    }

    const feed = new RSS(feedOptions)
    const { collection } = store.getContentType(options.contentTypeName)

    collection.data.forEach(item => {
      feed.item(options.feedItemOptions(item, siteUrl))
    })

    filePath = path.join(config.outDir, outputPath)
    return fs.outputFile(filePath, feed.xml())
  })
}

module.exports.defaultOptions = () => ({
  feedOptions: {
    title: null,
    site_url: null
  },
  feedItemOptions: (node, siteUrl) => ({
    title: node.title,
    date: node.date,
    description: absolutizeUrls(node.content, siteUrl),
    url: new url.URL(node.path, siteUrl).href
  }),
  outputPath: '/rss.xml'
})
