export default {
  methods:{
    metaData(num, substract){      
      return substract ? num - substract : num
    },
    posterItem(poster, lineitem){
      let express = RegExp('Express*').test(poster.shipping_lines[0].method_title);
      let size = (poster.line_items[lineitem].meta_data[1].value == '30x40cm') ? 'S' : 'L'

      // onderstaande gaat fout wanneer er een line_item mist (meta_data[7], meta_data[8], etc)
      // onderstaande mist meerder items in cart (line_items[lineitem])
      // (poster.line_items.length)

      // let oldOrder = (poster.line_items[lineitem].meta_data[2].key == '_Place ID') ? 1 : 0;

      // "<a href=\"https://tiles.placethemoment.com/styles/granite/static/5.4083633422852,51.419763826697,5.5051803588867,51.480100013662/1024x1024@4x.png?path=5.460205078125,51.44820343847695|5.460205078125,51.449203438477&stroke=rgb(255,0,255)&witdh=1\">Print poster</a>"
      if(this.sku === "1019"){
        return {
          id: poster.id,
          size,
          design: poster.line_items[lineitem].meta_data[0].value,
          moment: poster.line_items[lineitem].meta_data[5].value,
          subline: poster.line_items[lineitem].meta_data[6].value,
          tagline: poster.line_items[lineitem].meta_data[7].value,
          lowres: poster.line_items[lineitem].meta_data[8].value,
          highres: `https://dashboard.placethemoment.com/celestial/?id=${poster.id}&design=${poster.line_items[lineitem].meta_data[0].value}&location=${poster.line_items[lineitem].meta_data[3].value}&datetime=${poster.line_items[lineitem].meta_data[4].value}`,
          hash: poster.cart_hash,
          language: poster.line_items[lineitem].meta_data[9].value,
          country: poster.shipping.country,
          length: (poster.line_items.length > 1) ? '+' : '',
          shipping: poster.shipping_lines[0].method_title,
          express,
          labelColor: express ? 'danger' : '',        
          notes: poster.customer_note
        }
      }

      return {
        id: poster.id,
        size,
        design: poster.line_items[lineitem].meta_data[0].value,
        marker: poster.line_items[lineitem].meta_data[7].value,
        moment: poster.line_items[lineitem].meta_data[8].value,
        subline: poster.line_items[lineitem].meta_data[9].value,
        tagline: poster.line_items[lineitem].meta_data[10].value,
        lowres: poster.line_items[lineitem].meta_data[11].value,
        highres: poster.line_items[lineitem].meta_data[12].value,
        hash: poster.cart_hash,
        language: poster.line_items[lineitem].meta_data[13].value,
        country: poster.shipping.country,
        length: (poster.line_items.length > 1) ? '+' : '',
        shipping: poster.shipping_lines[0].method_title,
        express,
        labelColor: express ? 'danger' : '',        
        notes: poster.customer_note
      }
    },
    rgb16(color){
      return (color === 'granite') ? { "rgb": { "blue": 11822, "green": 11180, "red": 10794 } }
           : (color === 'mint') ? { "rgb": { "blue": 14264, "green": 20689, "red": 17605 } }
           : (color === 'snow') ? { "rgb": { "blue": 32768, "green": 32768, "red": 32768 } }
           : (color === 'black') ? { "rgb": { "blue": 0, "green": 0, "red": 0 } }
           : { "rgb": { "blue": 27756, "green": 22359, "red": 8995 } }    
    },
    rgb(color){
      return (color === 'granite') ? { "rgb": { "blue": 92, "green": 87, "red": 84 } }
           : (color === 'mint') ? { "rgb": { "blue": 137, "green": 161, "red": 111 } }
           : (color === 'olive') ? { "rgb": { "blue": 111, "green": 136, "red": 146 } }
           : (color === 'redwood') ? { "rgb": { "blue": 62, "green": 82, "red": 163 } }
           : (color === 'dustyrose') ? { "rgb": { "blue": 130, "green": 135, "red": 176 } }
           : (color === 'snow') ? { "rgb": { "blue": 255, "green": 255, "red": 255 } }
           : (color === 'black') ? { "rgb": { "blue": 0, "green": 0, "red": 0 } }
           : { "rgb": { "blue": 70, "green": 174, "red": 216 } }    
    },
    textColor(design) {
      return (design === 'snow' || design === 'honey' || design === 'hay' || design === 'cotton' || design === 'ocean' || design === 'mauve') ? this.adobeColor('black')
           : (design === 'granite' || design === 'mint') ? this.adobeColor('snow')
           : (design === 'olive') ? this.adobeColor('olive')
           : (design === 'redwood') ? this.adobeColor('redwood')
           : (design === 'dustyrose') ? this.adobeColor('dustyrose')
           : this.adobeColor('granite')
    },
    adobeColor(color) {
      return (color === 'granite') ? { "blue": 92, "green": 87, "red": 84 }
           : (color === 'mint') ? { "blue": 137, "green": 161, "red": 111 }
           : (color === 'olive') ? { "blue": 111, "green": 136, "red": 146 }
           : (color === 'redwood') ? { "blue": 62, "green": 82, "red": 163 }
           : (color === 'dustyrose') ? { "blue": 130, "green": 135, "red": 176 }
           : (color === 'snow') ? { "blue": 255, "green": 255, "red": 255 }
           : (color === 'black') ? { "blue": 0, "green": 0, "red": 0 }
           : { "blue": 70, "green": 174, "red": 216 }
    },
    // design != poster.sku
    designNumber(design){
      if(design.sku == "1019"){
        return  (design === 'moon') ? 0 
              : (design === 'granite') ? 1 
              : (design === 'olive') ? 2 
              : (design === 'hay') ? 3 
              : (design === 'redwood') ? 4
              : 5
      }
      return (design === 'snow') ? 0 
           : (design === 'moon') ? 1 
           : (design === 'granite') ? 2 
           : (design === 'mint') ? 3 
           : 4
    },
  }  
}