const path = require('path')
const HardSourcePlugin = require('hard-source-webpack-plugin')
const htmlStandards = require('reshape-standard')
const cssStandards = require('spike-css-standards')
const jsStandards = require('babel-preset-latest')
const pageId = require('spike-page-id')
const postcssEasyImport = require('postcss-easy-import')
const Records = require('spike-records')
const locals = {}

module.exports = {
  devtool: 'source-map',
  matchers: {
    html: '*(**/)*.sgr',
    css: '*(**/)*.sss'
  },
  ignore: ['**/layout.sgr', '**/_*', '**/.*', '_cache/**', 'readme.md'],
  vendor: 'assets/vendor/**',
  reshape: (ctx) => {
    return htmlStandards({
      webpack: ctx,
      locals: Object.assign({ pageId: pageId(ctx), applications_open: 'yes' }, locals)
    })
  },
  postcss: (ctx) => {
    const css = cssStandards({ webpack: ctx })
    css.plugins.push(postcssEasyImport({ extensions: ['.sss'] }))
    return css
  },
  babel: { presets: [jsStandards] },
  plugins: [
    new HardSourcePlugin({
      environmentPaths: { root: __dirname },
      recordsPath: path.join(__dirname, '_cache/records.json'),
      cacheDirectory: path.join(__dirname, '_cache/hard_source_cache')
    }),
    new Records({
      addDataTo: locals,
      data: { file: 'data/data.json' }
    })
  ]
}
