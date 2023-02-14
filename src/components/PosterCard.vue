<template>
  <div class="poster" :class="{ active: iets }">
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
          </div>
      </ion-card-content>
        
      <div class="card-overlay" v-if="loading">
        <ion-spinner name="dots"></ion-spinner>
      </div>
    </ion-card>
    <div style="display:none;position:absolute;top:0;bottom:0;left:0;right:0">
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
import poster from '../mixins/poster';
import { Dropbox } from 'dropbox';
import dropboxConfig from '../config/dropbox';


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
    sku: String,
    zomaar: Boolean,
    shipping: Object
  },
  inject: ['fileUrls'],
  data (){
    return {      
      // id: this.poster.id,
      flipped: false,
      loading: false,
      iets: false,
      dropbox: null,
      posterFile: '',
      mapFile: '',
      uploadLink: ''
    }
  },
  created () {
    this.iets = this.zomaar
  },
  watch: {
    zomaar(){
      this.iets = this.zomaar
    }
  },
  computed: {
    posterItem(){
      let express = RegExp('Express*').test(this.poster.shipping_lines[0].method_title);
      let size = (this.poster.line_items[this.lineItem].meta_data[1].value == '30x40cm') ? 'S' : 'L'

      // onderstaande gaat fout wanneer er een line_item mist (meta_data[7], meta_data[8], etc)
      // onderstaande mist meerder items in cart (line_items[this.lineItem])
      // (this.poster.line_items.length)

      // let oldOrder = (this.poster.line_items[this.lineItem].meta_data[2].key == '_Place ID') ? 1 : 0;

      // "<a href=\"https://tiles.placethemoment.com/styles/granite/static/5.4083633422852,51.419763826697,5.5051803588867,51.480100013662/1024x1024@4x.png?path=5.460205078125,51.44820343847695|5.460205078125,51.449203438477&stroke=rgb(255,0,255)&witdh=1\">Print poster</a>"
      if(this.sku === "1019"){
        return {
          id: this.poster.id,
          size,
          design: this.poster.line_items[this.lineItem].meta_data[0].value,
          // marker: this.poster.line_items[this.lineItem].meta_data[6].value,
          moment: this.poster.line_items[this.lineItem].meta_data[5].value,
          subline: this.poster.line_items[this.lineItem].meta_data[6].value,
          tagline: this.poster.line_items[this.lineItem].meta_data[7].value,
          lowres: this.poster.line_items[this.lineItem].meta_data[8].value,
          // highres: this.poster.line_items[this.lineItem].meta_data[11].value.match(/"(.*?)"/gi)[0].slice(1,-1),
          hash: this.poster.cart_hash,
          language: this.poster.line_items[this.lineItem].meta_data[9].value,
          country: this.poster.shipping.country,
          length: (this.poster.line_items.length > 1) ? '+' : '',
          shipping: this.poster.shipping_lines[0].method_title,
          express,
          labelColor: express ? 'danger' : '',        
          notes: this.poster.customer_note
        }
      }

      return {
        id: this.poster.id,
        size,
        design: this.poster.line_items[this.lineItem].meta_data[0].value,
        marker: this.poster.line_items[this.lineItem].meta_data[7].value,
        moment: this.poster.line_items[this.lineItem].meta_data[8].value,
        subline: this.poster.line_items[this.lineItem].meta_data[9].value,
        tagline: this.poster.line_items[this.lineItem].meta_data[10].value,
        lowres: this.poster.line_items[this.lineItem].meta_data[11].value,
        // highres: this.poster.line_items[this.lineItem].meta_data[12].value.match(/"(.*?)"/gi)[0].slice(1,-1),
        highres: this.poster.line_items[this.lineItem].meta_data[12].value,
        hash: this.poster.cart_hash,
        language: this.poster.line_items[this.lineItem].meta_data[13].value,
        country: this.poster.shipping.country,
        length: (this.poster.line_items.length > 1) ? '+' : '',
        shipping: this.poster.shipping_lines[0].method_title,
        express,
        labelColor: express ? 'danger' : '',        
        notes: this.poster.customer_note
      }
    },
    lineItemLabel(){
      return this.lineItem ? String.fromCharCode(65 + this.lineItem) : ''
    },
    extractNumber(){
      let addressArray = []
      addressArray = this.poster.shipping.address_1.split(/(\d+)/g);
      // let addressArray = this.poster.shipping.address_1.split(/(\d+)/g);
      if(addressArray[1])
        return addressArray[1]
      else {
        return this.poster.shipping.address_2.split(/(\d+)/g)[1];
      }
    },
    getShipmentID(){
      // 1: Thuisbezorgd / Home delivery (NL)
      // 3: Home delivery (RU)
      // 7: Thuisbezorgd / Home delivery (BE, DE)
      // 12: DHL ophaalpunt / DHL Servicepoint (NL)
      // 14: DHL ophaalpunt Express (NL)
      // 17: Thuisbezorgd Express (BE)
      // 18: DHL ophaalpunt (BE)
      switch(this.poster.shipping_lines[0].instance_id){
        case 1:
          return 9;
        case 3:
          return 359; //false!
        case 7:
          return 9;
        case 12:
          return 115;
        case 14:
          return 115;
        case 17:
          return 9;
        case 18:
          return 115;
        case 27:
          return 359;
        default:
          return 9;
      }
    }
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
    getDropbox() {
      this.dropbox = new Dropbox(dropboxConfig);
    },
    createMap(poster, split){
      this.getDropbox();

      const posterurl = split ? split : poster.highres;
      
      this.dropbox.filesGetTemporaryUploadLink({
          'commit_info': {
            path: `/maps/${poster.id}-${this.designNumber(poster.design)}${this.lineItemLabel}.png`,
            "mode": {
              ".tag": "overwrite"
            },
            autorename: false
          }
      }).then(({ result }) => {
        this.$photoshop.post('/renditionCreate',this.mapObject(posterurl, result.link))
        .then(response => this.getAdobeStatus(response.data._links.self.href))
        .catch(error => {
          this.openToast('failed', error.message, [{ side: 'start', text: 'Retry', handler: () => this.createMap(poster, poster.highres.split('?',1))}, { side: 'end', text: 'Close', handler: () => this.dismiss }])
        });
      })
      .catch(error => {
        console.error(error);
        this.openToast('failed', error.error_summary, [{ side: 'end', text: 'Close', handler: () => this.dismiss }])
      });
    },
    async createPDF(poster){
      this.getDropbox();
      this.dropbox.filesGetTemporaryUploadLink({
          'commit_info': {
            path: `/outputs/PTM-${poster.size}-${poster.id}-${this.designNumber(poster.design)}${this.lineItemLabel}-${poster.country}-${poster.language}.psd`,
            "mode": {
              ".tag": "overwrite"
            },
            autorename: false
          }
      }).then(({ result }) => {
        this.uploadLink = result.link;
        this.$photoshop.post('/text',this.adobeTextObject(poster))
        .then(response => this.getAdobeStatus(response.data._links.self.href, poster, 'layers'))
        .catch(error => this.openToast('failed', error.message));
      })
    },
    async applyLayerChanges(poster){
      this.getDropbox();
      this.dropbox.filesGetTemporaryLink({ path: `/outputs/PTM-${poster.size}-${poster.id}-${this.designNumber(poster.design)}${this.lineItemLabel}-${poster.country}-${poster.language}.psd` })
      .then(({ result }) => {
        this.posterFile = result.link;

        this.dropbox.filesGetTemporaryLink({ path: `/maps/${poster.id}-${this.designNumber(poster.design)}${this.lineItemLabel}.png` })
        .then(({ result }) => {
          this.mapFile = result.link

          this.getDropbox();
          this.dropbox.filesGetTemporaryUploadLink({
              'commit_info': {
                path: `/outputs/PTM-${poster.size}-${poster.id}-${this.designNumber(poster.design)}${this.lineItemLabel}-${poster.country}-${poster.language}.psd`,
                "mode": {
                  ".tag": "overwrite"
                },
                autorename: false
              }
          }).then(({ result }) => {
            this.uploadLink = result.link;
            this.$photoshop.post('/documentOperations',this.adobeAdjustLayersObject(poster))
              .then(response => this.getAdobeStatus(response.data._links.self.href, poster, (this.sku !== "1091") ? 'markers' : null))
              .catch(error => this.openToast('failed', error.message));
          })
        })
      })
    },
    async applyActions(poster){
      this.getDropbox();
      this.dropbox.filesGetTemporaryLink({ path: `/outputs/PTM-${poster.size}-${poster.id}-${this.designNumber(poster.design)}${this.lineItemLabel}-${poster.country}-${poster.language}.psd` })
      .then(({ result }) => {
        this.posterFile = result.link;

        this.dropbox.filesGetTemporaryUploadLink({
            'commit_info': {
              path: `/outputs/PTM-${poster.size}-${poster.id}-${this.designNumber(poster.design)}${this.lineItemLabel}-${poster.country}-${poster.language}.psd`,
              "mode": {
                ".tag": "overwrite"
              },
              autorename: false
            }
        }).then(({ result }) => {
          this.uploadLink = result.link;
          this.$photoshop.post('/batchPlay',this.adobeActionsObject(poster))
            .then(response => this.getAdobeStatus(response.data._links.self.href, poster))
            .catch(error => this.openToast('failed', error.message));
        })
      })
    },
    async getAdobeStatus(url, poster, next){
      const msg = poster ? `Creating PTM-${poster.size}-${poster.id}-${this.designNumber(poster.design)}${this.lineItemLabel}-${this.posterItem.country}-${this.posterItem.language}.psd <ion-spinner name="dots" style="vertical-align: middle"></ion-spinner>` : 'Generating high-resolution map  <ion-spinner name="dots" style="vertical-align: middle"></ion-spinner>';
      const getStatus = await this.$photoshop.get(url);
      getStatus.data.outputs.forEach(item => {
        if(item.status === 'running'){
          if(!this.loading){            
            this.loading = true
            this.openToast(item.status, msg);
          }
          setTimeout(() => {
            this.getAdobeStatus(url, poster, next);
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
          this.$ionic.toastController.dismiss();
          this.openToast(item.status, `${item.errors.code}: ${item.errors.title}`)
          // item.errors.details.forEach(error => this.presentAlert(item.errors.title, error.name, error.reason));
        }
        else if(item.status === 'succeeded'){
          // setTimeout(() => {
          //   this.applyLayerChanges(poster);
          // },2500);

          if(next === "layers"){
            setTimeout(() => {
              this.applyLayerChanges(poster);
              // this.applyActions(poster);
            },2500);
          } else if(next === "markers"){
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
      // const parcel_obj = await this.$sendcloud.get(`/parcels/?order_number=${poster.id}`);
      
      // if(parcel_obj.data.parcels.length){
      //   parcel_obj.data.parcels.forEach(parcel => {
      //     this.$sendcloud.get(`/parcels/${parcel.id}/documents/label`, { responseType: 'blob' })
      //       .then(response => {
      //         let blob = new Blob([response.data], { type: 'application/pdf' });
      //         let link = document.createElement('a')
      //         link.href = window.URL.createObjectURL(blob)
      //         link.download = 'verzendlabel.pdf'
      //         link.click();
      //       })
      //   })
      // } else {
        console.log(poster);
        this.$sendcloud.post(`/parcels`, this.sendcloudObject())
          .then(res => {
            this.$sendcloud.get(`/parcels/${res.data.parcel.id}/documents/label`, { responseType: 'blob' })
              .then(response => {
                let blob = new Blob([response.data], { type: 'application/pdf' });
                let link = document.createElement('a')
                link.href = window.URL.createObjectURL(blob)
                link.download = `${poster.id}-${this.designNumber(poster.design)}${this.lineItemLabel}.pdf` //'verzendlabel.pdf'
                link.click();
              })
          });
      // }
      
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
      return (color === 'granite') ? { "rgb": { "blue": 11822, "green": 11180, "red": 10794 } }
           : (color === 'mint') ? { "rgb": { "blue": 14264, "green": 20689, "red": 17605 } }
           : (color === 'snow') ? { "rgb": { "blue": 32768, "green": 32768, "red": 32768 } }
           : (color === 'black') ? { "rgb": { "blue": 0, "green": 0, "red": 0 } }
           : { "rgb": { "blue": 27756, "green": 22359, "red": 8995 } }    
    },
    rgb(color){
      return (color === 'granite') ? { "rgb": { "blue": 92, "green": 87, "red": 84 } }
           : (color === 'mint') ? { "rgb": { "blue": 137, "green": 161, "red": 111 } }
           : (color === 'olive') ? { "rgb": { "blue": 111, "green": 136, "red": 146 } }
           : (color === 'redwood') ? { "rgb": { "blue": 62, "green": 82, "red": 163 } }
           : (color === 'dustyrose') ? { "rgb": { "blue": 130, "green": 135, "red": 176 } }
           : (color === 'snow') ? { "rgb": { "blue": 255, "green": 255, "red": 255 } }
           : (color === 'black') ? { "rgb": { "blue": 0, "green": 0, "red": 0 } }
           : { "rgb": { "blue": 70, "green": 174, "red": 216 } }    
    },
    textColor(design) {
      return (design === 'snow' || design === 'honey' || design === 'hay') ? this.adobeColor('black')
           : (design === 'granite' || design === 'mint') ? this.adobeColor('snow')
           : (design === 'olive') ? this.adobeColor('olive')
           : (design === 'redwood') ? this.adobeColor('redwood')
           : (design === 'dustyrose') ? this.adobeColor('dustyrose')
           : this.adobeColor('granite')
    },
    adobeColor(color) {
      return (color === 'granite') ? { "blue": 92, "green": 87, "red": 84 }
           : (color === 'mint') ? { "blue": 137, "green": 161, "red": 111 }
           : (color === 'olive') ? { "blue": 111, "green": 136, "red": 146 }
           : (color === 'redwood') ? { "blue": 62, "green": 82, "red": 163 }
           : (color === 'dustyrose') ? { "blue": 130, "green": 135, "red": 176 }
           : (color === 'snow') ? { "blue": 255, "green": 255, "red": 255 }
           : (color === 'black') ? { "blue": 0, "green": 0, "red": 0 }
           : { "blue": 70, "green": 174, "red": 216 }
    },
    designNumber(design){
      if(poster.sku == "1019"){
        return  (design === 'moon') ? 0 
              : (design === 'granite') ? 1 
              : (design === 'olive') ? 2 
              : (design === 'hay') ? 3 
              : (design === 'redwood') ? 4
              : 5
      }
      return (design === 'snow') ? 0 
           : (design === 'moon') ? 1 
           : (design === 'granite') ? 2 
           : (design === 'mint') ? 3 
           : 4
    },
    editMap(poster){
      return {
        "id": (poster.size === 'L') ? 835 : 823,
        "edit":{},
        "index": 14,
        "locked":false,
        "type": "smartObject",
        "name": "MAP",
        "visible": true,
        "input":{
          "href": (this.sku == "1019") ? 'https://www.placethemoment.com/highres/celestial.png' : this.mapFile,
          "storage":"dropbox"
        },
        "smartObject" : {                
          "type" : "image/png"
        },
        "attributes":{
          "bounds":{
            "height": (poster.size === 'L') ? 4729 : 2880,
            "left": (poster.size === 'L') ? 662 : 404,
            "top": (poster.size === 'L') ? 945 : 523,
            "width": (poster.size === 'L') ? 4727 : 2880
          },
        },
      }
    },
    editPin(marker, size){
      if(this.sku == "1019"){
        return {
          "id": (size === 'L') ? 792 : 796,
          "edit":{},
          "name": "HEART",
          "visible": false
        }
      }

      if(marker === 'heart'){
        return {
          "id": (size === 'L') ? 792 : 796,
          "edit":{},
          "name": "HEART",
          "visible": true
        }
      } else {
        return {
          "id": (size === 'L') ? 749 : 752,
          "edit":{},
          "name": "PIN",
          "visible": true,
          "fill": {
            "solidColor": this.rgb(marker)
          },
        }
      }
    },
    mapObject(posterurl, uploadlink){
        return {
          "inputs": [
            {
              "href": posterurl,
              "storage": "external"
            }
          ],
          "outputs":[
            {
              "href":uploadlink,
              "storage":"dropbox",
              "type":"image/png",
              "width":0,
              "overwrite":true,
              "compression":"small"
            }
          ]
        };
    },
    sendcloudObject(){
      return {
        "parcel": {
          "name": this.poster.shipping.first_name + ' ' + this.poster.shipping.last_name,
          "company_name": this.poster.shipping.company,
          "address": this.poster.shipping.address_1,
          "house_number": this.extractNumber,
          "city": this.poster.shipping.city,
          "postal_code": this.poster.shipping.postcode,
          // "telephone": poster.billing.phone,
          "request_label": true,
          // "email": poster.billing.email,
          "country": this.poster.shipping.country,
          "shipment": {
            "id": this.getShipmentID
          },
          "order_number": this.poster.id,
        }
      }
    },
    adobeTextObject(poster){
          return {
            "inputs": [
              {
                "href": this.fileUrls.templates[poster.size],
                "storage": "dropbox"
              }
            ],
            "options":{
              "fonts": [
                {
                  "href": 'https://www.placethemoment.com/fonts/OpenSans-Light.ttf',
                  "storage": "external",
                },
                {
                  "href": 'https://www.placethemoment.com/fonts/OpenSans-CondensedLight.ttf',
                  "storage": "external",
                }
              ],
              "layers":[
                // this.editMap(poster),
                // this.editPin(poster.marker, poster.size),
                {
                  // "id":225,
                  // "edit":{},
                  "name": "TITLE",
                  "text":{
                    "antiAlias": "antiAliasSharp",
                    "content": poster.moment,
                    "characterStyles": [
                      { 
                        "color": this.textColor(poster.design),
                        "fontPostScriptName": "OpenSansCondensed-Light",
                        "fontCaps": "allCaps",
                        "tracking": 100,
                      }
                    ],
                    "paragraphStyles": [{
                      "align": "center"
                    }]
                  },
                },
                {
                  // "id":226,
                  // "edit":{},        
                  "name": "LABEL",
                  "text":{
                    "content": `PTM-${poster.size}-${poster.id}-${this.designNumber(poster.design)}${this.lineItemLabel}-${poster.country.toUpperCase()}-${poster.language}`,
                    "characterStyles": [
                      { 
                        "color": this.textColor(poster.design),
                        "fontPostScriptName": "OpenSans-Light"
                      }
                    ]
                  },
                },
                
                {
                  // "id":224,
                  // "edit":{},
                  "name": "SUBLINE",
                  "text":{
                    "content": poster.subline,
                    "characterStyles": [
                      { 
                        "color": this.textColor(poster.design),
                        "fontPostScriptName":"OpenSans-Light",
                      }
                    ]
                  },
                },
                {
                  // "id":223,
                  // "edit":{},        
                  "name": "TAGLINE",
                  "text":{
                    "content":  poster.tagline,
                    "characterStyles": [
                      { 
                        "color": this.textColor(poster.design),
                        "fontPostScriptName":"OpenSans-Light" 
                      }
                    ]
                  },
                }
              ]
            },
            "outputs":[
              {
                "href": this.uploadLink,
                "storage":"dropbox",
                "type":"vnd.adobe.photoshop",
                "overwrite":true
              }
            ]
          }
    },
    adobeAdjustLayersObject(poster){
      let snow = (poster.design === 'snow') ? true : false
      let moon = (poster.design === 'moon') ? true : false
      let granite = (poster.design === 'granite') ? true : false
      let mint = (poster.design === 'mint') ? true : false
      let honey = (poster.design === 'honey') ? true : false
      let olive = (poster.design === 'olive') ? true : false
      let hay = (poster.design === 'hay') ? true : false
      let redwood = (poster.design === 'redwood') ? true : false
      let dustyrose = (poster.design === 'dustyrose') ? true : false

      return {
        "inputs": [
          {
            "href": this.posterFile,
            "storage": "dropbox"
          }
        ],
        "options":{
          "layers":[
            this.editMap(poster),
            this.editPin(poster.marker, poster.size),
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
              "visible": (snow || honey || hay) ? true : false
            },
            {
              "id":33,
              "edit":{},        
              "name": "GRANITE LINE",
              "visible": moon
            },
            {
              "id": (poster.size === 'L') ? 819 : 817,
              "edit":{},        
              "name": "OLIVE LINE",
              "visible": olive
            },
            {
              "id": (poster.size === 'L') ? 818 : 816,
              "edit":{},        
              "name": "REDWOOD LINE",
              "visible": redwood
            },
            {
              "id": (poster.size === 'L') ? 817 : 815,
              "edit":{},        
              "name": "DUSTYROSE LINE",
              "visible": dustyrose
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
            {
              "id": (poster.size === 'L') ? 816 : 818,
              "edit":{},        
              "name": "KABANA BG",
              "visible": this.sku == "1019"
            }
            ]
        },
        "outputs":[
          {
            "href":this.uploadLink,
            "storage":"dropbox",
            "type":"vnd.adobe.photoshop",
            "overwrite":true
          }
        ]
      }
    },
    adobeActionsObject(){
      return {
        "inputs": [
          {
            "href": this.posterFile,
            "storage": "dropbox"
          }
        ],
        "options": {
          "actions": [
            {
              "href": "https://www.placethemoment.com/actions/PTM-Markers.atn",
              "storage": "external"
            }
          ]
        },
        "outputs": [
          {
              "href": this.uploadLink,
              "storage":"dropbox",
              "type":"vnd.adobe.photoshop",
              "overwrite":true,
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
  ion-img
  {
    object-fit: cover;
    aspect-ratio: 1/1;
    border-radius: 50%;
    overflow:hidden;
  }
  ion-card.ion-color-cotton ion-img,
  ion-card.ion-color-ocean ion-img,
  ion-card.ion-color-mauve ion-img
  {
    border-radius:0 !important;
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
    opacity:.75;
    pointer-events:none;
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