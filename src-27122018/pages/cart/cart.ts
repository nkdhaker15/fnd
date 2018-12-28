import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AddaddressPage } from '../addaddress/addaddress';
import { OffersPage } from '../offers/offers';

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
   tabBarElement: any;
  total: any =0;
  grandTotal: any=0;
  totalItems: number = 0;
  deliveryCharge: any = 0;
  totalDiscount: any = 0;
  showEmptyCartMessage: boolean = false;
 cartitem
 = [{ name: "Manish Garg"},{ name: "Ram Kumar"},{ name: "Rakesh"},{ name: "Mohan"},{ name: "Amit Sharma"}];
  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public viewCtrl: ViewController, public toastController: ToastController) {
	     this.total = 0.0;
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    this.storage.ready().then(()=>{

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
  calculateTotals() {
	  this.totalItems = this.cartItems.length;
	  this.total = 0;
	  this.deliveryCharge = 0;
	  this.totalDiscount = 0;
	  this.grandTotal = 0;
	   this.cartItems.forEach( (item, index)=> {

            
              this.total = this.total + (item.amount * item.qty)
            this.grandTotal = this.total + this.deliveryCharge - this.totalDiscount;

          });
		  
  }
  lineTotal(item: any) {
	 return (item.amount * item.qty);
  }
  ionViewDidLoad() {
	  this.tabBarElement.style.display = 'none';
    console.log('ionViewDidLoad CartPage');
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

    if(change < 0 && item.qty == 1){
      return;
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
	
	this.changeQty(this.cartItems[index], index, -1);
 }
clickaddadress()
{
	this.navCtrl.push(AddaddressPage);
	
}

checkout() {
	
}
clickpromocode()
{
	this.navCtrl.push(OffersPage);
	
}
}
