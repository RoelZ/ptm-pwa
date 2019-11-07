<template>
    <ion-content fullscreen padding>
      <ion-grid padding>

        <ion-row class="ion-justify-content-center">
          <ion-col size="12">
            <a href="/">
              <ion-img class="brand" :src="'../img/logo-original-vector.svg'" />
            </a>
          </ion-col>
        </ion-row>

        <ion-row class="ion-justify-content-center">
          <ion-col size="12" size-md="4">
            <ion-searchbar @ionInput="getOrder($event.target.value)" type="number" inputmode="numeric"></ion-searchbar>
          </ion-col>
        </ion-row>
        <ion-row class="ion-justify-content-center">
          <ion-col size="6" size-md="2" offset-md="1">
            <IonSelectVue v-model="settings.status" :value="settings.status" @ionChange="viewStatus()">
              <ion-select-option value="processing">Processing</ion-select-option>
              <ion-select-option value="completed">Completed</ion-select-option>
            </IonSelectVue >
          </ion-col>
          <ion-col size="6" size-md="2">
            <ion-button class="ion-no-margin" @click="getDataset">DataSet</ion-button>
          </ion-col>
        </ion-row>

        <ion-row v-if="!orderData.length" class="ion-justify-content-center ion-align-items-center">
          <ion-card class="done" padding>
            <ion-card-title class="ion-text-center">
              All done!
            </ion-card-title>
            <ion-card-subtitle class="ion-text-center">
              Time for a cuppa!
            </ion-card-subtitle>
            <ion-card-content>
              <ion-img src="../img/alldone.png"></ion-img>
            </ion-card-content>
          </ion-card>
        </ion-row>

        <ion-row class="ion-justify-content-center">
          <ion-col size="12">            
            <div class="ion-padding poster-cards">
              <poster-card v-for="order in orderData" :key="order.id" :poster="order" />
            </div>
          </ion-col>
          <ion-infinite-scroll @ionInfinite="moreOrders($event)" threshold="100px" position="bottom">
            <ion-infinite-scroll-content></ion-infinite-scroll-content>
          </ion-infinite-scroll>
        </ion-row>

      </ion-grid>
    </ion-content>
</template>

<script>
import PosterCard from '@/components/PosterCard.vue'

export default {
  name: 'Orders',
  data () {
    return {
      isLoading: false,
      orderData: Array,
      settings: {
        nextPage: 1,
        status: 'processing'
      }
    }
  },
  computed:{
    getNumberOfWeek() {
      const today = new Date();
      const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
      const pastDaysOfYear = (today - firstDayOfYear) / 86400000;
      return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    },
  },
  methods: {
    viewStatus(){
      this.$woocommerce.get(`/orders/?status=${this.settings.status}`)
        .then(response => { 
          this.orderData = response.data
          this.settings.nextPage++
        })
        .catch(error => console.log('error', error))
    },
    getOrder(orderId){
      this.$woocommerce.get(`/orders/${orderId}`)
        .then(response => this.orderData = [response.data])
        .catch(error => console.log('error', error))
    },
    moreOrders(infiniteScroll) {
      this.$woocommerce.get(`/orders/?page=${this.settings.nextPage}&status=${this.settings.status}`)
        .then(response => {
          infiniteScroll.target.complete()
          this.orderData = this.orderData.concat(response.data);          

          if(this.settings.nextPage < response.headers['x-wp-totalpages'])
            this.settings.nextPage++
          else
            infiniteScroll.target.setAttribute('disabled','')          
        })
        .catch(error => console.log('error', error))
    },
    getStyleId(design) {
      switch(design){
        case 'snow':
          return 0
        case 'moon':
          return 1
        case 'granite':
          return 2
        case 'mint':
          return 3
        case 'honey':
          return 4
        default:
          return false        
      }
    },
    getDataset(){
      let rows = [
        ["ID", "Size", "Design", "Country","Language","Moment","Subline","Tagline","MapPoster",
        "BackgroundGranite","BackgroundHoney","BackgroundMint","LineBlack","LineWhite","LineGranite"]          
      ];

      this.orderData.forEach(order => {
        order.line_items.forEach(item => {
          const poster = item.meta_data;
          rows.push([
            order.id,
            (poster[0].value == "50x70") ? "L" : "S",
            this.getStyleId(poster[1].value),
            order.shipping.country,
            poster[13].value,
            `"${poster[8].value.replace('"','""')}"`,
            `"${poster[9].value.replace('"','""')}"`,
            `"${poster[10].value.replace('"','""')}"`,
            `D:\\NextUp\\${order.id}.png`,
            poster[1].value == "granite",
            poster[1].value == "honey",
            poster[1].value == "mint",
            (poster[1].value == "snow" || poster[1].value == "honey"),
            (poster[1].value == "granite" || poster[1].value == "mint"),
            poster[1].value == "moon"
          ])
        })
      });

      let lineArray = [];
      rows.forEach(function (infoArray) {
        lineArray.push(infoArray);
      });
      let csvContent = lineArray.join("\n");
      let csvBlob = new Blob([csvContent]);          
      const url = window.URL.createObjectURL(csvBlob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `dataset-week-${this.getNumberOfWeek}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    }
  },  
  created () {
    this.$woocommerce.get(`/orders?status=${this.settings.status}`)
    .then(response => this.orderData = response.data)
    .catch(error => console.log('error', error))
    .finally(console.log('WC done'))
  },
  mounted () {    
  },
  components: {
    PosterCard
  }
}
</script>

<style scoped>
  .done {
    margin-top:5rem;
  }
  ion-card {
    box-shadow:none;
  }
  ion-card-title {
    font-size:2.5rem
  }
  ion-card-subtitle {
    font-size:1.5rem
  }
  .brand {
    width:200px;
    margin:0 auto;
  }
  .poster-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit,minmax(240px,1fr));
    grid-gap: 1rem;
  }
</style>