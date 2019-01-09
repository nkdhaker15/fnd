import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ViewController } from 'ionic-angular';
import { FormBuilder, FormGroup } from '@angular/forms';

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
	  offerForm: FormGroup;
	  tabBarElement: any;
    userOffers: any = [];
    userInfo: any = {};
	inputPromoCode: any ='';
	selectedCouponInfo: any = null;
	constructor(public navCtrl: NavController, public navParams: NavParams, public apiBackendService: ApiBackendService, private authUserService: AuthUserService,  public loadingCtrl: LoadingController, public viewCtrl: ViewController, private formBuilder: FormBuilder) {
	  	  	  	  	      this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
						  this.offerForm = this.formBuilder.group({
							  coupon_name: ['']
							});
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
  applyPromoCodeId(couponInfo)
{
	this.selectedCouponInfo = couponInfo;
	this.dismiss();
	
}
setPromoCode(code: any) {
	this.inputPromoCode = code;
}
  applyPromoCode()
{
	this.selectedCouponInfo = {coupon_name: this.offerForm.value.coupon_name};
	this.dismiss();
	
}
dismiss() {
   
   this.viewCtrl.dismiss(this.selectedCouponInfo);
  }

}
