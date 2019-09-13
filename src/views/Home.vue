<template>
  <ion-tabs>
    <ion-img :src="'img/ptm-wedding-signatures.jpg'" />

    <ion-tab tab="orders" :routes="'orders'"></ion-tab>
    <ion-tab tab="tablet" :routes="'event'"></ion-tab>
    <ion-tab tab="scherm" :routes="'event'"></ion-tab>

    <template slot="bottom">
      <ion-tab-bar>
        <ion-tab-button tab="orders" :to="'orders'">
          <ion-icon name="cart"></ion-icon>
          <ion-label>Orders</ion-label>
          <ion-badge color="tertiary">7</ion-badge>
        </ion-tab-button>

        <ion-tab-button tab="tablet" :to="{ name: 'event', params: { screen: true } }">
          <ion-icon name="tablet-portrait"></ion-icon>
          <ion-label>Tablet</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="scherm" :to="{ name: 'event', params: { screen: false } }">
          <ion-icon name="easel"></ion-icon>
          <ion-label>Scherm</ion-label>
        </ion-tab-button>

      </ion-tab-bar>
    </template>
  </ion-tabs>
</template>

<script>
import { addIcons } from "ionicons";
import { cart, easel, tabletPortrait } from "ionicons/icons";

addIcons({
  "md-cart": cart.md,
  "md-easel": easel.md,
  "md-tablet-portrait": tabletPortrait.md
});

export default {
  name: 'home'
}
</script>

<style scoped>
  ion-img {
    width:100vw;
    height:100vh;
    object-fit: cover;
  }
</style>
