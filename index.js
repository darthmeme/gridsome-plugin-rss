const RSS = require('rss')
const fs = require('fs')
const path = require('path')
const camelcase = require('camelcase-keys');

module.exports = function (api, options) {
  api.beforeBuild(({ store }) => {
    const feed = new RSS(options.feedOptions)
    const { collection } = store.getContentType(options.contentTypeName)

    collection.data.forEach(item => {
      feed.item(options.feedItemOptions(camelcase(item, { deep: true })))
    })
  
    fs.writeFileSync(path.resolve(process.cwd(), 'static/rss.xml'), feed.xml())
  })
}
