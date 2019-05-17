import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Platform, ViewController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Device } from '@ionic-native/device';

import { ApiBackendService } from '../../providers/apiBackendService';
import { AuthUserService } from '../../providers/authUserService';
import { OrderprocessingPage } from '../orderprocessing/orderprocessing';

import * as firebase from 'firebase';
import { TabsPage } from '../tabs/tabs';
/**
 * Generated class for the FaqPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var google: any;
@IonicPage()
@Component({
  selector: 'page-thankyou',
  templateUrl: 'thankyou.html',
})
export class ThankyouPage {
	@ViewChild('map') mapElement: ElementRef;
	map: any;
	tabBarElement: any;
	shownGroup = null;
	diseases = [];
	userInfo: any = {};
	

  constructor(public navCtrl: NavController, public navParams: NavParams, public apiBackendService: ApiBackendService, private authUserService: AuthUserService,  public loadingCtrl: LoadingController, public viewCtrl: ViewController) {
  }

  ionViewWillEnter() {	  	 	      
    
      this.authUserService.getUser().then((user)=>{
          console.log("user:: ", user);
          if(user != null && user != undefined) {
              this.userInfo = user;
             // this.loadFaq();
          }         
          
      });
      
      

  }

  backButtonAction(){
	  
     this.navCtrl.push(OrderprocessingPage);
	}
	
	dismiss() {
   
	this.viewCtrl.dismiss();
  }

}

