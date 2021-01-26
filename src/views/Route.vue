<template>
  <div class="ion-page">
    <ion-content fullscreen padding color="success">
      <ion-card color="light">
        <img src="img/mooialternatief.jpg" />
        <ion-card-header>
          <ion-card-subtitle>Rij richting</ion-card-subtitle>
          <ion-card-title>Het Mooi Alternatief</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          Start je route in zuidelijke richting (A2) en houdt <strong>Tielt-Winge, België</strong> aan.<br>
          Daar aangekomen gebruik je het adres <strong>Kasteeldreef 2</strong> en zoek een mooi plekje bij het café om je eind bestemming te onthullen!
        </ion-card-content>
      </ion-card>
      <ion-button href="stay" expand="block" size="large" shape="round" strong color="dark">check rijrichting</ion-button>
    </ion-content>
  </div>
  
</template>

<script>
export default {
  name: 'route',
  data() {
    return {
    }
  },
  methods: {    
  }
}
</script>

<style scoped>
h1, span {
  color: var(--ion-color-dark);
  font-weight: bold;
}
ion-row {
  height: 40vh;
}
ion-button {
  opacity:0;
}
</style>    