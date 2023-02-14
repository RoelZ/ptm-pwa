<template>
  <div class="container">
    <ion-card :color="getLineItem(index).design" v-for="(item, index) in poster.line_items" :key="item.id">
      <ion-card-header>        
        <ion-chip :color="item.labelColor" :outline="!item.express">
          <ion-label>{{getLineItem(index).id}}</ion-label>
        </ion-chip>
        <ion-chip outline>
          <ion-label>{{getLineItem(index).size}}</ion-label>
        </ion-chip>
        <ion-chip outline>
          <ion-label>{{getLineItem(index).country}}</ion-label>
        </ion-chip>
        <ion-chip class="ion-color ion-color-danger" v-if="getLineItem(index).notes" @click="createModal()">
          <ion-icon name="mail-unread" class="ion-no-margin"></ion-icon>
        </ion-chip>        
      </ion-card-header>

      <ion-card-content class="ion-text-center" @click="presentActionSheet(getLineItem(index))">
          <ion-img :src="getLineItem(index).lowres" class="ion-margin-horizontal"></ion-img>
          <div class="ion-margin-vertical">
            <ion-card-title>{{getLineItem(index).moment}}</ion-card-title>
            <ion-card-subtitle>{{getLineItem(index).subline}}</ion-card-subtitle>
            <ion-card-subtitle>{{getLineItem(index).tagline}}</ion-card-subtitle>
          </div>
      </ion-card-content>
        
      <div class="card-overlay" v-if="loading">
        <ion-spinner name="dots"></ion-spinner>
      </div>
    </ion-card>
  </div>
</template>

<style>

</style>

<script>
import Vue from 'vue'
import OrderComments from '@/components/OrderComments';
import { addIcons } from "ionicons";
import { cube, cloudy, mailUnread } from "ionicons/icons";

addIcons({
  "md-cube": cube.md,
  "md-cloudy": cloudy.md,
  "md-mail-unread": mailUnread.md
});

