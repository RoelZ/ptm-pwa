<template>
  <div class="poster" :class="{ active: false }">
    <ion-card :color="posterItem.design" v-for="item in poster.line_items" :key="item.id">
      <ion-card-header class="ion-text-start">        
        <ion-chip :color="item.labelColor" :outline="!item.express">
          <ion-label>{{posterItem.id}}</ion-label>
        </ion-chip>
        <ion-chip outline>
          <ion-label>{{posterItem.size}}</ion-label>
        </ion-chip>
        <ion-chip outline>
          <ion-label>{{posterItem.country}}</ion-label>
        </ion-chip>
        <ion-chip class="ion-color ion-color-danger" v-if="posterItem.notes" @click="createModal()">
          <ion-icon name="mail-unread" class="ion-no-margin"></ion-icon>
        </ion-chip>
      </ion-card-header>

      <ion-card-content class="ion-text-center" @click="presentActionSheet(posterItem)">
          <ion-img :src="posterItem.lowres" class="ion-margin-horizontal"></ion-img>
          <div class="ion-margin-vertical">
            <ion-card-title>{{posterItem.moment}}</ion-card-title>
            <ion-card-subtitle>{{posterItem.subline}}</ion-card-subtitle>
            <ion-card-subtitle>{{posterItem.tagline}}</ion-card-subtitle>
            <!-- <ion-card-subtitle>{{iets}}</ion-card-subtitle> -->
          </div>
      </ion-card-content>
        
      <div class="card-overlay" v-if="loading">
        <ion-spinner name="dots"></ion-spinner>
      </div>
    </ion-card>
    <div style="display:none;position:absolute;top:0;bottom:0;left:0;right:0">
      {{zomaar}}
      <ion-checkbox></ion-checkbox>
    </div>
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
    lineItem: {
      type: Number,
      default: 0
    },
    poster: Object,
    zomaar: Boolean,
    shipping: Object
  },
  data (){
    return {      
      // id: this.poster.id,
      flipped: false,
      loading: false,
      iets: false
    }
  },
  created () {
    this.iets = this.zomaar
  },
  computed: {
    posterItem(){
      let express = RegExp('Express*').test(this.poster.shipping_lines[0].method_title);
      let size = (this.poster.line_items[this.lineItem].meta_data[0].value == '30x40') ? 'S' : 'L'

      // onderstaande gaat fout wanneer er een line_item mist (meta_data[7], meta_data[8], etc)
      // onderstaande mist meerder items in cart (line_items[this.lineItem])
      // (this.poster.line_items.length)

      let oldOrder = (this.poster.line_items[this.lineItem].meta_data[2].key == '_Place ID') ? 1 : 0;

      return {
        id: this.poster.id,
        size,
        design: this.poster.line_items[this.lineItem].meta_data[1].value,
        marker: this.poster.line_items[this.lineItem].meta_data[this.metaData(7, oldOrder)].value,
        moment: this.poster.line_items[this.lineItem].meta_data[this.metaData(8, oldOrder)].value,
        subline: this.poster.line_items[this.lineItem].meta_data[this.metaData(9, oldOrder)].value,
        tagline: this.poster.line_items[this.lineItem].meta_data[this.metaData(10, oldOrder)].value,
        lowres: this.poster.line_items[this.lineItem].meta_data[this.metaData(11, oldOrder)].value.substring(64, 9),
        highres: this.poster.line_items[this.lineItem].meta_data[this.metaData(12, oldOrder)].value.match(/"(.*?)"/gi)[0].slice(1,-1),
        hash: this.poster.cart_hash,
        language: this.poster.line_items[this.lineItem].meta_data[this.metaData(13, oldOrder)] ? this.poster.line_items[this.lineItem].meta_data[this.metaData(13, oldOrder)].value : 'nl',
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
    toggleSelected(){
      this.selected = !this.selected;
    },
    openToast(status, message, buttons){
      return this.$ionic.toastController
        .create({
          color: (status === 'failed') ? 'danger' : 'primary',
          message,
          // duration: buttons ? 0 : 2000,
          showCloseButton: buttons ? false : true,
          buttons
        })
        .then(t => t.present())
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
        .then(response => this.getAdobeStatus(response.data._links.self.href))
        .catch(error => this.openToast('failed', error.message));
    },
    async createPDF(poster){
      await this.$photoshop.post('/renditionCreate',this.adobeObject(poster))
        .then(response => this.getAdobeStatus(response.data._links.self.href,poster,true))
        .catch(error => this.openToast('failed', error.message));
    },
    async applyActions(poster){
      await this.$photoshop.post('/batchPlay',this.actionsObject(poster))
        .then(response => this.getAdobeStatus(response.data._links.self.href, poster))
        .catch(error => this.openToast('failed', error.message));
    },
    async getAdobeStatus(url, poster, actions = false){
      const msg = poster ? `Creating PTM-${poster.size}-${poster.id}-${this.designNumber(poster.design)}-${this.posterItem.country}-${this.posterItem.language}.psd <ion-spinner name="dots" style="vertical-align: middle"></ion-spinner>` : 'Generating high-resolution map  <ion-spinner name="dots" style="vertical-align: middle"></ion-spinner>';
      const getStatus = await this.$photoshop.get(url);
      getStatus.data.outputs.forEach(item => {
        if(item.status === 'running'){
          if(!this.loading){            
            this.loading = true
            this.openToast(item.status, msg);
          }
          setTimeout(() => {
            this.getAdobeStatus(url, poster, actions);
          }, 2000);
        } else if(item.status === 'pending'){
          if(!this.loading){            
            this.loading = true
            this.openToast(item.status, msg);
          }
          setTimeout(() => {
            this.getAdobeStatus(url);
          }, 2000);
        } else if(item.status === 'failed'){
          this.loading = false
          item.errors.details.forEach(error => this.presentAlert(item.errors.title, error.name, error.reason));
        }
        else if(item.status === 'succeeded'){
          if(actions){
            setTimeout(() => {
              this.applyActions(poster);
            },2500);
          } else {
            this.loading = false
            this.$ionic.toastController.dismiss();
          }
        }
      });
    },
    presentActionSheet(poster) {
      return this.$ionic.actionSheetController
        .create({
          header: 'Actions',
          buttons: [
            {
              text: 'Map poster klaarmaken',
              icon: 'cloudy',
              handler: () => {
                this.createMap(poster)
              },
            },
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
              text: 'Order details',
              icon: 'cube',
              handler: () => {
                this.$router.push(`/order/${poster.id}`)
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
      return (design === 'snow' || design === 'honey') ? this.rgb16('black')
           : (design === 'granite' || design === 'mint') ? this.rgb16('snow')
           : this.rgb16('granite')
    },
    designNumber(design){
      return (design === 'snow') ? 0 
           : (design === 'moon') ? 1 
           : (design === 'granite') ? 2 
           : (design === 'mint') ? 3 
           : 4
    },
    editMap(poster){
      console.log(poster.design)
      let suffix = '-'+String.fromCharCode(65 + this.lineItem);
      if(poster.size === 'L'){
        return {
          "id":281,
          "edit":{},
          "name": "MAP",
          "input":{
            "href":`/files/PTM/Maps/${poster.id}-${this.designNumber(poster.design)}${suffix}.png`,
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
        return {
          "id":590,
          "edit":{},
          "name": "MAP",
          "input":{
            "href":`/files/PTM/Maps/${poster.id}-${this.designNumber(poster.design)}${suffix}.png`,
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
        const heart =  
          {
            "id":792,
            "edit":{},
            "name": "HEART",
            "visible": (poster.marker == 'heart') ? true : false
          }
        const pin =
          {
            "id":749,
            "edit":{},
            "name": "PIN",
            "fill": {
              "solidColor": this.rgb(poster.marker)
            },
            "visible": (poster.marker == 'heart') ? false : true
          }
        return { heart, pin }
      } 
      else if(poster.size === 'S')
      {
        const heart =
          {
            "id":796,
            "edit":{},
            "name": "HEART",
            "visible": (poster.marker == 'heart') ? true : false
          }
        const pin =
          {
            "id":752,
            "edit":{},
            "name": "PIN",
            "fill": {
              "solidColor": this.rgb(poster.marker)
            },
            "visible": (poster.marker == 'heart') ? false : true
          }
        return { heart, pin }
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
            "href":`/files/PTM/Maps/${posterid}-${this.designNumber(this.posterItem.design)}-${String.fromCharCode(65 + this.lineItem)}.png`,
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
          "fonts": [
            {
              "storage": "adobe",
              "href": "/files/Fonts/Open_Sans/OpenSans-Light.ttf"
            },
            {
              "storage": "adobe",
              "href": "/files/Fonts/Open_Sans_Condensed/OpenSansCondensed-Light.ttf"
            }
          ],
          "layers":[
            this.editMap(poster),
            this.editPin(poster),
            {
              "id":247,
              "edit":{},        
              "name": "LANGUAGE",
              "text":{
                "content": poster.language,
                "characterStyles": [
                  { 
                    "fontColor": this.textColor(poster.design),
                    "fontName": "OpenSans-Light"
                  }
                ]
              },
            },
            {
              "id":228,
              "edit":{},        
              "name": "COUNTRY",
              "text":{
                "content": poster.country,
                "characterStyles": [
                  { 
                    "fontColor": this.textColor(poster.design),
                    "fontName": "OpenSans-Light"
                  }
                ]
              },
            },
            {
              "id":487,
              "edit":{},        
              "name": "SIZE",
              "text":{
                "content": poster.size,
                "characterStyles": [
                  { 
                    "fontColor": this.textColor(poster.design),
                    "fontName": "OpenSans-Light"
                  }
                ]
              },
            },
            {
              "id":248,
              "edit":{},        
              "name": "DESIGN",
              "text":{
                "content": this.designNumber(poster.design),
                "characterStyles": [
                  { 
                    "fontColor": this.textColor(poster.design),
                    "fontName": "OpenSans-Light"
                  }
                ]
              },
            },
            {
              "id":227,
              "edit":{},        
              "name": "ORDER ID",
              "text":{
                "content": poster.id,
                "characterStyles": [
                  { 
                    "fontColor": this.textColor(poster.design),
                    "fontName": "OpenSans-Light"
                  }
                ]
              },
            },
            {
              "id":226,
              "edit":{},        
              "name": "PREFIX",
              "text":{
                "content": "PTM",
                "characterStyles": [
                  { 
                    "fontColor": this.textColor(poster.design),
                    "fontName": "OpenSans-Light"
                  }
                ]
              },
            },
            {
              "id":249,
              "edit":{},        
              "name": "FORMAT",
              "text":{
                "content": "-   -         -  -     -",
                "characterStyles": [
                  { 
                    "fontColor": this.textColor(poster.design),
                    "fontName": "OpenSans-Light"
                  }
                ]
              },
            },
            {
              "id":225,
              "edit":{},
              "name": "TITLE",
              "text":{
                "content": poster.moment.toUpperCase(),
                "characterStyles": [
                  { 
                    "fontColor": this.textColor(poster.design),
                    "fontName": "OpenSansCondensed-Light"
                  }
                ]
              },
            },
            {
              "id":224,
              "edit":{},
              "name": "SUBLINE",
              "text":{
                "content": poster.subline,
                "characterStyles": [
                  { 
                    "fontColor": this.textColor(poster.design),
                    "fontName":"OpenSans-Light"
                  }
                ]
              },
            },
            {
              "id":223,
              "edit":{},        
              "name": "TAGLINE",
              "text":{
                "content":  poster.tagline,
                "characterStyles": [
                  { 
                    "fontColor": this.textColor(poster.design),
                    "fontName":"OpenSans-Light" 
                  }
                ]
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
          // {
          //   "href":`/files/PTM/Templates/outputs/PTM-${poster.size}-${poster.id}-${this.designNumber(poster.design)}-${this.posterItem.country}-${this.posterItem.language}.jpg`,
          //   "storage":"adobe",
          //   "type":"image/jpeg",
          //   "width":0,
          //   "overwrite":true,
          //   "quality":3
          // },
          {
            "href":`/files/PTM/Templates/outputs/PTM-${poster.size}-${poster.id}-${this.designNumber(poster.design)}-${this.posterItem.country}-${this.posterItem.language}.psd`,
            "storage":"adobe",
            "type":"vnd.adobe.photoshop",
            "overwrite":true
          }
        ]
      }
    },
    actionsObject(poster){
      return {
        "inputs": [
          {
            "href": `/files/PTM/Templates/outputs/PTM-${poster.size}-${poster.id}-${this.designNumber(poster.design)}-${this.posterItem.country}-${this.posterItem.language}.psd`,
            "storage": "adobe"
          }
        ],
        "options": {
          "actions": [
            {
              "href": `/files/actions/PTM-${poster.size}.atn`,
              "storage": "adobe"
            }
          ]
        },
        "outputs": [
          {
              "storage":"adobe",
              "type":"vnd.adobe.photoshop",
              "overwrite":true,
              "href": `/files/PTM/Templates/outputs/PTM-${poster.size}-${poster.id}-${this.designNumber(poster.design)}-${this.posterItem.country}-${this.posterItem.language}.psd`
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
  .poster {
    position:relative;
    display:flex;
    height:100%;
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
  div.active {
    background: rgba(221,221,221,.5);
  }
  div.active ion-card {
    transform: scale(.95);
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