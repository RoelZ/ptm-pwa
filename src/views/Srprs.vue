<template>
  <div class="ion-page">
    <ion-content fullscreen padding color="success">
      <ion-grid padding>
        <ion-row class="ion-justify-content-center ion-align-items-center">
          <ion-col size="3">
            <ion-input ref="one" class="ion-padding ion-text-center" clear-on-edit @ionInput="next('two').setFocus()" color="dark" inputmode="numeric" type="text" size="32" minlenght="1" min="0" maxlength="1" max="9" />
          </ion-col>
          <ion-col size="3">
            <ion-input ref="two" class="ion-padding ion-text-center" clear-on-edit @ionInput="next('three').setFocus()" color="dark" inputmode="numeric" type="text" size="32" minlenght="1" min="0" maxlength="1" max="9" />
          </ion-col>
          <ion-col size="3">
            <ion-input ref="three" class="ion-padding ion-text-center" clear-on-edit @ionInput="next('four').setFocus()" color="dark" inputmode="numeric" type="text" size="32" minlenght="1" min="0" maxlength="1" max="9" />
          </ion-col>
          <ion-col size="3">
            <ion-input ref="four" class="ion-padding ion-text-center" clear-on-edit @ionInput="nextInput = false" color="dark" inputmode="numeric" type="text" size="32" minlenght="1" min="0" maxlength="1" max="9" />
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col size="12">
            <ion-button href="route" expand="block" size="large" shape="round" strong :disabled="nextInput" color="dark">check rijrichting</ion-button>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </div>
  
</template>

<script>
export default {
  name: 'srprs',
  data() {
    return {
      nextInput: true
    }
  },
  computed: {
    // nextInput: (this.$refs.one.value != "") ? true : false
  },
  methods: {
    next(el) {
      if(el == 'two')
        return this.$refs.two;
      else if(el == 'three')
        return this.$refs.three;
      else if(el == 'four')
        return this.$refs.four;
    }
  }
}
</script>

<style scoped>
ion-input {
  --background: white;
  --color:black;
  font-size:3rem;
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