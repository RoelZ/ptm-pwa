<template>
    <ion-app>
      <ion-content padding fullscreen>
        <ion-vue-router />
      </ion-content>
      <ion-footer>
        <h2>test</h2>
      <ion-tabs>
        <ion-tab tab="orders" :routes="'orders'"></ion-tab>
        <ion-tab tab="tablet" :routes="'event'"></ion-tab>
        <ion-tab tab="editor" :routes="'editor'"></ion-tab>

        <template slot="bottom">
          <ion-tab-bar>
            <ion-tab-button tab="orders" :to="'orders'">
              <ion-icon name="cart"></ion-icon>
              <ion-label>Orders</ion-label>
              <ion-badge color="tertiary">7</ion-badge>
            </ion-tab-button>

            <ion-tab-button disabled tab="tablet" :to="{ name: 'event', params: { screen: true } }">
              <ion-icon name="tablet-portrait"></ion-icon>
              <ion-label>Tablet</ion-label>
            </ion-tab-button>

            <ion-tab-button tab="scherm" :to="'editor'">
              <ion-icon name="easel"></ion-icon>
              <ion-label>Editor</ion-label>
            </ion-tab-button>

          </ion-tab-bar>
        </template>
      </ion-tabs>
      </ion-footer>
    </ion-app>
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
  name: 'app'  
}
</script>

<style>

</style>
