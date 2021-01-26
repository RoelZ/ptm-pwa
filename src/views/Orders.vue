<template>
    <ion-content fullscreen padding color="light">
      <ion-grid>

        <ion-row class="ion-justify-content-center">
          <ion-col size="3">
            <a href="/">
              <ion-img class="brand" :src="'../img/logo-original-vector.svg'" />
            </a>
          </ion-col>
          <ion-col size="9">
            <ion-row>
              <ion-col size="6">
                <ion-searchbar @ionInput="getOrder($event.target.value)" debounce="500" type="number" inputmode="numeric"></ion-searchbar>
              </ion-col>
            </ion-row>
            <ion-row>
              <ion-col size="6">          
                <IonSelectVue v-model="settings.status" :value="settings.status" @ionChange="viewStatus()">
                  <ion-select-option value="pending">Pending</ion-select-option>
                  <ion-select-option value="processing">Processing</ion-select-option>
                  <ion-select-option value="completed">Completed</ion-select-option>
                </IonSelectVue>
              </ion-col>
              <ion-col size="6">
                <ion-button class="ion-no-margin" color="light" @click="getReviews">Reviews</ion-button>
                <ion-button class="ion-no-margin" color="light" @click="getOrderList">Orderlist</ion-button>
              </ion-col>
            </ion-row>
          </ion-col>
        </ion-row>

        <ion-row v-if="!orderData.length" class="ion-justify-content-center ion-align-items-center">
          <ion-card class="done" padding>
            <ion-card-title class="ion-text-center">
              All done!
            </ion-card-title>
            <ion-card-content>
              <ion-img src="../img/all-done.png"></ion-img>
            </ion-card-content>
          </ion-card>
        </ion-row>
        <ion-row v-else-if="settings.status === 'processing'">
          <ion-col size="12">
            <ion-item button @click="toggleSelection">
              <ion-label>Week {{ currentWeek }}</ion-label>
              <ion-checkbox slot="start"></ion-checkbox>
            </ion-item>
          </ion-col>
        </ion-row>
        <ion-row class="ion-justify-content-center">
          <ion-col size="12">
            <div class="ion-padding poster-cards">
              <div v-for="(order, index) in getPosterData" :key="index">
                <ion-slides v-if="order.line_items && order.line_items.length > 1" pager>
                  <ion-slide v-for="(poster, index) in order.line_items" :key="index">
                    <poster-card :line-item="index" :poster="order" :key="poster.id" :zomaar="selected" />
                  </ion-slide>
                </ion-slides>
                <poster-card v-else :poster="order" :key="order.id" :zomaar="selected" />
              </div>
            </div>
          </ion-col>

          <ion-infinite-scroll @ionInfinite="moreOrders($event)" threshold="100px" position="bottom">
            <ion-infinite-scroll-content></ion-infinite-scroll-content>
          </ion-infinite-scroll>
        </ion-row>

        <div class="card-overlay" v-if="isLoading">
          <ion-spinner name="dots"></ion-spinner>
        </div>

      </ion-grid>
    </ion-content>
</template>

<script>
import Vue from 'vue'
import OrderList from '@/components/OrderList';
import { weekNumber } from 'weeknumber'

