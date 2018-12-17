import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ViewController, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ApiBackendService } from '../../providers/apiBackendService';
import { AuthUserService } from '../../providers/authUserService';

/**
 * Generated class for the RmenuPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-rmenu',
  templateUrl: 'rmenu.html',
})
export class RmenuPage {

rmenu
 = [{ name: "Signature Premier Grain"},{ name: "All Seasons"},{ name: "Heineken Lager Beer Wit"},{ name: "Signature Premier Grain"},{ name: "All Seasons"}];
 userInfo: any = {};
 productList: any = [];
 sellerInfo: any = {};
 product_image_path: any = '';
  constructor(public navCtrl: NavController, public navParams: NavParams, public apiBackendService: ApiBackendService, private authUserService: AuthUserService,  public loadingCtrl: LoadingController, public storage: Storage, public viewCtrl: ViewController, public toastController: ToastController) {
     this.sellerInfo = this.navParams.get("sellerInfo");
 }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RmenuPage');
  }
  ionViewWillEnter() {	  	 	      
    
      this.authUserService.getUser().then((user)=>{
          console.log("user:: ", user);
          if(user != null && user != undefined) {
              this.userInfo = user;
              this.loadProducts();
          }         
          
      });
      
      

  }
  addToCart(product) {
	  this.storage.get("cart").then((data) => {
		   if (data == undefined || data.length == 0) {
				data = [];

				data.push({
				  "product": product,
				  "qty": product.qty,
				  "amount": parseFloat(product.product_net_price)
				});
		   }else {
			   let foundStatus: boolean = false;
			   let foundIndex = 0;
			   for(let d=0; d < data.length; d++) {
				   if(data[d].product.product_id == product.product_id) {
					   foundStatus = true;
					   foundIndex = d;
				   }
			   }
			   
			   if(!foundStatus) {
					   data.push({
						  "product": product,
						  "qty": product.qty,
						  "amount": parseFloat(product.product_net_price)
						});
				   }else {
					   
					  data[foundIndex].qty = product.qty;
					   
				   }
		   }
		   
		     this.storage.set("cart", data).then(() => {
				console.log("Cart Updated");
				console.log(data);

				this.toastController.create({
				  message: "Cart Updated",
				  duration: 3000
				}).present();

			  });
	  });
  }
  increment(index) {
	  
		this.productList[index].qty++;
    
 }
  decrement(index) {
	  if(this.productList[index].qty > 1) {
		this.productList[index].qty--;
	}
 }
getItemQty(index: any) {
	if(this.productList[index].qty == undefined) {
		this.productList[index].qty = 1;
	}
	return this.productList[index].qty;
}  
loadProducts() {
    
    let user_req = {
              /*seller_id: this.sellerInfo.seller_id*/
              seller_id: 46
          };
         let loading = this.loadingCtrl.create({
                content: 'Please wait...'
              });
              loading.present();
         this.apiBackendService.getProductListInfo(user_req).then((result: any) => { 
             loading.dismiss();
             this.product_image_path = result.product_image;
            this.productList = result.result;
				console.log("this.productList:: ", this.productList);
            }, (err) => { 
            console.log(err); 
             loading.dismiss();
            });
}

}
