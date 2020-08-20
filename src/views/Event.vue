<template>  
  <ion-content fullscreen nopadding scroll-y="false">
      <analytics />
  </ion-content>
</template>

<script>
import Analytics from '@/components/Analytics.vue'

export default {
  name: 'event',
  components: {
    Analytics
  }
}
</script>
