<template>
  <div>
    <ion-card class="ion-padding" :color="posterItem.design" v-for="item in poster.line_items" :key="item.id">
      <ion-chip :color="posterItem.labelColor" :outline="!posterItem.express">
        <ion-label>{{poster.id}}{{posterItem.length}}</ion-label>
      </ion-chip>
      <ion-chip outline>
        <ion-label>{{posterItem.size}}</ion-label>
      </ion-chip>
      <ion-chip outline>
        <ion-label>{{posterItem.country}}</ion-label>
      </ion-chip>
      <ion-img :src="posterItem.lowres" class="ion-margin-top"></ion-img>
      <ion-card-header class="ion-text-center">
        <ion-card-title>{{posterItem.moment}}</ion-card-title>
        <ion-card-subtitle>{{posterItem.subline}}</ion-card-subtitle>
        <ion-card-subtitle>{{posterItem.tagline}}</ion-card-subtitle>
      </ion-card-header>

      <ion-card-content class="ion-no-padding">
        <ion-button size="small" v-on:click="posterImage(posterItem)">Image</ion-button>
        <ion-button size="small">Notes</ion-button>
        <ion-button size="small" v-on:click="createPDF(posterItem)">PSD</ion-button>
      </ion-card-content>
    </ion-card>
  </div>
</template>

<style>

</style>

<script>

export default {
  name: 'PosterCard',
  props: {
    poster: Object
  },
  data (){
    return {      
      id: this.poster.id,
      showFront: true
    }
  },
  computed: {
    posterItem(){
      let express = RegExp('Express*').test(this.poster.shipping_lines[0].method_title);
      let size = (this.poster.line_items[0].meta_data[0].value == '30x40') ? 'S' : 'L'

      // onderstaande gaat fout wanneer er een line_item mist (meta_data[7], meta_data[8], etc)
      // onderstaande mist meerder items in cart (line_items[0])

      return {
        size,
        design: this.poster.line_items[0].meta_data[1].value,
        moment: this.poster.line_items[0].meta_data[8].value,
        subline: this.poster.line_items[0].meta_data[9].value,
        tagline: this.poster.line_items[0].meta_data[10].value,
        lowres: this.poster.line_items[0].meta_data[11].value.substring(64, 9),
        highres: this.poster.line_items[0].meta_data[12].value.match(/"(.*?)"/gi)[0].slice(1,-1),
        hash: this.poster.cart_hash,
        language: this.poster.line_items[0].meta_data[13] ? this.poster.line_items[0].meta_data[13].value : 'nl',
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
    posterImage(poster){
      fetch(poster.highres)
        .then(resp => resp.blob())
        .then(blob => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.style.display = 'none';
          a.href = url;
          a.download = this.id+'.png';
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
        })
        .catch(() => alert('Probleem bij het ophalen..')); 
    },
    createPDF(poster){    
      this.$photoshop.post('/renditionCreate',this.adobeObject(poster))
      .then(response => console.log('PSD good' + response))
      .catch(error => console.log('error', error))
      .finally(console.log('PSD done'))      
    },
    textColor(design) {
      return (design === 'snow' || design === 'honey') ? { "rgb": { "blue": 0, "green": 0, "red": 0 } }
           : (design === 'granite' || design === 'mint') ? { "rgb": { "blue": 32768, "green": 32768, "red": 32768 } }
           : { "rgb": { "blue": 11822, "green": 11180, "red": 10794 } }
    },
    designNumber(design){
      return (design === 'snow') ? 0 
           : (design === 'moon') ? 1 
           : (design === 'granite') ? 2 
           : (design === 'mint') ? 3 
           : 4
    },
    adobeObject(poster){
      let snow = (poster.design === 'snow') ? true : false
      let moon = (this.poster.design === 'moon') ? true : false
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
            {
              "edit":{},        
              "name": "Pin",              
              "id":14
            },
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
                "content": this.id,
                "characterStyles": [{ "fontColor": this.textColor(poster.design) }]
              },
            },
            {
              "id":226,
              "edit":{},        
              "name": "PREFIX",
              "text":{
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
            "href":`/files/PTM/Templates/outputs/PTM-${poster.size}-${this.id}-${this.designNumber(poster.design)}-${poster.country}-${poster.language}.jpg`,
            "storage":"adobe",
            "type":"image/jpeg",
            "width":0,
            "overwrite":true,
            "quality":3
          }
        ]
      }
    }
  }
}
</script>

<style scoped>

  .flip-card {
    background-color: transparent;
    width: 300px;
    height: 300px;
    perspective: 1000px;
  }
  .card-front, .card-back {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
  }
  .card-back, .flip {
    transform: rotateY(180deg);
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
    top:20;
    left:20;
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
    visibility: hidden;
    opacity: 0;  
    transition: visibility 0s linear 0.2s, opacity 0.2s linear;
  }
  ion-card:hover ion-card-content {
    visibility: visible;
    opacity: 1;    
    transition-delay: 0s;
  }
</style>