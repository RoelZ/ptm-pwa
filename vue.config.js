module.exports = {
  devServer: {
    proxy: {
      '/wp-json/': {
        target: 'https://www.placethemoment.com/',
        changeOrigin: true
      },
      '/pie/psdService/': {
        target: 'https://image.adobe.io/',
        changeOrigin: true
      },
      '/api/v2/': {
        target: 'https://panel.sendcloud.sc/',
        changeOrigin: true
      }
    }
  },
  publicPath: process.env.NODE_ENV === 'production'
    ? '/apps/dashboard/'
    : '/',
}