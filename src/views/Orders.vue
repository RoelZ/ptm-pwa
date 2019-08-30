<template>
  <div class="ion-page">
    <ion-content fullscreen padding>
      <ion-grid padding>
        <ion-row class="ion-justify-content-center">
          <ion-col size="6" offset="3">
            <a href="/">
              <ion-img :src="'../img/logo-original-vector.svg'" />
            </a>
          </ion-col>
        </ion-row>
        <ion-row class="ion-justify-content-center">
          <ion-col size="12">
            <div class="ion-padding poster-cards">
              <poster-card v-for="order in orders" :key="order.id" :poster="order" />
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
import PosterCard from '@/components/PosterCard.vue'

export default {
  name: 'Orders',
  data () {
    return {
      orders: [
        {
          id: 4000,
          size: '50x70',
          map: 'https://www.placethemoment.com/thumbs/5d5d0dc9af856.png',
          design: 'snow',
          express: true,
          country: 'nl',
          moment: 'demo',
          subline: 'demo',
          tagline: 'demo',
          hash: 'demo'
        },
        {
          id: 4100,
          size: '30x40',
          map: 'https://www.placethemoment.com/thumbs/5d692bfe30527.png',
          design: 'granite',
          express: false,
          country: 'nl',
          moment: 'where you and me, became us',
          subline: '24 december 2016',
          tagline: 'Brandweerkazerne Vlaardingen',
          hash: 'demo'
        }
      ]
    }
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