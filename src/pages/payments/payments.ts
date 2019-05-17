import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ModalController ,AlertController} from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { ThankyouPage } from '../thankyou/thankyou';
import { OrderprocessingPage } from '../orderprocessing/orderprocessing';
import { HomePage } from '../home/home';

import { ApiBackendService } from '../../providers/apiBackendService';
import { AuthUserService } from '../../providers/authUserService';
import { InAppBrowser ,InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';

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
	options : InAppBrowserOptions = {
    location : 'yes',//Or 'no' 
    hidden : 'no', //Or  'yes'
    clearcache : 'yes',
    clearsessioncache : 'yes',
    zoom : 'yes',//Android only ,shows browser zoom controls 
    hardwareback : 'yes',
    mediaPlaybackRequiresUserAction : 'no',
    shouldPauseOnSuspend : 'no', //Android only 
    closebuttoncaption : 'Close', //iOS only
    disallowoverscroll : 'no', //iOS only 
    toolbar : 'yes', //iOS only 
    enableViewportScale : 'no', //iOS only 
    allowInlineMediaPlayback : 'no',//iOS only 
    presentationstyle : 'pagesheet',//iOS only 
    fullscreen : 'yes',//Windows only    
};
browserref:any='';
   orderInfo: any= {};
   cartInfo: any= {};
   selectedPaymentMethod: any = '';
   fromCheckout: boolean = false;
   totalitem:any=0;
  constructor(public navCtrl: NavController, public navParams: NavParams, private apiBackendService: ApiBackendService,  public loadingCtrl: LoadingController, public storage: Storage, public modalCtrl: ModalController,private iab: InAppBrowser, private alertCtrl: AlertController) {
	  if(this.navParams.get("orderInfo")!= undefined) {
		  this.fromCheckout = true;
		  this.orderInfo = this.navParams.get("orderInfo");
		  this.cartInfo = this.navParams.get("cartInfo");
		  this.totalitem = this.cartInfo.cartAddons.length + this.cartInfo.cartItems.length;
		  console.log("this.orderInfo:: ", this.orderInfo);
		 if(this.cartInfo['cash_on_block']==0 && this.cartInfo['cash_on_block_amount']==0)
	  { 	  this.selectedPaymentMethod = 'cash';
			  this.cartInfo['payment_mode']=this.selectedPaymentMethod;
	  }else{
		  
		 this.selectedPaymentMethod = 'paytm';
			  this.cartInfo['payment_mode']=this.selectedPaymentMethod;  
	  }
	  }
  }
  selectPayMethod(pay_method) {
	  /*this.selectedPaymentMethod = pay_method;*/
	  if(this.cartInfo['cash_on_block']==0)
	  {
	  this.selectedPaymentMethod = pay_method;
	  this.cartInfo['payment_mode'] =this.selectedPaymentMethod;
	  }else{
		 this.selectedPaymentMethod = 'paytm';
	  this.cartInfo['payment_mode'] ='paytm'; 
		  
	  }
  }
  proceedToPay() {
	  
	  let loading = this.loadingCtrl.create({
		content: 'Please wait...'
	  });
	  loading.present();
	 this.apiBackendService.processCartDetails(this.cartInfo).then((result: any) => {         
		loading.dismiss();
		if(result.message == 'ok') {
		let order_info: any = result;
			//let childModal = this.modalCtrl.create(ThankyouPage, {orderInfo: order_info});
			   /*childModal.onDidDismiss(data => {				 
				   this.navCtrl.push(OrderprocessingPage, {orderInfo: order_info}); 
			   });*/
			//   childModal.present();
				 if(order_info.payment_url!='')
				 {
	const browser = this.iab.create(order_info.payment_url,'_self','location=no');

	
			
	browser.on('loadstop').subscribe((event)=> {

  let param =event.url; //Read the parameters from the url


  if (param=='http://foodndrinks.in/webapi/orders/thankyou') { //Check parameters agaist the payment gateway response url
    //browser.close(); // colse the browser
this.storage.set("cart", null);
		this.storage.set("cartAddonItems", null);
		this.storage.set("orderInProcessing", order_info);
		 //this.navCtrl.push(ThankyouPage, {orderInfo: order_info}); 
		 this.navCtrl.setRoot(HomePage);
   console.log('this is fine');
  }else{
	     console.log('this is Not fine' +param);

  }
});
browser.on('exit').subscribe(()=> {
this.storage.get("orderInProcessing").then( (data)=>{
		//console.log(data,'test');
		  if(data == null) {
			 // this.orderprocesStatus = false;
		  }else {
			 // this.orderprocesStatus = true;
			//  this.loadCurrentStatus(data.order_id);
		  }
    });
});
		/*browserref.addEventListener('loadstart', function(event) {

  var param = getParameters(event.url); //Read the parameters from the url


  if (param=='https://shopkiee.com/project/fandd/webapi/orders/thankyou') { //Check parameters agaist the payment gateway response url
    browserRef.close(); // colse the browser

   console.log('this is fine');
  }
});*/
				 }else{
						this.storage.set("cart", null);
		this.storage.set("cartAddonItems", null);
		this.storage.set("orderInProcessing", result);
		 this.navCtrl.push(ThankyouPage, {orderInfo: order_info}); 
					 
				 }

		}
		  
		}, (err) => { 
		console.log(err); 
		});
	  
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad PaymentsPage');
  }
  
  openbrowser()
  {
	 // let browser = this.iab.create('https://ionicframework.com/');
  }

}