export default {
  name: 'Orders',
  components: {
    PosterCard: () => import('@/components/PosterCard.vue')
  },
  data () {
    return {
      isLoading: true,
      isUpdated: false,
      orderData: Array,
      selected: false,
      currentWeek: weekNumber(),
      posterItems: Array,
      settings: {
        nextPage: 1,
        status: 'processing'
      }
    }
  },
  watch: {
    // orderData: function() {
    //   this.posterItems = this.orderData.map((order) => {
    //       const { line_items } = order;
    //       const filteredLineItems = line_items.filter((item) => item.sku === 1015);

    //       // To return undefined for orders with NO items has the given sku
    //       if (!filteredLineItems.length) return;

    //       return { ...order, line_items: filteredLineItems };
    //     })
    //     .filter((order) => order);
      
    //   console.log(this.posterItems);
    //   this.isUpdated = true
    //   // this.posterItems = this.orderData
    //   this.orderData.forEach(order => { 
    //     this.posterItems.push(order);
    //     order.line_items.forEach(item => {
    //       console.log(item);
    //     })
    //   })
    // }
  },
  computed:{
    getWeekNumber() {
      return weekNumber();
    },    
    getPosterData(){
      // console.log(this.filterOrdersByPoster(this.orderData));
      return this.orderData;
    },
  },
  // asyncComputed: {
  //   async posterData(){
  //     this.orderData.forEach(order => { 
  //       order.line_items.forEach(item => {
  //         console.log(item)
  //         this.posterItems.push(item);
  //       })
  //     });
  //     return await this.posterItems;
  //   },
  // },
  methods: {
    toggleSelection(){
      this.selected = !this.selected;
      console.log(this.selected)
    },
    viewStatus(){
      this.$woocommerce.get(`orders/?status=${this.settings.status}`)
        .then(response => { 
          this.orderData = response.data
          this.settings.nextPage++
        })
        .catch(error => console.log('error', error))
    },
    getOrder(orderId){
      this.$woocommerce.get(`orders/${orderId}`)
        .then(response => { 
          this.orderData = [response.data];          
        })
        .catch(error => console.log('error', error))
    },
    moreOrders(infiniteScroll) {
      this.$woocommerce.get(`orders/?page=${this.settings.nextPage}&status=${this.settings.status}`)
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
            `C:\\Users\\Virtual Reality\\Creative Cloud Files\\PTM\\Maps\\${order.id}.png`,
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
      a.download = `dataset-week-${this.getWeekNumber}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    },
    getReviews(){
      let currentDate = new Date();
      let pastDate = new Date(currentDate);
      pastDate.setDate(pastDate.getDate() - 5);

      this.$woocommerce.get(`orders?&status=completed&before=${pastDate.toISOString().slice(0, -5)}&after=2020-11-12T23:00:00&per_page=80` )
        .then((response) => {
          response.data.filter(function(order) {
            console.log(`(${order.billing.country}) ${order.billing.first_name}`);
            console.log(order.billing.email);
          });
        })
        .catch(error => console.log('error', error))
    },
    createModal() {
      let ComponentClass = Vue.extend(OrderList)
      let ComponentInstance = new ComponentClass()
      ComponentInstance.$mount()

      this.$ionic.modalController.create({
        component: ComponentInstance.$el
      }).then(modal => {
        modal.present();
        // currentModal = modal;
      });
    },
    getOrderList(){
      this.createModal();
    },
    // filterOrdersByPoster(orders){
    //   var filteredLineItems = orders.map((order) => {
    //     return order.line_items.filter((item) => item.sku == 1015)
    //   });
    //   return filteredLineItems;
      // if (!filteredLineItems.length) return;
      // return { ...orders, line_items: filteredLineItems };
    // }
    //       const { line_items } = order;
    //       const filteredLineItems = line_items.filter((item) => item.sku === 1015);

    //       // To return undefined for orders with NO items has the given sku
    //       if (!filteredLineItems.length) return;

    //       return { ...order, line_items: filteredLineItems };
    //     })
    //     .filter((order) => order);
  },  
  created () {
    this.$woocommerce.get(`orders?status=${this.settings.status}` )
    .then(response => this.orderData = response.data)
    .catch(error => console.log('error', error))
    .finally(() => this.isLoading = false)
  },
  // mounted () {
  //   if(this.$route.params.id)
  //     this.getOrder(this.$route.params.id);
  // }
}
</script>

<style scoped>
  .done {
    margin-top:5rem;
  }
  ion-grid {
    --ion-grid-padding-md: 1rem;
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
  ion-item {
    --background: none;
    --border-style: none;
    --padding-start: 2rem;
  }
  ion-slides {
    height:100%
  }
  .brand {
    width:200px;
    margin:0 auto;
  }
  .poster-cards {
    display: grid;
    grid-auto-columns: 1fr;    
    grid-template-columns: repeat(auto-fill,minmax(250px,1fr));
    grid-gap: 1rem;
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