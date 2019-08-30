<template>  
    <div class="ion-page">
      <get-started :screen="show" />
  </div>
</template>

<script>
import GetStarted from '@/components/GetStarted.vue'

export default {
  name: 'event',
  props: ['screen'],
  data: function () {
    return {      
      show: this.screen
    }    
  },
  components: {
    GetStarted
  }
}
</script>
