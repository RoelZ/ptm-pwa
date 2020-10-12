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
          <ion-label>
            <h1>Customer details</h1>
          </ion-label>
        </ion-item>
        <ion-item>
          <ion-label class="ion-text-wrap">
            <ion-text>
              {{poster.orderData.shipping.first_name}} {{poster.orderData.shipping.last_name}}
            </ion-text>
            <p>{{poster.orderData.shipping.address_1}} {{poster.orderData.shipping.address_2}}</p>
            <p>{{poster.orderData.shipping.postcode}}</p>
            <p>{{poster.orderData.shipping.city}} {{poster.orderData.shipping.country}}</p>
            <p>{{poster.orderData.billing.email}}</p>
            <p>{{poster.orderData.billing.phone}}</p>
            <h2>{{poster.orderData.shipping_lines[0].method_title}}</h2>
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
      </ion-list>
      <pre>
        {{poster.orderData}}
      </pre>
    </ion-content>
  </ion-page>
</template>

<script>
import platform from 'platform'

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
        return `${daysAgo} ${daysText} ago`;
      }
    },
    watch:{
      '$route': 'getDataFromWC'
    },
    methods: {
      getDataFromWC(){
        this.poster.orderData = null
        this.$woocommerce.get(`orders/${this.$route.params.id}` )
          .then(response => this.poster.orderData = response.data)
          .catch(error => console.log('error', error))
      }
    },
    created(){
      this.getDataFromWC();
    }
}
</script>