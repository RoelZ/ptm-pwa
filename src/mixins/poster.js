export default {
  methods:{
    metaData(num, substract){
      // originally lineitem (lowercase), but was bad naming convention
      return substract ? num - substract : num
    },
    posterItem(poster, lineitem){
      console.log('poster:', poster, 'lineitem:', lineitem)          
      let express = RegExp('Express*').test(poster.shipping_lines[0].method_title);
      let size = (poster.line_items[lineitem].meta_data[1].value == '30x40') ? 'S' : 'L'

      // onderstaande gaat fout wanneer er een line_item mist (meta_data[7], meta_data[8], etc)
      // onderstaande mist meerder items in cart (line_items[lineitem])
      // (poster.line_items.length)
      console.log('lineitem:', poster.line_items[lineitem]);
      // let oldOrder = (poster.line_items[lineitem].meta_data[2].key == '_Place ID') ? 1 : 0;

      if(poster.line_items[lineitem].sku === "1019"){
        return {
          id: poster.id,
          size,
          design: poster.line_items[lineitem].meta_data[0].value,
          // marker: poster.line_items[lineitem].meta_data[6].value,
          moment: poster.line_items[lineitem].meta_data[7].value,
          subline: poster.line_items[lineitem].meta_data[8].value,
          tagline: poster.line_items[lineitem].meta_data[9].value,
          lowres: poster.line_items[lineitem].meta_data[12].value,
          // highres: 'https://www.placethemoment.com/images/celestial.png',
          hash: poster.cart_hash,
          language: poster.line_items[lineitem].meta_data[14].value,
          country: poster.shipping.country,
          length: (poster.line_items.length > 1) ? '+' : '',
          shipping: poster.shipping_lines[0].method_title,
          express,
          labelColor: express ? 'danger' : '',        
          notes: poster.customer_note,
          sku: poster.line_items[lineitem].sku
        }
      }


      return {
        id: poster.id,
        size,
        design: poster.line_items[lineitem].meta_data[0].value,
        marker: poster.line_items[lineitem].meta_data[6].value,
        moment: poster.line_items[lineitem].meta_data[7].value,
        subline: poster.line_items[lineitem].meta_data[8].value,
        tagline: poster.line_items[lineitem].meta_data[9].value,
        lowres: poster.line_items[lineitem].meta_data[10].value.substring(64, 9),
        highres: poster.line_items[lineitem].meta_data[11].value.match(/"(.*?)"/gi)[0].slice(1,-1),
        hash: poster.cart_hash,
        language: poster.line_items[lineitem].meta_data[12].value,
        country: poster.shipping.country,
        length: (poster.line_items.length > 1) ? '+' : '',
        shipping: poster.shipping_lines[0].method_title,
        express,
        labelColor: express ? 'danger' : '',        
        notes: poster.customer_note,
        sku: poster.line_items[lineitem].sku
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
      return (design === 'snow' || design === 'honey' || design === 'hay') ? this.adobeColor('black')
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
           : { "blue": 27756, "green": 22359, "red": 8995 }
    },
    designNumber(poster){
      if(poster.sku == "1019"){
        return  (poster.design === 'moon') ? 0 
              : (poster.design === 'granite') ? 1 
              : (poster.design === 'olive') ? 2 
              : (poster.design === 'hay') ? 3 
              : (poster.design === 'redwood') ? 4
              : 5
      }
      return (poster.design === 'snow') ? 0 
           : (poster.design === 'moon') ? 1 
           : (poster.design === 'granite') ? 2 
           : (poster.design === 'mint') ? 3 
           : 4
    },
  }  
}