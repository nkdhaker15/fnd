import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AddaddressPage } from '../addaddress/addaddress';
import { OffersPage } from '../offers/offers';

import { ApiBackendService } from '../../providers/apiBackendService';
import { AuthUserService } from '../../providers/authUserService';
/**
 * Generated class for the CartPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html',
})
export class CartPage {
private currentNumber = 1;
  cartItems: any = [];
  addonItems: any = [];
  cartAddonItems: any = [];
  addonImagePath: any = '';
   tabBarElement: any;
  total: any =0;
  addonTotal: any =0;
  grandTotal: any=0;
  totalItems: number = 0;
  deliveryCharge: any = 0;
  totalDiscount: any = 0;
  cartAddontotalamount: any = 0;
  sellerInfo: any = {};
  userInfo: any = {};
  showEmptyCartMessage: boolean = false;
 showaddadressbutton:boolean=false;
 cartitem
 = [{ name: "Manish Garg"},{ name: "Ram Kumar"},{ name: "Rakesh"},{ name: "Mohan"},{ name: "Amit Sharma"}];
  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public viewCtrl: ViewController, public toastController: ToastController, public apiBackendService: ApiBackendService, private authUserService: AuthUserService,  public loadingCtrl: LoadingController) {
	     this.total = 0.0;
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    this.storage.ready().then(()=>{
	  this.storage.get("sellerInfo").then( (data)=> {
		if(data != null) {
			this.sellerInfo = data;
		}
		console.log("this.sellerInfo :: ", this.sellerInfo);
	});
	this.storage.get("cartAddonItems").then( (data)=> {
		if(data != null) {
			this.cartAddonItems = data;
		}
		console.log("this.cartAddonItems :: ", this.cartAddonItems);
	});
      this.storage.get("cart").then( (data)=>{
		if(data == null) {
			data = [];
		}  
        this.cartItems = data;
        console.log(this.cartItems);
      
        if(this.cartItems.length > 0){
			
           this.calculateTotals();

        } else {

          this.showEmptyCartMessage = true;

        }


      });

    }); 
	  
  }
  addAddonToCart(addon, amount, index) {
	  this.storage.get("cartAddonItems").then((data) => {
		  if(addon.qty == undefined || addon.qty < 1) {
			  addon.qty = 1;
		  }
		   if (data == undefined || data.length == 0) {
				data = [];

				data.push({
				  "addon": addon,				  
				  "qty": addon.qty,
				  "amount": parseFloat(amount)
				});
		   }else {
			   let foundStatus: boolean = false;
			   let foundIndex = 0;
			   for(let d=0; d < data.length; d++) {
				   if(data[d].addon.ap_id == addon.ap_id) {
					   foundStatus = true;
					   foundIndex = d;
				   }
			   }
			   
			   if(!foundStatus) {
					   data.push({
						  "addon": addon,						  
						  "qty": addon.qty,
						  "amount": parseFloat(amount)
						});
				   }else {
					   
					  data[foundIndex].qty = addon.qty;
					  data[foundIndex].amount = parseFloat(amount);
					   
				   }
		   }
		   //this.addonItems[index] = addon;
		     this.cartAddonItems = data;
			 console.log("this.cartAddonItems:: ", this.cartAddonItems);
		     this.storage.set("cartAddonItems", data).then(() => {
                this.calculateTotals();
                  
			  });
	  });
  }
  addonInCart(item: any) {
	  let status: any = false;
		for(let i = 0; i < this.cartAddonItems.length; i++) {
			if(this.cartAddonItems[i].addon.ap_id == item.ap_id) {
				status = true;
			}
		}
		return status;
  }
  loadAddons() {
    
    let user_req = {
              seller_type: this.sellerInfo.seller_type			 
             // seller_id: 46 
          };
		  if(this.userInfo != null) {
			user_req['user_id'] = this.userInfo.user_id;  
		  }
		   
         let loading = this.loadingCtrl.create({
                content: 'Please wait...'
              });
              loading.present();
         this.apiBackendService.getCartAddon(user_req).then((result: any) => { 
				 loading.dismiss();
				     console.log('manish:',result);

				 this.addonImagePath = result.addon_image_url;
				 if(result.address_status==0)
				 {
									 this.showaddadressbutton = true;
 
					 
				 }
				this.addonItems = result.addons;
				if(this.addonItems.length == 0) {
					 this.addonTotal = 0; 
				}else {
						this.cartAddonItems.forEach( (item, index)=> {
							 this.addonItems.forEach( (addonItem, addonItemIndex)=> {
								 if(addonItem.ap_id == item.addon.ap_id) {
									  this.addonItems[addonItemIndex].qty = item.qty;
								}
							
							});
						});
						this.calculateTotals();
						console.log("this.addonItems:: ", this.addonItems);
				}
            }, (err) => { 
            console.log(err); 
             loading.dismiss();
            });
}
  calculateTotals() {
	  this.totalItems = this.cartItems.length;
	  this.total = 0;
	  this.addonTotal = 0;
	  this.deliveryCharge = 0;
	  this.totalDiscount = 0;
	  this.grandTotal = 0;
	   this.cartItems.forEach( (item, index)=> {

            
              this.total = this.total + (item.amount * item.qty)
            this.grandTotal = this.total + this.deliveryCharge - this.totalDiscount;

          });
		  
		   this.cartAddonItems.forEach( (item, index)=> {            
              this.addonTotal = this.addonTotal + (item.amount * item.qty)
            this.grandTotal = this.total + this.deliveryCharge - this.totalDiscount + this.addonTotal;

          });
  }
  lineTotal(item: any) {
	 return (item.amount * item.qty);
  }

  addonLineTotal(item: any) {
	 return (item.amount * item.qty);
  }
  ionViewDidLoad() {
	  this.tabBarElement.style.display = 'none';
    console.log('ionViewDidLoad CartPage');
	     this.authUserService.getUser().then((user)=>{
          console.log("user:: ", user);
          if(user != null && user != undefined) {
              this.userInfo = user;
          }
          this.loadAddons();		  
          
      });
  }
   removeFromCart(item, i){

    let price;    
     price = item.amount;
    
    let qty = item.qty;

    this.cartItems.splice(i, 1);

    this.storage.set("cart", this.cartItems).then( ()=> {

     // this.total = this.total - (price * qty);

    });

    if(this.cartItems.length == 0){
      this.showEmptyCartMessage = true;
    }

     this.calculateTotals();
  }

   
  changeQty(item, i, change){

    let price;
      price = parseFloat(item.amount);
    
    let  qty = item.qty;
    if(change == -2) {
		this.removeFromCart(item, i);
		return ;
	}
    if(change < 0 && item.qty == 1){
      return ;
	  

    }

    qty = qty + change;
    item.qty = qty;
    //item.amount = qty * price;

    this.cartItems[i] = item;

    this.storage.set("cart", this.cartItems).then( ()=> {

      this.toastController.create({
        message: "Cart Updated.",
        duration: 2000,
        showCloseButton: true
      }).present();

    });

    this.calculateTotals();


}
  
  increment(index) {
	 
		
		 this.changeQty(this.cartItems[index], index, 1);
		
    
 }
  decrement(index) {
	if(this.cartItems[index].qty <= 1) {
		this.changeQty(this.cartItems[index], index, -2);
	}else {
		this.changeQty(this.cartItems[index], index, -1);
	}
	
 }
 
 addonCartQty(index) {
	 //console.log("this.addonItems[index]:: ", this.addonItems[index]);
	  if(this.addonItems[index] == undefined) {
		 return 1;
	 }else {
		 if(this.addonItems[index].qty == undefined) {
			 this.addonItems[index].qty = 1;
		 }
		 
		 return this.addonItems[index].qty;
	 }
 }
 incrementAddon(addon, index) {
	 this.changeAddonQty(addon, index, 1);
 }
decrementAddon(addon, index) { 
	 console.log("addon:: ", addon);
	 if(addon.qty <= 1) {
			this.changeAddonQty(addon, index, -2);
	 }else {
		 this.changeAddonQty(addon, index, -1);
	 }
	 
 }
 
 changeAddonQty(item, i, change){ 
    if(change == -2) {
		this.removeAddonFromCart(item, i);
		return ;
	}
	let  qty = item.qty;
    if(change < 0 && item.qty == 1){
      return ;
	  

    }

    qty = qty + change;
    item.qty = qty;
    //item.amount = qty * price;

    this.cartAddonItems[i] = item;

    this.storage.set("cartAddonItems", this.cartAddonItems).then( ()=> {      

    });

    this.calculateTotals();


}
   removeAddonFromCart(addonItem, i){

    let price;    
     
    
	this.storage.get("cartAddonItems").then( (data)=>{
		let cartAddonItemsInfo: any = [];
		this.cartAddonItems = [];
        if(data != null) {
			this.cartAddonItems = data;
		}
		
		 this.cartAddonItems.forEach( (item, index)=> {
			 if(addonItem.addon.ap_id == item.addon.ap_id) {
				 
			 }else {
				
				this.cartAddontotalamount = this.cartAddontotalamount+ parseFloat(item.amount);
				cartAddonItemsInfo.push(item);
			 }
			 if(index == (this.cartAddonItems.length-1)) {
				this.storage.set("cartAddonItems", cartAddonItemsInfo).then( ()=> {
					this.cartAddonItems = cartAddonItemsInfo;
					this.calculateTotals();
				});
			 }

		});
		
    });

   
}
clickaddadress()
{
	this.navCtrl.push(AddaddressPage);
	
}

checkout() {
	 let cartInfo = {
		 user_id: this.userInfo.user_id, ab_id: 1,discount_amount: 0,coupon_id: 0,payment_mode:'cod',grand_total: this.grandTotal,resto_id: this.sellerInfo.seller_id,
		 cartItems: this.cartItems, 
		 cartAddons: this.cartAddonItems 
	 };
    console.log("cartInfo:: ", cartInfo);
     this.apiBackendService.processCartDetails(cartInfo).then((result: any) => {         
        
          
        }, (err) => { 
        console.log(err); 
        });
}
clickpromocode()
{
	this.navCtrl.push(OffersPage);
	
}
}
