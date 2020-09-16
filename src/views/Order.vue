<template>
    <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/orders"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ poster.id }} Order details</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-list>
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
            <p>
            {{poster.orderData.shipping.address_1}} {{poster.orderData.shipping.address_2}}
            </p>
            <p>
            {{poster.orderData.shipping.postcode}}
            </p>
            <p>
            {{poster.orderData.shipping.city}} {{poster.orderData.shipping.country}}
            </p>
          </ion-label>
        </ion-item>
        <ion-item>
          <ion-label>
            <h1>Order created</h1>
            <ion-note>{{poster.orderData.date_created}}</ion-note>
          </ion-label>
          <ion-badge color="success" slot="end">
            5 Days ago
          </ion-badge>
        </ion-item>
        <ion-item>
          <ion-label>
            <h1>IP-address</h1>
            <ion-note>{{poster.orderData.customer_ip_address}}</ion-note>
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
export default {
    name: 'OrderView',
    data() {
        return {
          poster: {
            id: this.$route.params.id,
            orderData: []
          }
        }
    },
    created(){
      this.$woocommerce.get(`orders/${this.poster.id}` )
      .then(response => this.poster.orderData = response.data)
      .catch(error => console.log('error', error))
      .finally(console.log('WC done'))
    }
}
</script>