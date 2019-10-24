import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from './api'
import Ionic from '@ionic/vue';
import '@ionic/core/css/ionic.bundle.css';

import './assets/scss/main.scss';

Vue.use(Ionic);
Vue.config.productionTip = false

new Vue({
  router,
  axios,
  render: h => h(App)
}).$mount('#app')

