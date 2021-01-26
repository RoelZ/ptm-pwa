<template>
<div>
  <ion-header translucent>
    <ion-toolbar>
      <ion-title>Comments for order {{order}}</ion-title>
      <ion-buttons slot="end">
        <ion-button @click="dismissModal()">Close</ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <ion-content ref="ionNotes" fullscreen>
    <ion-card v-for="note in notesData" :key="note.id" padding class="ion-float-right ion-margin-bottom">
        <ion-text color="light">{{ note.note }}</ion-text>
        <ion-text color="light"><span>{{ note.date_created }}</span></ion-text>
    </ion-card>
    <ion-card padding v-if="customerNote" class="ion-float-right ion-margin-bottom customer">
        <ion-text color="light">{{ customerNote }}</ion-text>
    </ion-card>
  </ion-content>
  <ion-footer>
    <ion-item detail="false">
      <ionTextareaVue clearOnEdit="true" v-model="note" placeholder="Typ een bericht"></ionTextareaVue>
      <ion-button fill="clear" size="large" slot="end" @click="createNote()">
        <ion-icon color="tertiary" name="send" slot="icon-only"></ion-icon>
      </ion-button>
  </ion-item>
    
  </ion-footer>
  </div>
</template>

<script>
import { addIcons } from "ionicons";
import { send } from "ionicons/icons";

addIcons({
  "md-send": send.md,
  "ios-send": send.ios,
});

export default {
  name: 'OrderComments',
  props: {
    order: Number,
    customerNote: String
  },
  data(){
    return {
      notesData: Array,
      note: null
    }
  },
  computed: {
    reverseNotes(){
      return this.notesData.slice().reverse()
    }
  },
  created() {
    if(this.order){
      console.log(this.$refs, this.$refs['ionNotes'])
      this.$woocommerce.get(`orders/${this.order}/notes`)
        .then(response => { this.notesData = response.data })
        .then(this.$refs['ionNotes'].scrollToBottom(0))
        .catch(error => console.log('error', error))
    }
  },
  methods: {
    createNote(){
      if(this.order){
        this.$woocommerce.post(`orders/${this.order}/notes`, `{ "note": "${this.note}" }` )
        .then(response => { 
          this.notesData.unshift(response.data);
          console.log(response.data)
        })
        .catch(error => console.log('error', error))
      }      
    },
    dismissModal() {
      this.$ionic.modalController.dismiss();
    }
  }
}
</script>

<style scoped>
 ion-card {
   width:75%;
   padding-bottom: .5rem;
  --background: var(--ion-color-medium)
 }
 ion-card.customer {
  --background: var(--ion-color-tertiary)
 }
 ion-content {
   --background:var(--ion-color-light);
 }
 ion-text {
   display: block;
 }
 ion-text:not(:last-child){   
   font-size:.75rem;
 }
 ion-text:last-child {
   padding-top:.5rem;
 }
 ion-text span {   
   font-size:.5rem;
   text-align: right;
   display: block;
 }
</style>