export default {
  name: 'PosterCard',
  props: {
    id: Number,
    poster: Object,
    shipping: Object
  },
  data (){
    return {      
      // id: this.poster.id,
      flipped: false,
      loading: false
    }
  },
  computed: {
    posterItem(){
      // let item = Object.keys(this.poster.line_items).map(index => this.poster.line_items[index]);
      // console.log(item);
      // let iterator = this.poster.line_items.keys();
      // console.log(this.poster.line_items.findIndex());
      
      if(this.poster.line_items.length > 1)
        console.log('meer');

      let express = RegExp('Express*').test(this.poster.shipping_lines[0].method_title);
      // let size = (this.poster.line_items[0].meta_data[0].value == '30x40cm') ? 'S' : 'L'

      // onderstaande gaat fout wanneer er een line_item mist (meta_data[7], meta_data[8], etc)
      // onderstaande mist meerder items in cart (line_items[0])
      // (this.poster.line_items.length)

      let oldOrder = 0
      if(this.poster.line_items[0].meta_data[2].key !== '_fly_woo_discount_price_rules')
        oldOrder = 1

      return {
        id: this.poster.id,
        size: 'large',
        design: this.poster.line_items[0].meta_data[1].value,
        marker: this.poster.line_items[0].meta_data[this.metaData(7, oldOrder)].value,
        moment: this.poster.line_items[0].meta_data[this.metaData(8, oldOrder)].value,
        subline: this.poster.line_items[0].meta_data[this.metaData(9, oldOrder)].value,
        tagline: this.poster.line_items[0].meta_data[this.metaData(10, oldOrder)].value,
        lowres: this.poster.line_items[0].meta_data[this.metaData(11, oldOrder)].value.substring(64, 9),
        highres: this.poster.line_items[0].meta_data[this.metaData(12, oldOrder)].value.match(/"(.*?)"/gi)[0].slice(1,-1),
        hash: this.poster.cart_hash,
        language: this.poster.line_items[0].meta_data[this.metaData(13, oldOrder)] ? this.poster.line_items[0].meta_data[this.metaData(13, oldOrder)].value : 'nl',
        country: this.poster.shipping.country,
        length: (this.poster.line_items.length > 1) ? '+' : '',
        shipping: this.poster.shipping_lines[0].method_title,
        express,
        labelColor: express ? 'danger' : '',        
        notes: this.poster.customer_note
      }
    },    
  },
  methods: {
    openToast(status, message, buttons){
        return this.$ionic.toastController
          .create({
            color: (status === 'failed') ? 'danger' : 'primary',
            message,
            showCloseButton: buttons ? false : true,
            buttons
          })
          .then(t => t.present())
      },
    getLineItem(index){
      let express = RegExp('Express*').test(this.poster.shipping_lines[0].method_title);
      let size = (this.poster.line_items[index].meta_data[0].value == '30x40cm') ? 'S' : 'L'

      // onderstaande gaat fout wanneer er een line_item mist (meta_data[7], meta_data[8], etc)
      // onderstaande mist meerder items in cart (line_items[0])
      if(this.poster.line_items.length > 1)
        console.log("meer", index)

      let oldOrder = 0
      if(this.poster.line_items[index].meta_data[2].key !== '_fly_woo_discount_price_rules')
        oldOrder = 1

      return {
        id: this.poster.id,
        size,
        design: this.poster.line_items[index].meta_data[1].value,
        marker: this.poster.line_items[index].meta_data[this.metaData(7, oldOrder)].value,
        moment: this.poster.line_items[index].meta_data[this.metaData(8, oldOrder)].value,
        subline: this.poster.line_items[index].meta_data[this.metaData(9, oldOrder)].value,
        tagline: this.poster.line_items[index].meta_data[this.metaData(10, oldOrder)].value,
        lowres: this.poster.line_items[index].meta_data[this.metaData(11, oldOrder)].value.substring(64, 9),
        highres: this.poster.line_items[index].meta_data[this.metaData(12, oldOrder)].value.match(/"(.*?)"/gi)[0].slice(1,-1),
        hash: this.poster.cart_hash,
        language: this.poster.line_items[index].meta_data[this.metaData(13, oldOrder)] ? this.poster.line_items[index].meta_data[this.metaData(13, oldOrder)].value : 'nl',
        country: this.poster.shipping.country,
        length: (this.poster.line_items.length > 1) ? '+' : '',
        shipping: this.poster.shipping_lines[0].method_title,
        express,
        labelColor: express ? 'danger' : '',        
        notes: this.poster.customer_note
      }
    },
    metaData(num, substract){      
      return substract ? num - substract : num
    },
    createModal() {
      let ComponentClass = Vue.extend(OrderComments)
      let ComponentInstance = new ComponentClass({
          propsData: { order: this.id, customerNote: this.posterItem.notes }
      })
      ComponentInstance.$mount()

      this.$ionic.modalController.create({
        component: ComponentInstance.$el
      }).then(modal => {
        modal.present();
        // currentModal = modal;
      });
    },
    posterImage(poster){
      fetch(poster.highres)
        .then(resp => resp.blob())
        .then(blob => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.style.display = 'none';
          a.href = url;
          a.download = poster.id+'.png';
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
        })
        .catch(() => alert('Probleem bij het ophalen..')); 
    },
    createMap(poster){
      this.$photoshop.post('/renditionCreate',this.mapObject(poster.id, poster.highres))
      .then(response => this.getAdobeStatus(response.data._links.self.href));
    },
    async createPDF(poster){
      this.loading = true
      const createJob = await this.$photoshop.post('/renditionCreate',this.adobeObject(poster));
      const statusLink = await createJob.data._links.self.href;
      setTimeout(() => {
        this.getAdobeStatus(statusLink);        
      }, 2500);
    },
    async getAdobeStatus(url){       
      const getStatus = await this.$photoshop.get(url)
      getStatus.data.outputs.forEach(item => {
        console.log(item.status)
        if(item.status === 'running'){
          this.openToast(item.status, 'Still creating PSD  <ion-spinner name="dots"></ion-spinner>', [{ 
            text: 'Check again', handler: () => {
              this.getAdobeStatus(url);
            } 
          }])
        }
        else if(item.status === 'failed')
          item.errors.details.forEach(error => this.presentAlert(item.errors.title, error.name, error.reason));
        else if(item.status === 'succeeded'){
          this.loading = false
          this.openToast(item.status, 'Job completed');
        }
      });
    },
    presentActionSheet(poster) {
      return this.$ionic.actionSheetController
        .create({
          header: 'Actions',
          buttons: [
            {
              text: 'Drukwerkbestand',
              icon: 'cloudy',
              handler: () => {
                this.createPDF(poster)
              },
            },
            {
              text: 'Verzendlabel',
              icon: 'cube',
              handler: () => {
                this.sc_parcel_label(poster)
              },
            },
            {
              text: 'Annuleer',
              icon: 'close',
              role: 'cancel',
              handler: () => {
                console.log('Cancel clicked')
              },
            },
          ],
        })
        .then(a => a.present())
    },
    sc_orderinfo(poster){
      this.$sendcloud.get(`/integrations/52134/shipments?order_number=${poster.id}`)
      .then(response => this.presentAlert('SendCloud API', 'Order details', `<pre>${response}</pre>`));
    },
    async sc_parcel_label(poster){
      const parcel_obj = await this.$sendcloud.get(`/parcels/?order_number=${poster.id}`)
      
      parcel_obj.data.parcels.forEach(parcel => {
        this.$sendcloud.get(`/parcels/${parcel.id}/documents/label`, { responseType: 'blob' })
        .then(response => {
          let blob = new Blob([response.data], { type: 'application/pdf' });
          let link = document.createElement('a')
          link.href = window.URL.createObjectURL(blob)
          link.download = 'verzendlabel.pdf'
          link.click();
        })
      })
    },
    presentAlert(header, subHeader, message) {
      return this.$ionic.alertController
        .create({
          header,
          subHeader,
          message,
          buttons: ['OK'],
        })
        .then(a => a.present())
    },
    rgb16(color){
      return (color === 'granite') ? { "rgb": { "blue": 10794, "green": 11180, "red": 11822 } }
           : (color === 'mint') ? { "rgb": { "blue": 14264, "green": 20689, "red": 17605 } }
           : (color === 'snow') ? { "rgb": { "blue": 32768, "green": 32768, "red": 32768 } }
           : (color === 'black') ? { "rgb": { "blue": 0, "green": 0, "red": 0 } }
           : { "rgb": { "blue": 27756, "green": 22359, "red": 8995 } }    
    },
    rgb(color){
      return (color === 'granite') ? { "rgb": { "blue": 92, "green": 87, "red": 84 } }
           : (color === 'mint') ? { "rgb": { "blue": 137, "green": 161, "red": 111 } }
           : (color === 'snow') ? { "rgb": { "blue": 255, "green": 255, "red": 255 } }
           : (color === 'black') ? { "rgb": { "blue": 0, "green": 0, "red": 0 } }
           : { "rgb": { "blue": 70, "green": 174, "red": 216 } }    
    },
    textColor(design) {
      return (design === 'snow' || design === 'honey') ? this.rgb('black')
           : (design === 'granite' || design === 'mint') ? this.rgb('snow')
           : this.rgb('granite')
    },
    designNumber(design){
      return (design === 'snow') ? 0 
           : (design === 'moon') ? 1 
           : (design === 'granite') ? 2 
           : (design === 'mint') ? 3 
           : 4
    },
    editMap(poster){
      console.log(poster);
      if(poster.size === 'L'){
        return {
          "id":281,
          "edit":{},
          "name": "MAP",
          "input":{
            "href":`/files/PTM/Maps/${poster.id}.png`,
            "storage":"adobe"
          },
          "bounds":{
            "height":4729,
            "left":661,
            "top":945,
            "width":4728
          },
        }       
      }      
      else if(poster.size === 'S'){
        console.log(poster);
        return {
          "id":590,
          "edit":{},
          "name": "MAP",
          "input":{
            "href":`/files/PTM/Maps/${poster.id}.png`,
            "storage":"adobe"
          },
          "bounds":{
            "height":2877,
            "left":404,
            "top":523,
            "width":2877
          },
        }
      }
      else
        return {}
    },
    editPin(poster){
      if(poster.size === 'L'){
        return {
          "id":749,
          "edit":{},
          "name": "PIN",
          "fill": {
            "solidColor": this.rgb(poster.marker)
          },
        }
      }
      else if(poster.size === 'S'){
        return {
          "id":752,
          "edit":{},
          "name": "PIN",
          "fill": {
            "solidColor": this.rgb(poster.marker)
          },
        }
      }
      else
        return {}
    },
    mapObject(posterid, posterurl){
      return {
        "inputs": [
          {
            "href": posterurl,
            "storage": "external"
          }
        ],
        "outputs":[
          {
            "href":`/files/PTM/Maps/${posterid}.png`,
            "storage":"adobe",
            "type":"image/png",
            "width":0,
            "overwrite":true,
            "compression":"small"
          }
        ]
      }
    },
    adobeObject(poster){
      let snow = (poster.design === 'snow') ? true : false
      let moon = (poster.design === 'moon') ? true : false
      let granite = (poster.design === 'granite') ? true : false
      let mint = (poster.design === 'mint') ? true : false
      let honey = (poster.design === 'honey') ? true : false

      return {
        "inputs": [
          {
            // "href": `/files/PTM/Templates/PTM-${poster.size.toUpperCase()}-XXXX-1-NL-nl.psd`,
            "href": `/files/PTM/Templates/PTM-${poster.size}-XXXX-1-NL-nl.psd`,
            "storage": "adobe"
          }
        ],
        "options":{
          "layers":[
            this.editMap(poster),
            this.editPin(poster),
            {
              "id":247,
              "edit":{},        
              "name": "LANGUAGE",
              "text":{
                "content": poster.language,
                "characterStyles": [{ "fontColor": this.textColor(poster.design) }]
              },
            },
            {
              "id":228,
              "edit":{},        
              "name": "COUNTRY",
              "text":{
                "content": poster.country,
                "characterStyles": [{ "fontColor": this.textColor(poster.design) }]
              },
            },
            {
              "id":487,
              "edit":{},        
              "name": "SIZE",
              "text":{
                "content": poster.size,
                "characterStyles": [{ "fontColor": this.textColor(poster.design) }]
              },
            },
            {
              "id":248,
              "edit":{},        
              "name": "DESIGN",
              "text":{
                "content": this.designNumber(poster.design),
                "characterStyles": [{ "fontColor": this.textColor(poster.design) }]
              },
            },
            {
              "id":227,
              "edit":{},        
              "name": "ORDER ID",
              "text":{
                "content": poster.id,
                "characterStyles": [{ "fontColor": this.textColor(poster.design) }]
              },
            },
            {
              "id":226,
              "edit":{},        
              "name": "PREFIX",
              "text":{
                "content": "PTM",
                "characterStyles": [{ "fontColor": this.textColor(poster.design) }]
              },
            },
            {
              "id":249,
              "edit":{},        
              "name": "FORMAT",
              "text":{
                "content": "-   -         -  -     -",
                "characterStyles": [{ "fontColor": this.textColor(poster.design) }]
              },
            },
            {
              "id":225,
              "edit":{},
              "name": "TITLE",
              "text":{
                "content": poster.moment,
                "characterStyles": [{ "fontColor": this.textColor(poster.design) }]
              },
            },
            {
              "id":224,
              "edit":{},
              "name": "SUBLINE",
              "text":{
                "content": poster.subline,
                "characterStyles": [{ "fontColor": this.textColor(poster.design) }]
              },
            },
            {
              "id":223,
              "edit":{},        
              "name": "TAGLINE",
              "text":{
                "content":  poster.tagline,
                "characterStyles": [{ "fontColor": this.textColor(poster.design) }]
              },
            },
            {
              "edit":{}, 
              "id":230,
              "visible": false        
            },
            {
              "id":552,
              "edit":{},        
              "name": "WHITE LINE",
              "visible": (granite || mint) ? true : false
            },
            {
              "id":551,
              "edit":{},        
              "name": "BLACK LINE",
              "visible": (snow || honey) ? true : false
            },
            {
              "id":33,
              "edit":{},        
              "name": "GRANITE LINE",
              "visible": moon
            },
            {
              "id":548,
              "edit":{},        
              "name": "GRANITE BG",
              "visible": granite
            },
            {
              "id":549,
              "edit":{},        
              "name": "MINT BG",
              "visible": mint
            },
            {
              "id":550,
              "edit":{},        
              "name": "HONEY BG",
              "visible": honey
            },
            // Small only
            // (poster.size === 'S') ? { "edit":{}, "id":740, "visible": false } : ''
          ]
        },
        "outputs":[
          {
            "href":`/files/PTM/Templates/outputs/PTM-${poster.size}-${poster.id}-${this.designNumber(poster.design)}-${this.posterItem.country}-${this.posterItem.language}.jpg`,
            "storage":"adobe",
            "type":"image/jpeg",
            "width":0,
            "overwrite":true,
            "quality":3
          },
          {
            "href":`/files/PTM/Templates/outputs/PTM-${poster.size}-${poster.id}-${this.designNumber(poster.design)}-${this.posterItem.country}-${this.posterItem.language}.psd`,
            "storage":"adobe",
            "type":"vnd.adobe.photoshop",
            "overwrite":true
          }
        ]
      }
    }
  }
}
</script>

