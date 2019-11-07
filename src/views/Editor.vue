<template>
<ion-grid>
  <ion-row justify-content-center	align-items-stretch>
    <ion-col size="8">
      <ion-card>
        <ion-img src="https://www.placethemoment.com/thumbs/5db745ae662f9.png"></ion-img>
        <ion-card-header class="ion-text-center">
          <ion-card-title>My Moment</ion-card-title>
          <ion-card-subtitle>My subline</ion-card-subtitle>
        </ion-card-header>

        <ion-card-content class="ion-text-center">
          My tagline
        </ion-card-content>
      </ion-card>
    </ion-col>
  </ion-row>
</ion-grid>
</template>

<script>
// import GetStarted from '@/components/GetStarted.vue'

export default {
  name: 'editor'
}
</script>

<style scoped>
ion-grid {
  height: 100%
}
ion-img {
  margin:6rem 10rem;
}
  /* ion-content {
    display: flex;
  }
  ion-card {
    width:800px;
    margin: 0 auto;
  } */
</style>
