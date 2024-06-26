import { Dropbox } from 'dropbox';
import dropboxConfig from '../config/dropbox';

export default {
  data() {
    return {
      dropbox: null
    }
  },

  methods: {
    getDropbox() {
      this.dropbox = new Dropbox(dropboxConfig);
    },

    createMap(poster, split){
      this.getDropbox();

      const posterurl = split ? split : poster.highres;

      this.dropbox.filesGetTemporaryUploadLink({
          'commit_info': {
            path: `/maps/${poster.id}-${this.designNumber(poster.design)}${this.lineItemLabel}.png`,
            "mode": {
              ".tag": "overwrite"
            },
            autorename: false
          }
      }).then(({ result }) => {
        this.$photoshop.post('/renditionCreate',this.mapObject(posterurl, result.link))
        .then(response => this.getAdobeStatus(response.data._links.self.href))
        .catch(error => {
          this.openToast('failed', error.message, [{ side: 'start', text: 'Retry', handler: () => this.createMap(poster, poster.highres.split('?',1))}, { side: 'end', text: 'Close', handler: () => this.dismiss }])
        });
      })
      .catch(error => {
        console.error(error);
        this.openToast('failed', error.error_summary, [{ side: 'end', text: 'Close', handler: () => this.dismiss }])
      });
    },
    // params: lineitem, state)
    async createPDF(poster, lineitem = 0, state = 'map'){
      this.getDropbox();
      this.dropbox.filesGetTemporaryUploadLink({
          'commit_info': {
            path: `/outputs/PTM-${poster.size}-${poster.id}-${this.designNumber(poster.design)}${this.lineItemLabel}-${poster.country}-${poster.language}.psd`,
            "mode": {
              ".tag": "overwrite"
            },
            autorename: false
          }
      }).then(({ result }) => {
        this.uploadLink = result.link;
        this.$photoshop.post('/text',this.adobeTextObject(poster))
        .then(response => this.getAdobeStatus(response.data._links.self.href, poster, 'layers'))
        .catch(error => this.openToast('failed', error.message));
      })
    },
    async applyLayerChanges(poster, lineitem){
      this.getDropbox();
      this.dropbox.filesGetTemporaryLink({ path: `/outputs/PTM-${poster.size}-${poster.id}-${this.designNumber(poster.design)}${this.lineItemLabel}-${poster.country}-${poster.language}.psd` })
      .then(({ result }) => {
        this.posterFile = result.link;

        this.dropbox.filesGetTemporaryLink({ path: `/maps/${poster.id}-${this.designNumber(poster.design)}${this.lineItemLabel}.png` })
        .then(({ result }) => {
          this.mapFile = result.link

          this.getDropbox();
          this.dropbox.filesGetTemporaryUploadLink({
              'commit_info': {
                path: `/outputs/PTM-${poster.size}-${poster.id}-${this.designNumber(poster.design)}${this.lineItemLabel}-${poster.country}-${poster.language}.psd`,
                "mode": {
                  ".tag": "overwrite"
                },
                autorename: false
              }
          }).then(({ result }) => {
            this.uploadLink = result.link;
            this.$photoshop.post('/documentOperations',this.adobeAdjustLayersObject(poster))
              .then(response => this.getAdobeStatus(response.data._links.self.href, poster, (this.sku !== "1091") ? 'markers' : null))
              .catch(error => this.openToast('failed', error.message));
          })
        })
      })
    },
    async applyActions(poster,lineitem){
      this.getDropbox();
      this.dropbox.filesGetTemporaryLink({ path: `/outputs/PTM-${poster.size}-${poster.id}-${this.designNumber(poster.design)}${this.lineItemLabel}-${poster.country}-${poster.language}.psd` })
      .then(({ result }) => {
        this.posterFile = result.link;

        this.dropbox.filesGetTemporaryUploadLink({
            'commit_info': {
              path: `/outputs/PTM-${poster.size}-${poster.id}-${this.designNumber(poster.design)}${this.lineItemLabel}-${poster.country}-${poster.language}.psd`,
              "mode": {
                ".tag": "overwrite"
              },
              autorename: false
            }
        }).then(({ result }) => {
          this.uploadLink = result.link;
          this.$photoshop.post('/batchPlay',this.adobeActionsObject(poster))
            .then(response => this.getAdobeStatus(response.data._links.self.href, poster))
            .catch(error => this.openToast('failed', error.message));
        })
      })
    },
    // not yet overwritten
    async getAdobeStatus(url, poster, lineitem, next){
      const msg = poster ? `Creating PTM-${poster.size}-${poster.id}-${this.designNumber(poster)}${this.lineItemLabel(lineitem)}-${poster.country}-${poster.language}.psd <ion-spinner name="dots" style="vertical-align: middle"></ion-spinner>` : 'Generating high-resolution map  <ion-spinner name="dots" style="vertical-align: middle"></ion-spinner>';
      const getStatus = await this.$photoshop.get(url);
      getStatus.data.outputs.forEach(item => {
        if(item.status === 'running'){
          if(!this.isLoading){
            this.isLoading = true
            this.openToast(item.status, msg);
          }
          setTimeout(() => {
            this.getAdobeStatus(url, poster, lineitem, next);
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
          if(next === "map"){
            console.log('initiate new create PDF:' + poster.id);
            this.createPDF(poster, lineitem, 'layers')
          }
          else if(next === "layers"){
            console.log('generate layers:' + poster.id);
            setTimeout(() => {
              this.applyLayerChanges(poster, lineitem);
            },2500);
          } else if(next === "markers"){
            console.log('generate markers:' + poster.id);
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
    mapObject(posterurl, uploadlink){
      return {
        "inputs": [
          {
            "href": posterurl,
            "storage": "external"
          }
        ],
        "outputs":[
          {
            "href":uploadlink,
            "storage":"dropbox",
            "type":"image/png",
            "width":0,
            "overwrite":true,
            "compression":"small"
          }
        ]
      };      
    },
    adobeTextObject(poster, lineitem){

      return {
        "inputs": [
          {
            "href": `/files/PTM/Templates/PTM-${poster.size}-XXXX-1-NL-nl.psd`,
            "storage": "adobe"
          }
        ],
        "options":{
          "fonts": [
            {
              "storage": "adobe",
              "href": "/files/PTM/Fonts/OpenSans-Light.ttf"
            },
            {
              "storage": "adobe",
              "href": "/files/PTM/Fonts/OpenSans-CondensedLight.ttf"
            }
          ],
          "layers":[
            {
              "name": "TITLE",
              "text":{
                "antiAlias": "antiAliasSharp",
                "content": poster.moment,
                "characterStyles": [
                  { 
                    "color": this.textColor(poster.design),
                    "fontPostScriptName": "OpenSansCondensed-Light",
                    "fontCaps": "allCaps",
                    "tracking": 100,
                  }
                ],
                "paragraphStyles": [{
                  "align": "center"
                }]
              },
            },
            {
              "name": "LABEL",
              "text":{
                "content": `PTM-${poster.size}-${poster.id}-${this.designNumber(poster)}${this.lineItemLabel(lineitem)}-${poster.country.toUpperCase()}-${poster.language}`,
                "characterStyles": [
                  { 
                    "color": this.textColor(poster.design),
                    "fontPostScriptName": "OpenSans-Light"
                  }
                ]
              },
            },
            
            {
              "name": "SUBLINE",
              "text":{
                "content": poster.subline,
                "characterStyles": [
                  { 
                    "color": this.textColor(poster.design),
                    "fontPostScriptName":"OpenSans-Light",
                  }
                ]
              },
            },
            {
              "name": "TAGLINE",
              "text":{
                "content":  poster.tagline,
                "characterStyles": [
                  { 
                    "color": this.textColor(poster.design),
                    "fontPostScriptName":"OpenSans-Light" 
                  }
                ]
              },
            }
          ]
        },
        "outputs":[
          {
            "href":`/files/PTM/Templates/outputs/PTM-${poster.size}-${poster.id}-${this.designNumber(poster)}${this.lineItemLabel(lineitem)}-${poster.country}-${poster.language}.psd`,
            "storage":"adobe",
            "type":"vnd.adobe.photoshop",
            "overwrite":true
          }
        ]
      }
    },
    adobeAdjustLayersObject(poster,lineitem){
      let snow = (poster.design === 'snow') ? true : false
      let moon = (poster.design === 'moon') ? true : false
      let granite = (poster.design === 'granite') ? true : false
      let mint = (poster.design === 'mint') ? true : false
      let honey = (poster.design === 'honey') ? true : false
      let olive = (poster.design === 'olive') ? true : false
      let hay = (poster.design === 'hay') ? true : false
      let redwood = (poster.design === 'redwood') ? true : false
      let dustyrose = (poster.design === 'dustyrose') ? true : false

      return {
        "inputs": [
          {
            "href": `/files/PTM/Templates/outputs/PTM-${poster.size}-${poster.id}-${this.designNumber(poster)}${this.lineItemLabel(lineitem)}-${poster.country}-${poster.language}.psd`,
            "storage": "adobe"
          }
        ],
        "options":{
          "layers":[
            this.editMap(poster, lineitem),
            this.editPin(poster.marker, poster.size, poster.sku),
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
              "visible": (snow || honey || hay) ? true : false
            },
            {
              "id":33,
              "edit":{},        
              "name": "GRANITE LINE",
              "visible": moon
            },
            {
              "id": (poster.size === 'L' || poster.size === 'DL') ? 819 : 817,
              "edit":{},        
              "name": "OLIVE LINE",
              "visible": olive
            },
            {
              "id": (poster.size === 'L' || poster.size === 'DL') ? 818 : 816,
              "edit":{},        
              "name": "REDWOOD LINE",
              "visible": redwood
            },
            {
              "id": (poster.size === 'L' || poster.size === 'DL') ? 817 : 815,
              "edit":{},        
              "name": "DUSTYROSE LINE",
              "visible": dustyrose
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
            {
              "id": (poster.size === 'L' || poster.size === 'DL') ? 816 : 818,
              "edit":{},        
              "name": "KABANA BG",
              "visible": poster.sku == "1019"
            }
            ]
        },
        "outputs":[
          {
            "href":`/files/PTM/Templates/outputs/PTM-${poster.size}-${poster.id}-${this.designNumber(poster)}${this.lineItemLabel(lineitem)}-${poster.country}-${poster.language}.psd`,
            "storage":"adobe",
            "type":"vnd.adobe.photoshop",
            "overwrite":true
          }
        ]
      }
    },
    adobeActionsObject(poster,lineitem){
      return {
        "inputs": [
          {
            "href": `/files/PTM/Templates/outputs/PTM-${poster.size}-${poster.id}-${this.designNumber(poster)}${this.lineItemLabel(lineitem)}-${poster.country}-${poster.language}.psd`,
            "storage": "adobe"
          }
        ],
        "options": {
          "actions": [
            {
              "href": "/files/PTM/Actions/PTM-Markers.atn",
              "storage": "adobe"
            }
          ]
        },
        "outputs": [
          {
              "storage":"adobe",
              "type":"vnd.adobe.photoshop",
              "overwrite":true,
              "href": `/files/PTM/Templates/outputs/PTM-${poster.size}-${poster.id}-${this.designNumber(poster)}${this.lineItemLabel(lineitem)}-${poster.country}-${poster.language}.psd`
          }
        ]
      }
    },
    editMap(poster,lineitem){
      return {
        "id": (poster.size === 'L' || poster.size === 'DL') ? 835 : 823,
        "edit":{},
        "index": 14,
        "locked":false,
        "type": "smartObject",
        "name": "MAP",
        "visible": true,
        "input":{
          "href": (poster.sku == "1019") ? `/files/PTM/Templates/celestial.png` : `/files/PTM/Maps/${poster.id}-${this.designNumber(poster)}${this.lineItemLabel(lineitem)}.png`,
          "storage":"adobe"
        },
        "smartObject" : {                
          "type" : "image/png"
        },
        "attributes":{
          "bounds":{
            "height": (poster.size === 'L' || poster.size === 'DL') ? 4729 : 2880,
            "left": (poster.size === 'L' || poster.size === 'DL') ? 662 : 404,
            "top": (poster.size === 'L' || poster.size === 'DL') ? 945 : 523,
            "width": (poster.size === 'L' || poster.size === 'DL') ? 4727 : 2880
          },
        },
      }
    },
    editPin(marker, size, sku){
      if(sku == "1019"){
        return {
          "id": (size === 'L') ? 792 : 796,
          "edit":{},
          "name": "HEART",
          "visible": false
        }
      }

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
    lineItemLabel(lineitem){
      return lineitem ? String.fromCharCode(65 + lineitem) : ''
    },
  }
}