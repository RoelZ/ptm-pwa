import Vue from 'vue'
import App from './App.vue'
import router from './router'
// import axios from './api'

import Ionic from '@ionic/vue'
import visibility from 'vue-visibility-change';

import firebase from './api/firebase';

const db = firebase.collection("/users");
console.log(db)

import '@ionic/core/css/ionic.bundle.css';
import 'leaflet/dist/leaflet.css';
import './assets/scss/main.scss';

Vue.use(Ionic);
Vue.use(visibility);
Vue.config.productionTip = false

const app
// firebase.auth().onAuthStateChanged(() => {
//   if(!app){
    = new Vue({
      router,
      axios,
      render: h => h(App)
    }).$mount('#app')
//   }
// })



