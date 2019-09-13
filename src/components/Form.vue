<template>
  <div class="ion-page">
    <ion-content fullscreen padding>
      <form onsubmit="processForm(event)">
        <ion-grid padding>
          <ion-row class="ion-justify-content-center">
            <ion-col size="6" offset="3">
              <a href="/">
                <ion-img :src="'../img/logo-original-vector.svg'" />
              </a>
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col size="6" offset="3">
              <ion-list lines="full" class="ion-no-margin ion-no-padding">
                <ion-item>
                  <ion-label position="stacked">Voornaam <ion-text color="danger">*</ion-text></ion-label>
                  <ion-input required type="text" oninput="handleFirstNameValue(event)"></ion-input>
                </ion-item>

                <ion-item>
                  <ion-label position="stacked">Achternaam <ion-text color="danger">*</ion-text></ion-label>
                  <ion-input required type="text" oninput="handleLastNameValue(event)"></ion-input>
                </ion-item>

                <ion-item>
                  <ion-label position="stacked">Address</ion-label>
                  <ion-input placeholder="Straat en huisnummer"></ion-input>
                  <ion-input placeholder="Postcode"></ion-input>
                  <ion-input placeholder="Plaats"></ion-input>
                </ion-item>

                <ion-item>
                  <ion-label position="stacked">E-mailadres<ion-text color="danger">*</ion-text></ion-label>
                  <ion-input placeholder="E-mailadres"></ion-input>
                </ion-item>
                <ion-item>
                  <ion-label position="stacked">Telefoon (optioneel)</ion-label>
                  <ion-input placeholder="Telefoon"></ion-input>
                </ion-item>

                <ion-item>
                  <ion-label position="stacked">Bestelnotities (optioneel)</ion-label>
                  <ion-textarea></ion-textarea>
                </ion-item>
              </ion-list>

            </ion-col>
          </ion-row>
          <ion-row class="ion-justify-content-center">
            <ion-col size="6" offset="3">
              <div class="ion-padding">
                <ion-button size="large" type="submit" class="ion-no-margin">Betalen</ion-button>
              </div>
            </ion-col>
          </ion-row>
        </ion-grid>

      </form>
    </ion-content>
    <ion-alert-controller></ion-alert-controller>
  </div>
</template>

<style scoped>
  ion-img {
    width:200px;
  }
</style>