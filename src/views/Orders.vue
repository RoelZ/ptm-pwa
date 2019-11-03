<template>
  <div class="ion-page">
    <ion-content fullscreen padding>
      <ion-grid padding>

        <ion-row class="ion-justify-content-center">
          <ion-col size="12">
            <a href="/">
              <ion-img :src="'../img/logo-original-vector.svg'" />
            </a>
          </ion-col>
        </ion-row>

        <ion-row>
          <ion-col size="4">
            <ion-searchbar @ionInput="getOrder($event.target.value)" type="number" inputmode="numeric"></ion-searchbar>
          </ion-col>
          <ion-col>
            <ion-select value="processing" @ionChange="viewStatus($event.target.value)">
              <ion-select-option value="processing">Processing</ion-select-option>
              <ion-select-option value="completed">Completed</ion-select-option>
            </ion-select>
          </ion-col>
          <ion-col>
            <ion-button class="ion-no-margin">DataSet</ion-button>
          </ion-col>
        </ion-row>

        <ion-row class="ion-justify-content-center">
          <ion-col size="12">
            <div class="ion-padding poster-cards">
              <poster-card v-for="order in orderData" :key="order.id" :poster="order" />
            </div>
          </ion-col>
        </ion-row>

      </ion-grid>
    </ion-content>
    <ion-alert-controller></ion-alert-controller>
  </div>
</template>

<script>
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
    viewStatus(status){
      this.$woocommerce.get(`/orders/?status=${status}`)
        .then(response => this.orderData = response.data)
        .catch(error => console.log('error', error))
        .finally(console.log('WC done'))
    },
    getOrder(orderId){
      this.$woocommerce.get(`/orders/${orderId}`)
        .then(response => this.orderData = [response.data])
        .catch(error => console.log('error', error))
        .finally(console.log('WC done'))      
    }
  },  
  created () {
    this.$woocommerce.get('/orders?status=processing')
    .then(response => this.orderData = response.data)
    .catch(error => console.log('error', error))
    .finally(console.log('WC done'))
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
    margin:0 auto;
  }
  ion-input {

  }
  .poster-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit,minmax(240px,1fr));
    grid-gap: 1rem;
  }
</style>