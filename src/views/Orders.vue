<template>
  <div class="ion-page">
    <ion-content fullscreen padding>
      <ion-grid padding>
        <ion-row class="ion-justify-content-center">
          <ion-col xs-size="12" lg-size="6" lg-offset="3">
            <a href="/">
              <ion-img :src="'../img/logo-original-vector.svg'" />
            </a>
          </ion-col>
        </ion-row>
        <ion-row class="ion-justify-content-center">
          <ion-col size="12">
            <div class="ion-padding poster-cards">
              <poster-card v-for="order in orderData" :key="order.id" :poster="order" />
            </div>
          </ion-col>
        </ion-row>
        <ion-row class="ion-justify-content-center">
          <ion-col size="6" offset="3">
            <ion-button class="ion-no-margin">DataSet</ion-button>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
    <ion-alert-controller></ion-alert-controller>
  </div>
</template>

<script>
// import api from '@/api'
// import axios from 'axios'
import PosterCard from '@/components/PosterCard.vue'

export default {
  name: 'Orders',
  data () {
    return {
      isLoading: false,
      orderData: Array,
    }
  },
  methods: {
    // async getApiOrders(){
    //   try {
    //     this.isLoading = true
    //     const { orderData } = await api.getOrders()        
    //   }
    //   catch (error){
    //     console.log(error)
    //   }
    //   finally {
    //     this.isLoading = false
    //   }
    // }
  },  
  created () {
    this.$http.get('/orders')
    .then(response => this.orderData = response.data)
    .catch(error => console.log('error', error))
    .finally(console.log('done'))
  },
  mounted () {    
  },
  components: {
    PosterCard
  }
}
</script>

<style scoped>
  ion-img {
    width:200px;
  }
  .poster-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit,minmax(240px,1fr));
    grid-gap: 1rem;
  }
</style>