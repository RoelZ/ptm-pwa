<template>
    <ion-page >
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/orders"></ion-back-button>
        </ion-buttons>
        <ion-title>Order details</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content v-if="poster.orderData">
      <ion-list>
        <ion-item>
          <ion-label class="ion-text-wrap">
            <h1>{{ poster.orderData.id }}</h1>
            <p>{{displayCreatedDate}}</p>
          </ion-label>
          <ion-badge color="success" slot="end">
            {{displayDaysPast}}
          </ion-badge>
        </ion-item>
        <ion-item>
          <ion-label class="ion-text-wrap">
            <h1>Customer &amp; shipping details</h1>            
          </ion-label>
          <ion-badge color="warning" slot="end">
            {{poster.orderData.shipping_lines[0].method_title}}
          </ion-badge>
        </ion-item>
        <ion-item>
          <ion-label class="ion-text-wrap">
            <ion-text>
              {{poster.orderData.shipping.first_name}} {{poster.orderData.shipping.last_name}}
            </ion-text>
            <ion-chip v-if="poster.orderData.billing.phone" outline color="success" v-on:click="gotoUrl(hrefWhatsApp)">              
              <ion-avatar><ion-img src="../img/logo-whatsapp.svg" /></ion-avatar>
              <ion-label>wa.me/{{poster.orderData.billing.phone}}</ion-label>
            </ion-chip>
            <p>{{poster.orderData.shipping.address_1}} {{poster.orderData.shipping.address_2}}</p>
            <p>{{poster.orderData.shipping.postcode}}</p>
            <p>{{poster.orderData.shipping.city}} {{poster.orderData.shipping.country}}</p>
            <p>{{poster.orderData.billing.email}}</p>
            
          </ion-label>
        </ion-item>
        <ion-item>
          <ion-label>
            <h1>Items ordered</h1>
          </ion-label>
        </ion-item>
        <ion-item-group v-for="item in poster.orderData.line_items" :key="item.id">
          <ion-item>
            <ion-label>
              {{item.quantity}}x {{item.parent_name}} 
              <ion-chip><ion-label>{{item.meta_data[0].display_value}}</ion-label></ion-chip> 
              <ion-chip><ion-label>{{item.meta_data[1].display_value}}</ion-label></ion-chip> 
              <ion-chip v-if="item.sku == '1015'"><ion-label>{{item.meta_data[7].display_value}}</ion-label></ion-chip> 
            </ion-label>
          </ion-item>
          <ion-item v-if="item.sku == '1019'">
            <ion-label>
              <p>{{item.meta_data[5].value}}</p>
              <p>{{item.meta_data[6].value}}</p>
              <p>{{item.meta_data[7].value}}</p>
            </ion-label>
          </ion-item>
          <ion-item v-else-if="item.sku == '1015'">
            <ion-label>
              <p>{{item.meta_data[8].display_value}}</p>
              <p>{{item.meta_data[9].display_value}}</p>
              <p>{{item.meta_data[10].display_value}}</p>
            </ion-label>
          </ion-item>
        </ion-item-group>
        <ion-item>
          <ion-label>
            <h1>Technology</h1>
          </ion-label>
        </ion-item>
        <ion-item-group>
          <ion-item>
            <ion-label>
              <ion-text>User agent</ion-text>
              <p>{{showPlatform}}</p>
              <p>{{poster.orderData.customer_ip_address}}</p>
            </ion-label>
          </ion-item>
          <ion-item v-for="item in poster.orderData.line_items" :key="item.id">
            <ion-label v-if="item.sku == '1019' || item.sku == '1015'">
              <ion-text>Location data</ion-text>
              <p v-if="item.sku == '1019'">{{item.meta_data[3].value}}</p>
              <p v-if="item.sku == '1019'">{{item.meta_data[4].value}}</p>
              
              <p v-if="item.sku == '1015'"><span>Coordinates: </span>{{item.meta_data[4].display_value}}</p>
              <p v-if="item.sku == '1015'"><span>Marker: </span>{{item.meta_data[6].display_value}}</p>
              <p v-if="item.sku == '1015'"><span>Zoom: </span>{{item.meta_data[5].display_value}}</p>
            </ion-label>
          </ion-item>
        </ion-item-group>
        <ion-item v-for="item in poster.orderData.line_items" :key="item.id">
            <ion-button v-if="item.sku == '1019' || item.sku == '1015'" @click="openModal">show raw data</ion-button>
            <ion-button v-if="item.sku == '1019' && item.meta_data[2].value" target="_blank" :href="`https://www.placethemoment.com/api/v2/json.php?place_id=${item.meta_data[2].value}`"> geolocation </ion-button>
            <ion-button v-if="item.sku == '1019'" target="_blank" :href="`https://dashboard.placethemoment.com/celestial/?id=${item.id}&design=${item.meta_data[0].value}&location=${item.meta_data[3].value}&datetime=${item.meta_data[4].value}`"> map </ion-button>
            
            <ion-button v-if="item.sku == '1015' && item.meta_data[3].value" :href="`https://www.placethemoment.com/api/v2/json.php?place_id=${item.meta_data[3].value}`" target="_blank"> geoocation </ion-button>
            <ion-button v-if="item.sku == '1015'" :href="item.meta_data[12].value" target="_blank"> map </ion-button>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script>
