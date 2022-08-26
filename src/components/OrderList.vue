<template>
<div>
  <ion-header translucent>
    <ion-toolbar>
      <ion-title>Orderlist</ion-title>
      <ion-buttons slot="end">
        <ion-button @click="dismissModal()">Close</ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <ion-content fullscreen>
    <ion-list>
      <ion-item v-for="order in orders" :key="order.id">
        <ion-label>
          <h2>{{order.id}}</h2>
          <div v-for="(item, index) in order.line_items" :key="item.id">            
            <h3 v-if="(item.sku == 1015 || item.sku == 1019)">
              {{index + 1}}. PTM-{{posterItem(item).size}}-{{order.id}}-{{posterItem(item).design}}-{{order.shipping.country}}-{{posterItem(item).language}}
            </h3>
            <h3 v-else>
              {{index + 1}}. {{frameItem(item)}}
            </h3>
          </div>
        </ion-label>
      </ion-item>
  </ion-list>
  
  <div class="card-overlay" v-if="isLoading">
    Retrieving orders &nbsp;
    <ion-spinner name="dots"></ion-spinner>
  </div>

  </ion-content>
  <ion-footer>
    <ion-item detail="false">
      <ion-button fill="clear" size="large" slot="end" @click="downloadList()">
        <ion-icon color="tertiary" name="download" slot="icon-only"></ion-icon>
      </ion-button>
  </ion-item>
    
  </ion-footer>
  </div>
</template>

<script>
import { addIcons } from "ionicons";
import { download } from "ionicons/icons";
import textToImage from "text-to-image";

addIcons({
  "md-download": download.md,
  "ios-download": download.ios,
});

export default {
  name: 'OrderComments',  
  data(){
    return {
      isLoading: true,
      orders: Array,
    }
  },
  computed: { 
    ordersToText(){
      let textString = '';
      this.orders.forEach(order => {
        textString += `${order.id}\n`;
        order.line_items.forEach((item, index) => {
          console.log(item.sku)
          index++;
          if(item.sku == 1015 || item.sku == 1019)
            textString += `${index}. PTM-${this.posterItem(item).size}-${order.id}-${this.posterItem(item).design}-${order.shipping.country}-${this.posterItem(item).language}\n`;
          else
            textString += `${index}. ${this.frameItem(item)}\n`;
        });
        textString += '\n';
      });
      return textString;
    }
  },
  created() {
    this.$woocommerce.get(`orders?status=processing&per_page=50` )
    .then(response => this.orders = response.data)
    .catch(error => console.log('error', error))
    .finally(() => this.isLoading = false)

    // if (this.$gapi.isAuthenticated() !== true) {
    //   this.$gapi.login()
    // }
    
  },
  methods: {
    posterItem(item){
      if(item.sku == 1019){
        return {
          design: (item.meta_data[0].value === 'moon') ? 0 
              : (item.meta_data[0].value === 'granite') ? 1 
              : (item.meta_data[0].value === 'olve') ? 2 
              : (item.meta_data[0].value === 'hay') ? 3 
              : (item.meta_data[0].value === 'redwood') ? 4
              : (item.meta_data[0].value === 'dustyrose') ? 5
              : 6,
          size: (item.meta_data[1].value == '30x40cm') ? 'S' : 'L',
          language: item.meta_data[9].value,
        }
      } 
      return {
        design: (item.meta_data[0].value === 'snow') ? 0 
              : (item.meta_data[0].value === 'moon') ? 1 
              : (item.meta_data[0].value === 'granite') ? 2 
              : (item.meta_data[0].value === 'mint') ? 3 
              : 4,
        size: (item.meta_data[1].value == '30x40cm') ? 'S' : 'L',
        language: item.meta_data[12].value,
      }
    },
    frameItem(item){
      return (item.variation_id === 12686 || item.variation_id === 14710) ? 'HOS'
            : (item.variation_id === 12687 || item.variation_id === 14711) ? 'HOL'
            : (item.variation_id === 12688 || item.variation_id === 14712) ? 'HBS'
            : (item.variation_id === 12689 || item.variation_id === 14713) ? 'HBL'
            : (item.variation_id === 12694 || item.variation_id === 14701) ? 'FOS'
            : (item.variation_id === 12695 || item.variation_id === 14703) ? 'FOL'
            : (item.variation_id === 12696 || item.variation_id === 14704) ? 'FBS'
            : (item.variation_id === 12697 || item.variation_id === 14702) ? 'FBL'
            : 'fout'
    },
    downloadList(){
      console.log(this.ordersToText);
      textToImage.generate(this.ordersToText).then(function (dataUri) {
        // console.log(dataUri);
        // window.open(dataUri);
        // console.log(dataUri);
        // const url = window.URL.createObjectURL(dataUri);
          const a = document.createElement('a');
          const date = new Date();
          a.style.display = 'none';
          a.href = dataUri;
          a.download = `Overzicht - ${date.getDate()}-${date.getMonth()}-${date.getFullYear()}.png`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(dataUri);
      });
    },
    dismissModal() {
      this.$ionic.modalController.dismiss();
    }
  }
}
</script>

<style scoped>
  h2 {
    font-weight:600;
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
</style>