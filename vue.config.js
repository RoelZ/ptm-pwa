module.exports = {
  devServer: {
    proxy: {
      '/wp-json/': {
        target: 'https://www.placethemoment.com/',
        changeOrigin: true
      }
    }
  },
  publicPath: process.env.NODE_ENV === 'production'
    ? '/kcfuy/'
    : '/',
}