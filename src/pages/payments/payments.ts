import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { ThankyouPage } from '../thankyou/thankyou';

import { ApiBackendService } from '../../providers/apiBackendService';
import { AuthUserService } from '../../providers/authUserService';

/**
 * Generated class for the PaymentsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-payments',
  templateUrl: 'payments.html',
})
export class PaymentsPage {
   orderInfo: any= {};
   cartInfo: any= {};
   selectedPaymentMethod: any = '';
   fromCheckout: boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, private apiBackendService: ApiBackendService,  public loadingCtrl: LoadingController, public storage: Storage) {
	  if(this.navParams.get("orderInfo")!= undefined) {
		  this.fromCheckout = true;
		  this.orderInfo = this.navParams.get("orderInfo");
		  this.cartInfo = this.navParams.get("cartInfo");
		  console.log("this.orderInfo:: ", this.orderInfo);
		  	  this.selectedPaymentMethod = 'cash';
	  }
  }
  selectPayMethod(pay_method) {
	  this.selectedPaymentMethod = pay_method;
  }
  proceedToPay() {
	  
	  let loading = this.loadingCtrl.create({
		content: 'Please wait...'
	  });
	  loading.present();
	 this.apiBackendService.processCartDetails(this.cartInfo).then((result: any) => {         
		loading.dismiss();
		if(result.message == 'ok') {
			this.storage.set("cart", null);
			this.storage.set("cartAddonItems", null);
			let order_info: any = result;
			
				this.navCtrl.push(ThankyouPage, {orderInfo: order_info});  
		}
		  
		}, (err) => { 
		console.log(err); 
		});
	  
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad PaymentsPage');
  }

}
