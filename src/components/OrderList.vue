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
            <h3 v-if="item.sku == 1015">
              {{index}}. PTM-{{posterItem(item).size}}-{{order.id}}-{{posterItem(item).design}}-{{order.shipping.country}}-{{posterItem(item).language}}
            </h3>
            <h3 v-else>
              {{index}}. {{frameItem(item)}}
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
          index++;
          if(item.sku == 1015)
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
      return {
        design: (item.meta_data[0].value === 'snow') ? 0 
              : (item.meta_data[0].value === 'moon') ? 1 
              : (item.meta_data[0].value === 'granite') ? 2 
              : (item.meta_data[0].value === 'mint') ? 3 
              : 4,
        size: (item.meta_data[1].value == '30x40') ? 'S' : 'L',
        language: item.meta_data[(item.meta_data[2].key == '_Place ID') ? 12 : 13].value,
      }
    },
    frameItem(item){
      return (item.variation_id === 9772 || item.variation_id === 9630) ? 'HOS'
            : (item.variation_id === 9773 || item.variation_id === 9631) ? 'HOL'
            : (item.variation_id === 9774 || item.variation_id === 9632) ? 'HBS'
            : (item.variation_id === 9775 || item.variation_id === 9633) ? 'HBL'
            : (item.variation_id === 9777 || item.variation_id === 9626) ? 'FOS'
            : (item.variation_id === 9778 || item.variation_id === 9627) ? 'FOL'
            : (item.variation_id === 9779 || item.variation_id === 9628) ? 'FBS'
            : (item.variation_id === 9780 || item.variation_id === 9629) ? 'FBL'
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