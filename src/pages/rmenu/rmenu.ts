import { Component, NgZone, ChangeDetectorRef, ViewChild    } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ViewController, ToastController, ModalController, AlertController ,Content, Slides } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ApiBackendService } from '../../providers/apiBackendService';
import { AuthUserService } from '../../providers/authUserService';
import { CartPage } from '../cart/cart';
import { ProductChildPage } from '../product-child/product-child';
import { TabsPage } from '../tabs/tabs';
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
 @ViewChild('myContent') content: Content;
 @ViewChild('catTabSlides') catSlides: Slides;

rmenu
 = [{ name: "Signature Premier Grain"},{ name: "All Seasons"},{ name: "Heineken Lager Beer Wit"},{ name: "Signature Premier Grain"},{ name: "All Seasons"}];
 userInfo: any = {};
 tabBarElement: any;
 productList: any = [];
 sellerInfo: any = {};
 product_image_path: any = '';
 cartItemsIds: any = [];
 cartItems: any = []; 
 selectedCategoryId: any =0;
 carttotalamount: any =0;
 category_list:any= [];
 allresult:any = [];
 subHeaderShow: boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, public apiBackendService: ApiBackendService, private authUserService: AuthUserService,  public loadingCtrl: LoadingController, public storage: Storage, public viewCtrl: ViewController, public toastController: ToastController, public modalCtrl: ModalController, private alertCtrl: AlertController, public zone: NgZone, private cd: ChangeDetectorRef) {
     this.sellerInfo = this.navParams.get("sellerInfo");
	 this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
	
 }

  ionViewDidLoad() {
	  this.tabBarElement.style.display = 'none';
    
	
  }
  filterData(catId) {
	  this.selectedCategoryId = catId;
	  let todayItem = document.getElementById('cat_div_'+catId);
	  
	  if(this.content != null && this.content != undefined) {
		  if(catId ==0) {
			  this.content.scrollTo(0, (todayItem.offsetTop-130), 800);
		  }else {
			this.content.scrollTo(0, (todayItem.offsetTop-150), 800);  
		  }
			
	  }
	  
	
  }
   onPageScroll(event) {
	   if(event != null && event != undefined) {
		   this.subHeaderShow = false;
		   if(event.scrollTop > 20) {
			   this.zone.run(()=>{
					   this.subHeaderShow = true;		   
					   
			   });
		   }else {
			   this.zone.run(()=>{
					   this.subHeaderShow = false;		   
					   
			   });
		   }
			   
			   this.cd.detectChanges();
			   if(this.subHeaderShow){
			   setTimeout(()=>{
				this.calculateCatContent(event.scrollTop);
			   }, 300);
			   }
	   }
	 }
	   

    
    ionViewWillUnload() {
	  //this.tabBarElement.style.display = 'block';
    
  }
  ionViewWillEnter() {	  	 	      
       this.getCartItems();
      this.authUserService.getUser().then((user)=>{
          
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
     
	 if(data != null) {
		this.addToCart(product, data.pmp_net_price, data.pmp_id, data.unit_name); 
	 }
   });
   childModal.present();
 }
   
  addToCart(product, amount, variationId, variationLabel) {
	   this.storage.get("sellerInfo").then( (data)=> {
		if(data != null) {
			if(data.seller_id != this.sellerInfo.seller_id) {
				this.presentConfirm(this.sellerInfo,  data);
			}
		}else {
			this.storage.set("sellerInfo",  this.sellerInfo);
		}
		
	});
	  this.storage.get("cart").then((data) => {
		  if(product.qty == undefined || product.qty < 1) {
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
				  /* if(data[d].product.product_id == product.product_id  && variationId == data[d].variation_id) {*/
				   if(data[d].product.product_id == product.product_id) {
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
this.carttotalamount=0;
      this.storage.get("cart").then( (data)=>{
		  if(data == null) {
			  data = [];
		  }
		  this.cartItemsIds = [];
        this.cartItems = data;
        

        if(this.cartItems.length > 0){

          this.cartItems.forEach( (item, index)=> {
             this.cartItemsIds.push(item.product.product_id);
this.carttotalamount =parseFloat(this.carttotalamount)+ parseFloat(item.amount);

		});
		}

    });
    });
  }
  
   incrementCatItem(index, catId) {
	  
		this.allresult[catId][index].qty++;
	this.changeProductQtyToCart(this.allresult[catId][index]);
    
 }
 
  increment(index) {
	  
		this.productList[index].qty++;
	this.changeProductQtyToCart(this.productList[index]);
    
 }
  decrementCatItem(index, catId) {
	  /*if(this.productList[index].qty > 1) {*/
		this.allresult[catId][index].qty--;
		
	/*}*/
//	this.addToCart(productItem,productItem.pmp_net_price, 0, '')
    if(this.allresult[catId][index].qty < 1) {
		this.removeFromCart(this.allresult[catId][index], index);
		this.allresult[catId][index].qty = 1;
	}else {

		this.changeProductQtyToCart(this.allresult[catId][index]);
	}
	
 }
 
 decrement(index) {
	  /*if(this.productList[index].qty > 1) {*/
		this.productList[index].qty--;
		
	/*}*/
//	this.addToCart(productItem,productItem.pmp_net_price, 0, '')
    if(this.productList[index].qty < 1) {
		this.removeFromCart(this.productList[index], index);
		this.productList[index].qty = 1;
	}else {

		this.changeProductQtyToCart(this.productList[index]);
	}
	
 }
   changeProductQtyToCart(product) {
	   this.storage.get("cart").then((data) => {
		  if(product.qty == undefined || product.qty < 1) {
			  product.qty = 1;
		  }
		   
			   let foundStatus: boolean = false;
			   let foundIndex = 0;
			   for(let d=0; d < data.length; d++) {
				   if(data[d].product.product_id == product.product_id) {
					   foundStatus = true;
					   foundIndex = d;
				   }
			   }
			   
			   if(foundStatus) {				   
					   
					  data[foundIndex].qty = product.qty;
					
					   
				   }
		   
		      if(this.cartItemsIds.indexOf(product.product_id)==-1) {
				  this.cartItemsIds.push(product.product_id);
			  }
		     this.storage.set("cart", data).then(() => {
				

				/*this.toastController.create({
				  message: "Cart Updated",
				  duration: 3000
				}).present();
*/
	              this.getCartItems();

			  });
	  });
   }
   removeFromCart(product, i){

    let price;    
     
    this.cartItems.splice(i, 1);
	this.storage.get("cart").then( (data)=>{
		let cartItemsInfo: any = [];
		this.cartItems = [];
        if(data != null) {
			this.cartItems = data;
		}
		this.cartItemsIds = [];
		 this.cartItems.forEach( (item, index)=> {
			 if(product.product_id == item.product.product_id) {
				 
			 }else {
				this.cartItemsIds.push(item.product.product_id);
				this.carttotalamount =parseFloat(this.carttotalamount)+ parseFloat(item.amount);
				cartItemsInfo.push(item);
			 }
			 if(index == (this.cartItems.length-1)) {
				this.storage.set("cart", cartItemsInfo).then( ()=> {
					this.cartItems = cartItemsInfo;
					
				});
			 }

		});
		
    });

   
} 
getItemQty(index: any) {
	if(this.productList[index].qty == undefined) {
		this.productList[index].qty = 1;
	}
	return this.productList[index].qty;
}
getCatItemQty(index: any, cat_id: any) {
	if(this.allresult[cat_id][index].qty == undefined) {
		this.allresult[cat_id][index].qty = 1;
	}
	return this.allresult[cat_id][index].qty;
}  
isItemQty(product: any) {
    let status = false;	
	if(this.cartItemsIds.indexOf(product.product_id) !=-1) {
		status = true;
	}
	return status;
}
presentConfirm(currentSeller, previousSeller) {
  let alert = this.alertCtrl.create({
    title: 'Confirm',
    message: 'Your previous cart will empty. Do you want to proceed?',
    buttons: [
      {
        text: 'No',
        role: 'cancel',
        handler: () => {
          this.sellerInfo = previousSeller;
		   this.loadProducts();
        }
      },
      {
        text: 'Yes',
        handler: () => {
		     this.cartItemsIds = [];
		     this.carttotalamount = [];
		     this.cartItems = [];
			this.storage.set("cart", this.cartItems);
          this.sellerInfo = currentSeller;
		  this.storage.set("sellerInfo",  this.sellerInfo);
        }
      }
    ]
  });
  alert.present();
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
			this.category_list = result.category;
			this.allresult=result;
				
            }, (err) => { 
            console.log(err); 
             loading.dismiss();
            });
}

calculateCatContent(currentTop) {
	let lastMatchIndex: any = 0;
	let lastMatchCatId: any = 0;
	if(this.category_list != undefined) {
		for(let i = 0; i < this.category_list.length; i++) {
			 let todayItem = document.getElementById('cat_div_'+this.category_list[i].category_id);
			 if((todayItem.offsetTop-150) <= currentTop) {
				 lastMatchIndex = (i+1);
				 lastMatchCatId = this.category_list[i].category_id;
			 }
		}
	}
	if(this.catSlides != undefined) {
		
		this.selectedCategoryId = lastMatchCatId;
	   this.catSlides.slideTo((lastMatchIndex), 500);
	}
	
}
backButtonAction(){
     this.navCtrl.pop();
	}
}