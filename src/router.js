import Vue from 'vue'
import Home from './views/Home.vue'
import Orders from './views/Orders.vue'
import OrderView from './views/Order.vue'
import Editor from './views/Editor.vue'
import Event from './views/Event.vue'
import Login from './views/Login.vue'
// import firebase from 'firebase'
// import './api/firebase'

import { IonicVueRouter } from '@ionic/vue'

Vue.use(IonicVueRouter)

let router = new IonicVueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/orders',
      name: 'orders',
      component: Orders,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/order/:id',
      name: 'order',
      component: OrderView,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/editor',
      name: 'editor',
      component: Editor,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/analytics',
      name: 'Analytics',
      component: Event,
      meta: {
        requiresAuth: true
      }
    }
    // {
    //   path: '/orders',
    //   name: 'orders',
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import(/* webpackChunkName: "order" */ './views/Orders.vue')
    // },    
  ]
});

// Nav Guards
router.beforeEach((to, from, next) => {
  // check for requiredAuth guard
  if(to.matched.some(record => record.meta.requiresAuth)){
    // check if NOT logged in
    if(!firebase.auth().currentUser){
      // Go to login
      next({
        path: '/login',
        query: {
          redirect: to.fullPath
        }
      });
    } else {
      // proceed to route
      next();
    }
  } else {
    next();
  }
});

export default router;