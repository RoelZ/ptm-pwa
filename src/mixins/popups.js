export default {
  methods: {
    openToast(status, message, buttons){
      return this.$ionic.toastController
        .create({
          color: (status === 'failed') ? 'danger' : 'primary',
          message,
          showCloseButton: buttons ? false : true,
          buttons
        })
        .then(t => t.present())
    },
    presentAlert(header, subHeader, message) {
      return this.$ionic.alertController
        .create({
          header,
          subHeader,
          message,
          buttons: ['OK'],
        })
        .then(a => a.present())
    },
  }
}