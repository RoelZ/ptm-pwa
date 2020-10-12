module.exports = {
  devServer: {
    proxy: {
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
}