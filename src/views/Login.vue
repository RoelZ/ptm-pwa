<template>
  <ion-content nopadding scroll-y="false">
    <ion-img class="brand" :src="'../img/logo-original-vector.svg'" />
    <ion-card class="ion-padding">
      <ion-card-content>
        <ion-item-group>
          <ion-item>
            <ion-label position="stacked">Email address</ion-label>
            <ion-input
              autofocus
              required
              type="email"
              inputmode="email"
              @ionInput="user.email = $event.target.value"
              v-on:keyup.enter="login"
            ></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="stacked" lines="inset">Password</ion-label>
            <ion-input
              required
              type="password"
              @ionInput="user.password = $event.target.value"
              inputmode="password"
              v-on:keyup.enter="login"
            ></ion-input>
          </ion-item>
          <ion-item v-if="user.email === 'roel.heesterbeek@gmail.com'">
            <ion-label position="stacked">Token </ion-label>
            <ion-note slot="end"
              ><a href="https://ps-prerelease-us-east-1.cloud.adobe.io/" target="_blank"
                >(request here)</a
              ></ion-note
            >
            <ion-input
              required
              type="text"
              @ionInput="user.token = $event.target.value"
              inputmode="text"
            ></ion-input>
          </ion-item>
        </ion-item-group>
        <ion-button v-on:click="login" expand="block" class="ion-no-margin"
          >Login</ion-button
        >
      </ion-card-content>
    </ion-card>
  </ion-content>
</template>

<script>
import firebase from "firebase";
import "../api/firebase";
import axios from 'axios';
import qs from 'qs';


export default {
  name: "Login",
  data() {
    return {
      user: {
        email: null,
        password: null,
        token: null,
      },
    };
  },
  methods: {
    login(e) {
      firebase
        .auth()
        .signInWithEmailAndPassword(this.user.email, this.user.password)
        .then(
          () => {
            if(!this.user.token){
              axios.post('https://ims-na1.adobelogin.com/ims/exchange/jwt', qs.stringify({
                  'client_id': process.env.VUE_APP_PS_CLIENT_ID,
                  'client_secret': process.env.VUE_APP_PS_CLIENT_SECRET,
                  'jwt_token': process.env.VUE_APP_PS_JWT_TOKEN,
                }),
                { headers: { 'content-type': 'application/x-www-form-urlencoded' }
              })
              .then((response) => {
                console.log(response.data.access_token, response.data);
                localStorage.token = response.data.access_token;
                this.$router.push("/");
              })
              .catch((error) => {
                console.error(error);
              })
            } else {
              localStorage.token = this.user.token;
              this.$router.push("/");
            }
          },
          (err) => {
            alert(err.message);
          }
        );
      e.preventDefault();
    },
  },
};
</script>

<style scoped>
ion-content {
  --background: url("../assets/background.jpg"), #e7f2e7;
}

ion-card {
  width: 35em;
  height: 25em;
  margin-left: auto !important;
  margin-right: auto !important;
  --background: white !important;
}
ion-card-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-evenly;
}
ion-note {
  padding: 0;
}

.brand {
  width: 200px;
  margin: 5em auto;
}
</style>