<style scoped>
  .scene {
    width:280px;
    height:500px;
    perspective: 600px;
  }
  .flip-card {
    width: 100%;
    height: 100%;
    position: relative;
    transition: transform .5s;
    transform-style: preserve-3d;
  }
  .flip-card.flip {
    transform: rotateY(180deg);
  }
  .card-face {
    position: absolute;
    height: 100%;
    width: 100%;
    backface-visibility: hidden;
  }
  .card-back {
    transform: rotateY( 180deg );
  }
  .card-overlay {
    top:0;
    bottom:0;
    left:0;
    right:0;
    position: absolute;
    z-index:1;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    background-color:rgba(255,255,255,.75);
  }
  .toast-message {    
    display: flex;
    align-items: center;
  }
  .container {
    position:relative;
  }
  ion-img {
    border-radius: 50%;
    overflow:hidden;
  }
  ion-card-title {
    font-size:1.125rem;
  }
  ion-card {
    /* transition: transform 0.6s; */
    transform-style: preserve-3d;
    transition: all 0.1s cubic-bezier(0.47, 0, 0.745, 0.715);
  }
  ion-card:not(:first-child) {
    top:0;
    left:0;
    z-index:-1;
    position: absolute;
  }
  ion-card:hover {    
    transform:scale(1.05);
    box-shadow: 0 3px 6px 6px rgba(0,0,0,.2), 
                0 2px 4px 0 rgba(0,0,0,.14), 
                0 1px 5px 0 rgba(0,0,0,.12)
  }
  ion-card-content {
    cursor: pointer;
  }
  /* ion-card-content {
    visibility: hidden;
    opacity: 0;  
    transition: visibility 0s linear 0.2s, opacity 0.2s linear;
  } */
  /* ion-card:hover ion-card-content {
    visibility: visible;
    opacity: 1;    
    transition-delay: 0s;
  } */
</style>