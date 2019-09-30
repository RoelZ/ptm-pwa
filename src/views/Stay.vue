<template>
  <div class="ion-page">
    <ion-content fullscreen padding color="success">
      <ion-card color="light">
        <img src="img/tafelrond.jpg" />
        <ion-card-header>
          <ion-card-subtitle>Destination</ion-card-subtitle>
          <ion-card-title>Tafelrond, The Fourth</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          Dit luxe hotel in een indrukwekkend middeleeuws gebouw dat vandaag te dag er al de vierde versie van het gebouw staat; het eerste gebouw werd gebouwd in de jaren 1480. De naam komt van het gegeven dat de burgers van de stad er eeuwenlang konden vergaderen.<br>
          Het ligt op een minuut lopen van het vijftiende-eeuwse stadhuis en op dertien minuten lopen van het treinstation van Leuven.<br>
          <br>
          De kamers hebben een houten vloer en een marmeren badkamer en zijn gedecoreerd met moderne kunst.
        </ion-card-content>
      </ion-card>
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
ion-row:first-child {
  height: 40vh;
}
ion-button {
  opacity:1;
}
ion-button.button-disabled {
  opacity:0;
}
</style>    