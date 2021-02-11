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
        <ion-item v-for="item in poster.orderData.line_items" :key="item.id">
          <ion-label v-if="item.sku == '1015'">
            <ion-text>
              {{item.quantity}}x {{item.parent_name}} 
              <ion-chip><ion-label>{{item.meta_data[0].display_value}}</ion-label></ion-chip> 
              <ion-chip><ion-label>{{item.meta_data[1].display_value}}</ion-label></ion-chip> 
            </ion-text>
            <p>{{item.meta_data[8].display_value}}</p>
            <p>{{item.meta_data[9].display_value}}</p>
            <p>{{item.meta_data[10].display_value}}</p>
            <ion-button :href="`https://developers.google.com/maps/documentation/javascript/examples/geocoding-place-id${item.meta_data[10].display_value}`">Place ID</ion-button>
            <ion-button :href="item.meta_data[10].display_value">Place ID</ion-button>
          </ion-label>
          <ion-label v-else>
            <p>{{item.meta_data}}</p>
            <p>{{item.meta_data['pa_size']}}</p>
          </ion-label>
        </ion-item>
        <ion-item>
          <ion-label>
            <h1>Technology</h1>
          </ion-label>
        </ion-item>
        <ion-item>
          <ion-label>
            <ion-text>User agent</ion-text>
            <p>{{showPlatform}}</p>
            <p>{{poster.orderData.customer_ip_address}}</p>
          </ion-label>
        </ion-item>
        <ion-item>
          <ion-button @click="openModal">show raw data</ion-button>
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
</style>