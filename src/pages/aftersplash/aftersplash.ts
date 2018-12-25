import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { StatusBar } from '@ionic-native/status-bar';

/*import { Geolocation } from '@ionic-native/geolocation';*/
/*import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder';*/

import { ApiBackendService } from '../../providers/apiBackendService';
import { AuthUserService } from '../../providers/authUserService';

import { TabsPage } from '../tabs/tabs';
import { DetectlocationPage } from '../detectlocation/detectlocation';

/**
 * Generated class for the AftersplashPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-aftersplash',
  templateUrl: 'aftersplash.html',
})
export class AftersplashPage {
  imageBaseUrl: any;
   slideImages: any;
  constructor(public navCtrl: NavController, public navParams: NavParams,public statusBar: StatusBar, public apiBackendService: ApiBackendService,  public loadingCtrl: LoadingController, private authUserService: AuthUserService) {
	     statusBar.hide();
  }
 
  ionViewDidLoad() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();  
      this.authUserService.getUser().then((user)=>{
          console.log("user:: ", user);
          if(user != null && user != undefined) {
              this.navCtrl.setRoot(TabsPage);
          }         
          
      });
    this.apiBackendService.getSliders().then((slides: any)=>{
		   
		   if(slides != undefined) {
			  this.slideImages = slides.results;
			  this.imageBaseUrl = slides.imageurl;
			  //console.log('slides:: ', this.slideImages);
       }
       loading.dismiss();
		});
    console.log('ionViewDidLoad AftersplashPage');
  }
   openregister(){
	 //  this.navCtrl.push(SignupPage);  
  }
   openlogin(){  
	   this.navCtrl.push(LoginPage);
  }
  detectLocation() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
   // loading.present();
      /*this.geolocation.getCurrentPosition().then((resp: any) => {
          console.log("resp latitude:: ", resp.coords.latitude);
          console.log("resp longitude:: ", resp.coords.longitude);
          
          
            
              //loading.dismiss();
         // resp.coords.latitude
         // resp.coords.longitude
        }).catch((error) => {
          console.log('Error getting location', error);
          loading.dismiss();
        });*/

        /*let watch = this.geolocation.watchPosition();
        watch.subscribe((data) => {
         // data can be a set of coordinates, or an error (if an error occurred).
         // data.coords.latitude
         // data.coords.longitude
        });*/
  }    
entermanuallocation()
  {
   this.navCtrl.push(DetectlocationPage);	    
  }    
}
