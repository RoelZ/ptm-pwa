<template>
      <div style="height: 500px; width: 100%">
        <l-map
          style="height:80%;"
          :zoom="zoom"
          :center="center"
          :bounds="bounds"
          @update:zoom="zoomUpdated"
          @update:center="centerUpdated"
          @update:bounds="boundsUpdated"
        >
          <l-tile-layer :url="url"></l-tile-layer>
        </l-map>
      </div>
</template>

<script>
// import GetStarted from '@/components/GetStarted.vue'
import { latLngBounds } from "leaflet";
import {LMap, LTileLayer} from 'vue2-leaflet';

export default {
  name: 'MapTiler',
  components: {
    LMap,
    LTileLayer,
  },
  data () {
    return {
      url: 'https://tiles.placethemoment.com/styles/granite/{z}/{x}/{y}.png',
      zoom: 12,
      center: [0, 0],
      bounds: latLngBounds([
        [51.49762961696847, 5.539512634277345],
        [51.398777259985444, 5.380897521972656]
      ])
    };
  },
  methods: {
    zoomUpdated (zoom) {
      this.zoom = zoom;
    },
    centerUpdated (center) {
      this.center = center;
    },
    boundsUpdated (bounds) {
      this.bounds = bounds;
    }
  }
}
</script>