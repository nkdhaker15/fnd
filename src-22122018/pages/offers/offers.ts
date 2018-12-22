import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';


import { ApiBackendService } from '../../providers/apiBackendService';
import { AuthUserService } from '../../providers/authUserService';

/**
 * Generated class for the OffersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-offers',
  templateUrl: 'offers.html',
})
export class OffersPage {
	  tabBarElement: any;
    userOffers: any = [];
    userInfo: any = {};
  constructor(public navCtrl: NavController, public navParams: NavParams, public apiBackendService: ApiBackendService, private authUserService: AuthUserService,  public loadingCtrl: LoadingController) {
	  	  	  	  	      this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
  }
  ionViewWillEnter() {	  	 	      
    
      this.authUserService.getUser().then((user)=>{
          console.log("user:: ", user);
          if(user != null && user != undefined) {
              this.userInfo = user;
              this.loadOffers();
          }         
          
      });
      
      

  }
loadOffers() {
    
    let user_req = {
              user_id: this.userInfo.user_id
          };
         let loading = this.loadingCtrl.create({
                content: 'Please wait...'
              });
              loading.present();
         this.apiBackendService.getUserOffers(user_req).then((result: any) => { 
             loading.dismiss();             
            this.userOffers = result.result;

            }, (err) => { 
            console.log(err); 
             loading.dismiss();
            });
}    

  ionViewDidLoad() {
	  	  	  	  	      this.tabBarElement.style.display = 'none';
    console.log('ionViewDidLoad OffersPage');
  }

}
