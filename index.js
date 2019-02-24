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

    const output = {
      dir: './static',
      name: 'rss.xml',
      ...options.output
    }

    const outputPath = path.resolve(process.cwd(), output.dir)
    const outputPathExists = fs.existsSync(outputPath)
    const fileName = output.name.endsWith('.xml')
      ? output.name
      : `${output.name}.xml`

    if (outputPathExists) {
      fs.writeFileSync(path.resolve(process.cwd(), output.dir, fileName), feed.xml())
    } else {
      fs.mkdirSync(outputPath)
      fs.writeFileSync(path.resolve(process.cwd(), output.dir, fileName), feed.xml())
    }
  })
}
