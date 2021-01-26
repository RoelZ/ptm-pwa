<template>
  <div>
    <map-tiler></map-tiler>
    <ion-segment>
      <ion-segment-button value="location">
        <ion-icon name="pin"></ion-icon>
      </ion-segment-button>
      <ion-segment-button value="text">
        <ion-icon name="quote"></ion-icon>
      </ion-segment-button>
      <ion-segment-button value="style">
        <ion-icon name="heart"></ion-icon>
      </ion-segment-button>
    </ion-segment>
  </div>
</template>

<script>
import MapTiler from '@/components/MapTiler.vue'

import { addIcons } from "ionicons";
import { pin, quote, heart } from "ionicons/icons";

addIcons({
  "md-pin": pin.md,
  "md-quote": quote.md,
  "md-heart": heart.md
});

export default {
  name: 'Editor',
  components: {
    MapTiler
  }
}
</script>

<style scoped>
ion-segement {
  margin-bottom:60px;
}
  /* ion-content {
    display: flex;
  }
  ion-card {
    width:800px;
    margin: 0 auto;
  } */
</style>
