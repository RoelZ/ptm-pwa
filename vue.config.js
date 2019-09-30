module.exports = {
  devServer: {    
    disableHostCheck: true,
    proxy: {
      "/wp-json/wc/v3": {
        "target": 'https://www.placethemoment.com',
        // "pathRewrite": { '^wp-json/wc/v3' : '' },
        "changeOrigin": true,
        // "secure": false
        }
    }
  },
  publicPath: process.env.NODE_ENV === 'production'
    ? '/kcfuy/'
    : '/',
}