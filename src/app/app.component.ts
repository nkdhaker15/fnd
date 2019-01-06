import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';


import { AftersplashPage } from '../pages/aftersplash/aftersplash';
import { LoginPage } from '../pages/login/login';

import * as firebase from 'firebase';

const configFirebase = {
    apiKey: "AIzaSyCeHvdXiSNzIHpyYIy33aYA1CszI-V1mlU",
    authDomain: "food-and-drink-226310.firebaseapp.com",
    databaseURL: "https://food-and-drink-226310.firebaseio.com",
    projectId: "food-and-drink-226310",
    storageBucket: "food-and-drink-226310.appspot.com",
    messagingSenderId: "932547603099"
  };
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  	
  rootPage:any = AftersplashPage;
  //rootPage:any = LoginPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
	firebase.initializeApp(configFirebase);
  }
}
