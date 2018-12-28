import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ViewController, ToastController, ModalController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ApiBackendService } from '../../providers/apiBackendService';
import { AuthUserService } from '../../providers/authUserService';
import { CartPage } from '../cart/cart';
import { ProductChildPage } from '../product-child/product-child';

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
 tabBarElement: any;
 productList: any = [];
 sellerInfo: any = {};
 product_image_path: any = '';
 cartItemsIds: any = [];
 cartItems: any = []; 
 carttotalamount: any =0;
  constructor(public navCtrl: NavController, public navParams: NavParams, public apiBackendService: ApiBackendService, private authUserService: AuthUserService,  public loadingCtrl: LoadingController, public storage: Storage, public viewCtrl: ViewController, public toastController: ToastController, public modalCtrl: ModalController) {
     this.sellerInfo = this.navParams.get("sellerInfo");
	 this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
 }

  ionViewDidLoad() {
	  this.tabBarElement.style.display = 'none';
    console.log('ionViewDidLoad RmenuPage');
  }
    ionViewWillUnload() {
	  //this.tabBarElement.style.display = 'block';
    console.log('ionViewDidLoad RmenuPage');
  }
  ionViewWillEnter() {	  	 	      
       this.getCartItems();
      this.authUserService.getUser().then((user)=>{
          console.log("user:: ", user);
          if(user != null && user != undefined) {
              this.userInfo = user;
          }         
          
      });
      
                    this.loadProducts();


  }
  viewcart()
  {
	  
	  this.navCtrl.push(CartPage);
  } 
  
  openProductChildModal(product) {
   let childModal = this.modalCtrl.create(ProductChildPage, { productInfo: product });
   childModal.onDidDismiss(data => {
     console.log(data);
	 if(data != null) {
		this.addToCart(product, data.pmp_net_price, data.pmp_id, data.unit_name); 
	 }
   });
   childModal.present();
 }
   
  addToCart(product, amount, variationId, variationLabel) {
	  this.storage.get("cart").then((data) => {
		  if(product.qty == undefined) {
			  product.qty = 1;
		  }
		   if (data == undefined || data.length == 0) {
				data = [];

				data.push({
				  "product": product,
				  'variation_id': variationId, 
				  'variation_label': variationLabel, 
				  "qty": product.qty,
				  "amount": parseFloat(amount)
				});
		   }else {
			   let foundStatus: boolean = false;
			   let foundIndex = 0;
			   for(let d=0; d < data.length; d++) {
				   if(data[d].product.product_id == product.product_id  && variationId == data[d].variation_id) {
					   foundStatus = true;
					   foundIndex = d;
				   }
			   }
			   
			   if(!foundStatus) {
					   data.push({
						  "product": product,
						  'variation_id': variationId,
						  'variation_label': variationLabel, 
						  "qty": product.qty,
						  "amount": parseFloat(amount)
						});
				   }else {
					   
					  data[foundIndex].qty = product.qty;
					  data[foundIndex].amount = parseFloat(amount);
					   
				   }
		   }
		      if(this.cartItemsIds.indexOf(product.product_id)==-1) {
				  this.cartItemsIds.push(product.product_id);
			  }
		     this.storage.set("cart", data).then(() => {
				console.log("Cart Updated");
				console.log(data);

				/*this.toastController.create({
				  message: "Cart Updated",
				  duration: 3000
				}).present();
*/
	              this.getCartItems();

			  });
	  });
  }
  
  getCartItems() {
	    this.storage.ready().then(()=>{

      this.storage.get("cart").then( (data)=>{
		  if(data == null) {
			  data = [];
		  }
		  this.cartItemsIds = [];
        this.cartItems = data;
        console.log(this.cartItems);

        if(this.cartItems.length > 0){

          this.cartItems.forEach( (item, index)=> {
             this.cartItemsIds.push(item.product.product_id);
this.carttotalamount =parseFloat(parseFloat(this.carttotalamount)+parseFloat(item.product.pmb_selling_price));

		});
		}

    });
    });
  }
  increment(index) {
	  
		this.productList[index].qty++;
	this.addToCart(this.productList[index],this.productList[index].pmp_net_price,0,'');
    
 }
  decrement(index) {
	  if(this.productList[index].qty > 1) {
		this.productList[index].qty--;
		
	}
//	this.addToCart(productItem,productItem.pmp_net_price, 0, '')
	this.addToCart(this.productList[index],this.productList[index].pmp_net_price,0,'');
 }
getItemQty(index: any) {
	if(this.productList[index].qty == undefined) {
		this.productList[index].qty = 1;
	}
	return this.productList[index].qty;
} 
isItemQty(product: any) {
    let status = false;
	
	if(this.cartItemsIds.indexOf(product.product_id) !=-1) {
		status = true;
	}
	return status;
}
loadProducts() {
    
    let user_req = {
              seller_id: this.sellerInfo.seller_id
             // seller_id: 46 
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
backButtonAction(){
     this.navCtrl.pop();
	}
}