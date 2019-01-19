import { Component } from '@angular/core';
import { Platform, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Network } from '@ionic-native/network';

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
 
  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private network: Network, private alertCtrl: AlertController) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
	  console.log("this.network:: ", this.network.type);
	  if(this.network.type == 'none') {
		  this.showAlertForNetworkOff();
	  }
	  let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
		  console.log('network was disconnected :-(');
			this.showAlertForNetworkOff();			
		});

		// stop disconnect watch
		//disconnectSubscription.unsubscribe();
    });
	firebase.initializeApp(configFirebase);
  } 
  showAlertForNetworkOff() {
	  let alert: any = this.alertCtrl.create({
                title: 'No Internet Connection',
                subTitle: "Please check your internet connection",
                buttons: ['Dismiss']
              });
					 alert.present();
  }
}
