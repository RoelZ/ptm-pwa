<template>
  <ion-card class="ion-padding">
    <ion-chip :color="labelColor" :outline="!poster.express">
      <ion-label>{{poster.id}}</ion-label>
    </ion-chip>
    <ion-chip outline>
      <ion-label>{{poster.size}}</ion-label>
    </ion-chip>
    <ion-img :src="poster.map" class="ion-margin-top"></ion-img>
    <ion-card-header class="ion-text-center">
      <ion-card-title>{{poster.moment}}</ion-card-title>
      <ion-card-subtitle>{{poster.subline}}</ion-card-subtitle>
      <ion-card-subtitle>{{poster.tagline}}</ion-card-subtitle>
    </ion-card-header>

    <ion-card-content>
    </ion-card-content>
  </ion-card>
</template>

<style>

</style>

<script>
export default {
  name: 'PosterCard',
  props: {
    poster: Object
  },
  data (){
    return {
      labelColor: this.poster.express ? 'danger' : undefined
    }
  }
}
</script>

<style scoped>
  ion-img {
    border-radius: 50%;
    overflow:hidden;
  }
</style>