# gridsome-plugin-rss

> Generate an RSS feed from your Gridsome data store

## Install
- `yarn add gridsome-plugin-rss`
- `npm install gridsome-plugin-rss`

## Usage

```js
module.exports = {
  plugins: [
    {
      use: 'gridsome-plugin-rss',
      options: {
        contentTypeName: 'BlogPost',
        feedOptions: {
          title: 'My Awesome Blog Feed',
          site_url: 'https://superblog.com'
        },
        feedItemOptions: (node, siteUrl) => ({
          title: node.title,
          description: node.content,
          url: siteUrl + '/blog/' + node.slug,
          author: node.fields.author
        }),
        outputPath: '/rss.xml'
      }
    }
  ]
}
```

## Options

#### contentTypeName
- Type: `string` *required*

The `typeName` of the `contentType` you wish to generate your RSS file for.

```js
const products = store.addContentType({
  typeName: 'BlogPost', // <-- add this to contentTypename
  route: '/blog/:slug',
})
```

#### feedOptions
- Type `object` *optional*

The top level options for your RSS feed. See [dylang/node-rss#feedoptions](https://github.com/dylang/node-rss#feedoptions) for all options.

#### feedItemOptions(*node*)
- Type `Function` *optional*
- Arg `node`
- Arg `siteUrl`
- Returns `object`

The item level options for your RSS feed. 
For each option (see [dylang/node-rss#itemoptions](https://github.com/dylang/node-rss#itemoptions) for all options), `node` is the object that you passed into [Collection.addNode](https://gridsome.org/docs/data-store-api#collectionaddnodeoptions) and `siteUrl` is `options.feedOptions.site_url` (if defined) or the value generated from your `gridsome.config.js` file.

The default implementation of this function will automatically convert relative links to full site paths in `node.content`, and maps the standard `node.title`, `node.date`, `node.path` and `node.content` to their RSS equivalents.

**NOTE**: Since Gridsome will convert any `node` field into camelCase, make sure that any property you access on `node` is also camelCased.

Example:
```js
// In gridsome.server.js
BlogPost.addNode({
  title: BlogPost.title,
  description: BlogPost.description,
  fields: {
    AuthorName: BlogPost.AuthorName,
    'url-slug': BlogPost['url-slug']
  }
})

...

// In the options for gridsome-plugin-rss
feedItemOptions: node => ({
  title: node.title,
  description: node.description,
  url: 'https://superblog.com/post/' + node.fields.urlSlug,
  author: node.fields.authorName,
})
```

#### outputPath
- Type `string` *optional*
- Defaults to `/rss.xml`

Specify the path to your generated RSS file will on the built site.

#### output
- Type `object` *deprecated*
- Defaults:
  - `dir`: `./static`
  - `name`: `rss.xml`

Specify the output directory and filename of the generated RSS.

`dir` - a relative path to desired output directory; **custom values no longer supported**

`name` - the filename of your XML file. You can omit the extension if you want to.

Example:
```js
output: {
  dir: './static/',
  name: 'rss' // or rss.xml
}
```