import platform from 'platform'
import OrderData from '@/components/OrderData'
// import { Loader } from '@googlemaps/js-api-loader'
// import { GoogleMap } from '@googlemaps/map-loader'

export default {
    name: 'OrderView',
    data() {
        return {
          poster: {
            orderData: null
          }
        }
    },
    computed: {
      showSearchedAddress(){
        return null
      },
      showPlatform(){
        return platform.parse(this.poster.orderData.customer_user_agent);        
      },
      displayCreatedDate(){
        const event = new Date(this.poster.orderData.date_created);
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return event.toLocaleDateString('nl-NL', options);
      },
      displayDaysPast(){
        const oneDay = 24 * 60 * 60 * 1000;
        const dateCreated = new Date(this.poster.orderData.date_created);
        const dateCurrent = new Date();
        const daysAgo = Math.round(Math.abs((dateCreated - dateCurrent) / oneDay));
        const daysText = (daysAgo > 1) ? 'days': 'day';
        return daysAgo ? `${daysAgo} ${daysText} ago` : 'Vandaag';
      },
      hrefWhatsApp(){
        if(this.poster.orderData.billing.country == 'NL' && this.poster.orderData.billing.phone.startsWith('06'))
          return `https://wa.me/31${this.poster.orderData.billing.phone.slice(1)}`
        else
          return `https://wa.me/${this.poster.orderData.billing.phone}`
      }
    },
    watch:{
      '$route': 'getDataFromWC'
    },
    methods: {
      gotoUrl(url){
        window.open(url, '_blank');
      },
      getDataFromWC(){
        this.poster.orderData = null
        this.$woocommerce.get(`orders/${this.$route.params.id}` )
          .then(response => this.poster.orderData = response.data)
          .catch(error => console.log('error', error))
      },
      openModal(){
        return this.$ionic.modalController.create({
          component: OrderData,
          componentProps: {
            data: {
              content: this.poster.orderData
            },
            propsData: {
              title: 'Raw order data'
            }
          }
        })
        .then(modal => modal.present());
      }
    },
    created(){
      this.getDataFromWC();
    },
    mounted(){
      // const loader = new Loader({
      //   apiKey: "AIzaSyCE1svBjPmf71zWMhdr5r0Xu9EDN2sxwHk",
      //   version: "weekly"
      // });

      // loader.load().then((google) => {
      //   const geocoder = new google.maps.Geocoder();
      //   const placeId = "ChIJd1_X47W0wEcR3X6rzPxVDAs";
      //   geocoder.geocode({ placeId: placeId }, (results, status) => {
      //     console.log(status,results)
      //   })
      // })
      // .catch(e => {
      //   console.log(e)
      // });
    }
}
</script>

<style scoped>
ion-avatar {
  --size: 24px;
}
ion-label > p {
  margin-left: .5rem;
  user-select: all;
  cursor: default;
}
ion-label ion-chip ~ ion-label {
  margin-top: .5rem;
}

</style>