<template>
  <div>
    <ion-content fullscreen nopadding scroll-y="false">
      <ion-grid class="overlay" v-if="showOverlay">
        <ion-row>
          <ion-col class="ion-text-center">                
            <h1>Maak nu een poster</h1>
            <h3>en ontvang <strong>20% korting!</strong></h3>
            <span>{{images}}</span>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col>
            <ion-button size="large" color="secondary" :href="'https://www.placethemoment.com/nl/shop/map-poster/?code=alwaysforever'">
              Start
            </ion-button>
          </ion-col>
        </ion-row>
      </ion-grid>
      <ion-slides ref="ptmSlides">
        <ion-slide v-for="(image, index) in images" :key="`img-${index}`">
          <ion-img :src="image.url"></ion-img>
        </ion-slide>
      </ion-slides>
    </ion-content>
  </div>  
</template>

<script>
import axios from 'axios';

export default {
  name: 'getStarted',
  props: ['screen'],
  data () {
    return {
      showOverlay: this.screen,
      images: Object,
      limit: 1
    }
  },
  created () {
    axios
      // .get('https://api.instagram.com/v1/users/self/media/recent/?access_token=6220567066.841f026.e17a85a247df4b02a31850a053db1eae')
      .get('../mock/ptm.json')
      .then(response => { 
        this.images = response.data;
      })
  },
  updated () {
    this.$nextTick(function () {
      this.$refs.ptmSlides.update();
      this.$refs.ptmSlides.startAutoplay();
    });
  },
  computed: {
    computedObj(){
          return this.limit ? this.images.slice(0,this.limit) : this.images
    }
  }
}
</script>

<style scoped>

@import url('https://fonts.googleapis.com/css?family=Lobster&display=swap');

  ion-img {
    width:100vw;
    height:100vh;
    object-fit: cover;
  }
  .overlay {
    z-index: 2;
    top:0;
    bottom:0;
    left:0;
    right:0;
    position: absolute;
  }
  ion-grid {
    height:100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }
  ion-col {
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
  }
  h1,h2,h3 {
    font-family: -apple-system, BlinkMacSystemFont, "Lobster", "Helvetica Neue", "Roboto", sans-serif;
    color: whitesmoke;
    text-shadow: 1px 1px 4px black;
  }
  h1 {
    font-size: 5rem;
  }
  h3 {
    font-size:3rem;
  }
  h3 strong {
    color: var(--ion-color-secondary);
  }
</style>