const htmlStandards = require('reshape-standard')
const cssStandards = require('spike-css-standards')
const pageId = require('spike-page-id')
const postcssEasyImport = require('postcss-easy-import')
const Records = require('spike-records')
const {UglifyJsPlugin, DedupePlugin, OccurrenceOrderPlugin} = require('webpack').optimize
const locals = {}

module.exports = {
  // disable source maps
  devtool: false,
  // webpack optimization and minfication plugins
  plugins: [
    new UglifyJsPlugin(),
    new DedupePlugin(),
    new OccurrenceOrderPlugin(),
    new Records({
      addDataTo: locals,
      data: { file: 'data/data.json' }
    })
  ],
  // image optimization
  module: {
    loaders: [{ test: /\.(jpe?g|png|gif|svg)$/i, loader: 'image-webpack' }]
  },
  // adds html minification plugin
  reshape: (ctx) => {
    return htmlStandards({
      webpack: ctx,
      locals: Object.assign({ pageId: pageId(ctx) }, locals),
      minify: true
    })
  },
  // adds css minification plugin
  postcss: (ctx) => {
    const css = cssStandards({
      webpack: ctx,
      minify: true,
      warnForDuplicates: false // cssnano includes autoprefixer
    })
    css.plugins.push(postcssEasyImport({ extensions: ['.sss'] }))
    return css
  }
}
