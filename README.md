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
        })
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
