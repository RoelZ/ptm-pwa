<template>
  <ion-app>
    <ion-content padding fullscreen>
      <ion-vue-router id="menu-content" />
    </ion-content>
    <ion-footer v-if="isLoggedIn">
      <h2>...</h2>
      <ion-tabs>
        <ion-tab tab="orders" :routes="'orders'"></ion-tab>
        <ion-tab tab="analytics" :routes="'analytics'"></ion-tab>
        <ion-tab tab="editor" :routes="'editor'"></ion-tab>

        <template slot="bottom">
          <ion-tab-bar>
            <ion-tab-button tab="orders" :to="'orders'">
              <ion-icon name="cart"></ion-icon>
              <ion-label>Orders</ion-label>
              <ion-badge v-if="orderCount" color="tertiary">{{ orderCount }}</ion-badge>
            </ion-tab-button>

            <ion-tab-button tab="analytics" :to="'analytics'">
              <ion-icon name="analytics"></ion-icon>
              <ion-label>Analytics</ion-label>
            </ion-tab-button>

            <ion-tab-button tab="scherm" :to="'editor'">
              <ion-icon name="easel"></ion-icon>
              <ion-label>Editor</ion-label>
            </ion-tab-button>

            <ion-tab-button v-on:click="logout()"> Logout </ion-tab-button>
          </ion-tab-bar>
        </template>
      </ion-tabs>
    </ion-footer>
  </ion-app>
</template>

<script>
import { addIcons } from "ionicons";
import { cart, easel, analytics } from "ionicons/icons";

import firebase from "firebase";
import "./api/firebase";

addIcons({
  "md-cart": cart.md,
  "md-easel": easel.md,
  "md-analytics": analytics.md,
});

export default {
  name: "app",
  data() {
    return {
      orderCount: 0,
      isLoggedIn: false,
      currentUser: false,
    };
  },
  created() {
    if (firebase.auth().currentUser) {
      this.isLoggedIn = true;
      this.currentUser = firebase.auth().currentUser.email;
    }
    if (this.isLoggedIn) {
      this.$woocommerce
        .get(`orders/?status=processing`)
        .then((response) => (this.orderCount = response.headers["x-wp-total"]))
        .catch((error) => console.log("Error Response:", error));
    }
  },
  methods: {
    logout() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.$router.push("/login");
        });
    },
  },
};
</script>

<style></style>
