export default {
  methods:{
    createMap(poster, split){
      this.$photoshop.post('/renditionCreate',this.mapObject(poster.id, this.designNumber(poster.design), split ? split : poster.highres))
        .then(response => this.getAdobeStatus(response.data._links.self.href))
        .catch(error => {
          this.openToast('failed', error.message, [{ side: 'start', text: 'Retry', handler: () => this.createMap(poster, poster.highres.split('?',1))}, { side: 'end', text: 'Close', handler: () => this.dismiss }])
        });
    },
    async createPDF(poster, lineitem = 0, state = 'map'){
      let response;
      
      if(state === 'map')
        response = await this.$photoshop.post('/renditionCreate',this.mapObject(poster.id, lineitem, this.designNumber(poster.design), poster.highres))
      else
        response = await this.$photoshop.post('/renditionCreate',this.adobeObject(poster,lineitem))

      if(response.status == 202){
        this.getAdobeStatus(response.data._links.self.href,poster,lineitem,state)
        return
      }
      
      this.openToast('failed', response.status)
      throw new Error(response.status)
    },
    async getAdobeStatus(url, poster, lineitem, state){
      const msg = poster ? `Creating PTM-${poster.size}-${poster.id}-${this.designNumber(poster.design)}${this.lineItemLabel(lineitem)}-${poster.country}-${poster.language}.psd <ion-spinner name="dots" style="vertical-align: middle"></ion-spinner>` : 'Generating high-resolution map  <ion-spinner name="dots" style="vertical-align: middle"></ion-spinner>';
      // console.log('msg:', msg);
      const getStatus = await this.$photoshop.get(url);
      getStatus.data.outputs.forEach(item => {
        if(item.status === 'running'){
          if(!this.isLoading){
            this.isLoading = true
            this.openToast(item.status, msg);
          }
          setTimeout(() => {
            this.getAdobeStatus(url, poster, lineitem, state);
          }, 2000);
        } else if(item.status === 'pending'){
          if(!this.isLoading){            
            this.isLoading = true
            this.openToast(item.status, msg);
          }
          setTimeout(() => {
            this.getAdobeStatus(url);
          }, 2000);
        } else if(item.status === 'failed'){
          this.isLoading = false
          this.$ionic.toastController.dismiss();
          console.log('item:',item)
          this.openToast(item.status, `${item.errors.code}: ${item.errors.title}`)
        }
        else if(item.status === 'succeeded'){
          if(state === 'map'){
            this.createPDF(poster,lineitem,'actions')
          }
          else if(state === 'actions'){
            setTimeout(() => {
              this.applyActions(poster,lineitem);
            },2500);
          } else {
            this.isLoading = false
            this.selected = false
            this.$ionic.toastController.dismiss();
          }
        }
      });
    },
    async applyActions(poster,lineitem){
      await this.$photoshop.post('/batchPlay',this.actionsObject(poster,lineitem))
        .then(response => this.getAdobeStatus(response.data._links.self.href, poster, lineitem))
        .catch(error => this.openToast('failed', error.message));
    },
    mapObject(posterid, lineitem, designNumber, posterurl){
      return {
        "inputs": [
          {
            "href": posterurl,
            "storage": "external"
          }
        ],
        "outputs":[
          {
            "href":`/files/PTM/Maps/${posterid}-${designNumber}${this.lineItemLabel(lineitem)}.png`,
            "storage":"adobe",
            "type":"image/png",
            "width":0,
            "overwrite":true,
            "compression":"small"
          }
        ]
      }
    },
    adobeObject(poster,lineitem){
      let snow = (poster.design === 'snow') ? true : false
      let moon = (poster.design === 'moon') ? true : false
      let granite = (poster.design === 'granite') ? true : false
      let mint = (poster.design === 'mint') ? true : false
      let honey = (poster.design === 'honey') ? true : false

      return {
        "inputs": [
          {
            // "href": `/files/PTM/Templates/PTM-${poster.size.toUpperCase()}-XXXX-1-NL-nl.psd`,
            "href": `/files/PTM/Templates/PTM-${poster.size}-XXXX-1-NL-nl.psd`,
            "storage": "adobe"
          }
        ],
        "options":{
          "fonts": [
            {
              "storage": "adobe",
              "href": "/files/Fonts/Open_Sans/OpenSans-Light.ttf"
            },
            {
              "storage": "adobe",
              "href": "/files/Fonts/Open_Sans/OpenSans-CondensedLight.ttf"
            }
          ],
          "layers":[
            this.editMap(poster,lineitem),
            this.editPin(poster.marker, poster.size),
            {
              "id":225,
              "edit":{},
              "name": "TITLE",
              "text":{
                "content": poster.moment.toUpperCase(),
                "characterStyles": [
                  { 
                    "fontColor": this.textColor(poster.design),
                    "fontName": "OpenSans-CondensedLight"
                  }
                ]
              },
            },
            {
              "id":226,
              "edit":{},        
              "name": "LABEL",
              "text":{
                "content": `PTM-${poster.size}-${poster.id}-${this.designNumber(poster.design)}${this.lineItemLabel(lineitem)}-${poster.country.toUpperCase()}-${poster.language}`,
                "characterStyles": [
                  { 
                    "fontColor": this.textColor(poster.design),
                    "fontName": "OpenSans-Light"
                  }
                ]
              },
            },
            
            {
              "id":224,
              "edit":{},
              "name": "SUBLINE",
              "text":{
                "content": poster.subline,
                "characterStyles": [
                  { 
                    "fontColor": this.textColor(poster.design),
                    "fontName":"OpenSans-Light"
                  }
                ]
              },
            },
            {
              "id":223,
              "edit":{},        
              "name": "TAGLINE",
              "text":{
                "content":  poster.tagline,
                "characterStyles": [
                  { 
                    "fontColor": this.textColor(poster.design),
                    "fontName":"OpenSans-Light" 
                  }
                ]
              },
            },
            {
              "edit":{}, 
              "id":230,
              "visible": false        
            },
            {
              "id":552,
              "edit":{},        
              "name": "WHITE LINE",
              "visible": (granite || mint) ? true : false
            },
            {
              "id":551,
              "edit":{},        
              "name": "BLACK LINE",
              "visible": (snow || honey) ? true : false
            },
            {
              "id":33,
              "edit":{},        
              "name": "GRANITE LINE",
              "visible": moon
            },
            {
              "id":548,
              "edit":{},        
              "name": "GRANITE BG",
              "visible": granite
            },
            {
              "id":549,
              "edit":{},        
              "name": "MINT BG",
              "visible": mint
            },
            {
              "id":550,
              "edit":{},        
              "name": "HONEY BG",
              "visible": honey
            },
          ]
        },
        "outputs":[
          {
            "href":`/files/PTM/Templates/outputs/PTM-${poster.size}-${poster.id}-${this.designNumber(poster.design)}${this.lineItemLabel(lineitem)}-${poster.country}-${poster.language}.psd`,
            "storage":"adobe",
            "type":"vnd.adobe.photoshop",
            "overwrite":true
          }
        ]
      }
    },
    actionsObject(poster,lineitem){
      return {
        "inputs": [
          {
            "href": `/files/PTM/Templates/outputs/PTM-${poster.size}-${poster.id}-${this.designNumber(poster.design)}${this.lineItemLabel(lineitem)}-${poster.country}-${poster.language}.psd`,
            "storage": "adobe"
          }
        ],
        "options": {
          "actions": [
            {
              "href": `/files/actions/PTM-${poster.size}.atn`,
              "storage": "adobe"
            }
          ]
        },
        "outputs": [
          {
              "storage":"adobe",
              "type":"vnd.adobe.photoshop",
              "overwrite":true,
              "href": `/files/PTM/Templates/outputs/PTM-${poster.size}-${poster.id}-${this.designNumber(poster.design)}${this.lineItemLabel(lineitem)}-${poster.country}-${poster.language}.psd`
          }
        ]
      }
    },
    editMap(poster,lineitem){
      return {
        "id": (poster.size === 'L') ? 281 : 590,
        "edit":{},
        "name": "MAP",
        "input":{
          "href":`/files/PTM/Maps/${poster.id}-${this.designNumber(poster.design)}${this.lineItemLabel(lineitem)}.png`,
          "storage":"adobe"
        },
        "bounds":{
          "height": (poster.size === 'L') ? 4729 : 2877,
          "left": (poster.size === 'L') ? 661 : 404,
          "top": (poster.size === 'L') ? 945 : 523,
          "width": (poster.size === 'L') ? 4728 : 2877
        },
      }
    },
    editPin(marker, size){
      if(marker === 'heart'){
        return {
          "id": (size === 'L') ? 792 : 796,
          "edit":{},
          "name": "HEART",
          "visible": true
        }
      } else {
        return {
          "id": (size === 'L') ? 749 : 752,
          "edit":{},
          "name": "PIN",
          "visible": true,
          "fill": {
            "solidColor": this.rgb(marker)
          },
        }
      }
    },
  }
}