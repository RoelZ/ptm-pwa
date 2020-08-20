import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from './api'
import firebase from 'firebase'
import Ionic from '@ionic/vue'

import './api/firebase';
import '@ionic/core/css/ionic.bundle.css';
import 'leaflet/dist/leaflet.css';
import './assets/scss/main.scss';

Vue.use(Ionic);
Vue.config.productionTip = false

let app;
firebase.auth().onAuthStateChanged(() => {
  if(!app){
    app = new Vue({
      router,
      axios,
      render: h => h(App)
    }).$mount('#app')
  }
})



