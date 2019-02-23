const RSS = require('rss')
const fs = require('fs')
const path = require('path')

module.exports = function (api, options) {
  api.beforeBuild(({ store }) => {
    const feed = new RSS(options.feedOptions)
    const { collection } = store.getContentType(options.contentTypeName)

    collection.data.forEach(item => {
      feed.item(options.feedItemOptions(item))
    })
  
    fs.writeFileSync(path.resolve(process.cwd(), 'static/rss.xml'), feed.xml())
  })
}
