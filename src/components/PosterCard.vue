<template>
  <div>
    <ion-card class="ion-padding" v-for="item in poster.line_items" :key="item.id">
      <ion-chip :color="posterItem.labelColor" :outline="!posterItem.express">
        <ion-label>{{poster.id}}{{posterItem.length}}</ion-label>
      </ion-chip>
      <ion-chip outline>
        <ion-label>{{posterItem.size}}</ion-label>
      </ion-chip>
      <ion-chip outline>
        <ion-label>{{posterItem.country}}</ion-label>
      </ion-chip>
      <ion-img :src="posterItem.map" class="ion-margin-top"></ion-img>
      <ion-card-header class="ion-text-center">
        <ion-card-title>{{posterItem.moment}}</ion-card-title>
        <ion-card-subtitle>{{posterItem.subline}}</ion-card-subtitle>
        <ion-card-subtitle>{{posterItem.tagline}}</ion-card-subtitle>
      </ion-card-header>

      <ion-card-content>
      </ion-card-content>
    </ion-card>
  </div>
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
      id: this.poster.id,
    }
  },
  computed: {
    posterItem(){
      let express = RegExp('Express*').test(this.poster.shipping_lines[0].method_title);

      // onderstaande gaat fout wanneer er een line_item mist (meta_data[7], meta_data[8], etc)
      // onderstaande mist meerder items in cart (line_items[0])

      return {
        size: this.poster.line_items[0].meta_data[0].value,
        design: this.poster.line_items[0].meta_data[1].value,
        moment: this.poster.line_items[0].meta_data[8].value,
        subline: this.poster.line_items[0].meta_data[9].value,
        tagline: this.poster.line_items[0].meta_data[10].value,
        map: this.poster.line_items[0].meta_data[11].value.substring(64, 9),
        hash: this.poster.cart_hash,
        country: this.poster.shipping.country,
        length: (this.poster.line_items.length > 1) ? '+' : '',
        shipping: this.poster.shipping_lines[0].method_title,
        express,
        labelColor: express ? 'danger' : ''
      }
    }
  },
}
</script>

<style scoped>
  ion-img {
    border-radius: 50%;
    overflow:hidden;
  }
  div {
    position: relative;
  }
  ion-card:not(:first-child) {
    top:20;
    left:20;
    z-index:-1;
    position: absolute;
  }
</style>