<template>
  <ion-content nopadding scroll-y="false">  
      <ion-list v-show="false">
        <ion-item-sliding>
        <ion-item>
          <ion-label>
            Tileserver memory issue
          </ion-label>
        </ion-item>
        <ion-item-options side="end">
          <ion-item-option @click="unread(item)">Done</ion-item-option>
        </ion-item-options>
        </ion-item-sliding>
        <ion-item-sliding>
        <ion-item>
          <ion-label>
            Photoshop API automated token
          </ion-label>
        </ion-item>
        <ion-item-options side="end">
          <ion-item-option @click="unread(item)">Done</ion-item-option>
        </ion-item-options>
        </ion-item-sliding>
        <ion-item-sliding>
        <ion-item>
          <ion-label>
            Photoshop API font type
          </ion-label>
        </ion-item>
        <ion-item-options side="end">
          <ion-item-option @click="unread(item)">Done</ion-item-option>
        </ion-item-options>
        </ion-item-sliding>
        <ion-item-sliding>
        <ion-item>
          <ion-label>
            Batch order 2 PNG
          </ion-label>
        </ion-item>
        <ion-item-options side="end">
          <ion-item-option @click="unread(item)">Done</ion-item-option>
        </ion-item-options>
        </ion-item-sliding>
        <ion-item-sliding>
        <ion-item>
          <ion-label>
            Batch order 2 PSD
          </ion-label>
        </ion-item>
        <ion-item-options side="end">
          <ion-item-option @click="unread(item)">Done</ion-item-option>
        </ion-item-options>
        </ion-item-sliding>
        <ion-item-sliding>
        <ion-item>
          <ion-label>
            Multiple select for batch
          </ion-label>
        </ion-item>
        <ion-item-options side="end">
          <ion-item-option @click="unread(item)">Done</ion-item-option>
        </ion-item-options>
        </ion-item-sliding>
        <ion-item-sliding>
        <ion-item>
          <ion-label>
            OAuth Login
          </ion-label>
        </ion-item>
        <ion-item-options side="end">
          <ion-item-option @click="unread(item)">Done</ion-item-option>
        </ion-item-options>
        </ion-item-sliding>
      </ion-list>
</ion-content>
</template>

<script>
export default {
  name: 'home'
}
</script>

<style scoped>
  ion-content {
  --background:url('../assets/wedding.jpg'), #E7F2E7;
  }
</style>
