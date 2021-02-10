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
      let oldOrder = (poster.line_items[lineitem].meta_data[2].key == '_Place ID') ? 1 : 0;

      return {
        id: poster.id,
        size,
        design: poster.line_items[lineitem].meta_data[0].value,
        marker: poster.line_items[lineitem].meta_data[this.metaData(7, oldOrder)].value,
        moment: poster.line_items[lineitem].meta_data[this.metaData(8, oldOrder)].value,
        subline: poster.line_items[lineitem].meta_data[this.metaData(9, oldOrder)].value,
        tagline: poster.line_items[lineitem].meta_data[this.metaData(10, oldOrder)].value,
        lowres: poster.line_items[lineitem].meta_data[this.metaData(11, oldOrder)].value.substring(64, 9),
        highres: poster.line_items[lineitem].meta_data[this.metaData(12, oldOrder)].value.match(/"(.*?)"/gi)[0].slice(1,-1),
        hash: poster.cart_hash,
        language: poster.line_items[lineitem].meta_data[this.metaData(13, oldOrder)] ? poster.line_items[lineitem].meta_data[this.metaData(13, oldOrder)].value : 'nl',
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
           : (color === 'snow') ? { "rgb": { "blue": 255, "green": 255, "red": 255 } }
           : (color === 'black') ? { "rgb": { "blue": 0, "green": 0, "red": 0 } }
           : { "rgb": { "blue": 70, "green": 174, "red": 216 } }    
    },
    textColor(design) {
      return (design === 'snow' || design === 'honey') ? this.rgb16('black')
           : (design === 'granite' || design === 'mint') ? this.rgb16('snow')
           : this.rgb16('granite')
    },
    designNumber(design){
      return (design === 'snow') ? 0 
           : (design === 'moon') ? 1 
           : (design === 'granite') ? 2 
           : (design === 'mint') ? 3 
           : 4
    },
    lineItemLabel(lineitem){
      return lineitem ? String.fromCharCode(65 + lineitem) : ''
    },
  }  
}