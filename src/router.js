import Vue from 'vue'
// import Home from './views/Home.vue'
import Srprs from './views/Srprs.vue'
import Route from './views/Route.vue'
import Stay from './views/Stay.vue'
// import Event from './views/Event.vue'
import { IonicVueRouter } from '@ionic/vue'

Vue.use(IonicVueRouter)

export default new IonicVueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    // {
    //   path: '/',
    //   name: 'home',
    //   component: Home
    // },
    {
      path: '/',
      name: 'srprs',
      component: Srprs
    },
    {
      path: '/route',
      name: 'route',
      component: Route
    },
    {
      path: '/route/stay',
      name: 'stay',
      component: Stay
    },
    // {
    //   path: '/orders',
    //   name: 'orders',
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import(/* webpackChunkName: "order" */ './views/Orders.vue')
    // },
    // {
    //   path: '/event/:screen',
    //   name: 'event',
    //   component: Event,
    //   props: true
    // // component: () => import(/* webpackChunkName: "event" */ './views/Event.vue')
    // }
  ]
})
