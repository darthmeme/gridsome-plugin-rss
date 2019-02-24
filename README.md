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
          title: 'My Awesome Blog',
          feed_url: 'https://superblog.com/rss.xml',
          site_url: 'https://superblog.com'
        },
        feedItemOptions: node => ({
          title: node.title,
          description: node.description,
          url: 'https://superblog.com/post/' + node.slug,
          author: node.fields.author
        }),
        output: {
          dir: './static',
          name: 'rss.xml'
        }
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
- Type `object` *required*

The top level options for your RSS feed. See [dylang/node-rss#feedoptions](https://github.com/dylang/node-rss#feedoptions) for all options

#### feedItemOptions(*node*)
- Type `Function` *required*
- Arg `node`
- Returns `object`

The item level options for your RSS feed. 
For each option (see [dylang/node-rss#itemoptions](https://github.com/dylang/node-rss#itemoptions) for all options), `node` is the object that you passed into [Collection.addNode](https://gridsome.org/docs/data-store-api#collectionaddnodeoptions)

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

#### output
- Type `object` *optional*
- Defaults:
  - `dir`: `./static`
  - `name`: `rss.xml`

Specify the output directory and filename of the generated RSS.

`dir` - a relative path to desired output directory

`name` - the filename of your XML file. You can omit the extension if you want to.

Example:
```js
output: {
  dir: './static/',
  name: 'rss' // or rss.xml
}
```
