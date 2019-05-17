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
dataClosestatus:boolean=true;
rmenu
 = [{ name: "Signature Premier Grain"},{ name: "All Seasons"},{ name: "Heineken Lager Beer Wit"},{ name: "Signature Premier Grain"},{ name: "All Seasons"}];
 userInfo: any = {};
 productList: any = [];
 sellerInfo: any = {};
 product_image_path: any = '';
 cartItemsIds: any = [];
 cartItems: any = []; 
 selectedCategoryId: any =0;
 carttotalamount: any =0;
 category_list:any= [];
 allresult:any = [];
 userLocationInfo:any={};
 bind_km:any=3;
 bind_error:boolean=false;
 subHeaderShow: boolean = false;
 liqourqty:any=0;
  constructor(public navCtrl: NavController, public navParams: NavParams, public apiBackendService: ApiBackendService, private authUserService: AuthUserService,  public loadingCtrl: LoadingController, public storage: Storage, public viewCtrl: ViewController, public toastController: ToastController, public modalCtrl: ModalController, private alertCtrl: AlertController, public zone: NgZone, private cd: ChangeDetectorRef) {
     this.sellerInfo = this.navParams.get("sellerInfo");
	 console.log(this.sellerInfo);
	this.checkrestaurentclosed(this.sellerInfo);
	//console.log(this.dataClosestatus,'dataClosestatus');
 }
onViewWillEnter()
{
	    	this.checkrestaurentclosed(this.sellerInfo);
			
				this.authUserService.getUserLocation().then((userLocationInfo)=>{
          
          if(userLocationInfo != null && userLocationInfo != undefined) {
              this.userLocationInfo = userLocationInfo
			
			  console.log(this.userLocationInfo,'tens');
          }      
          
      });
	  
			

}
  ionViewDidLoad() {
    	this.checkrestaurentclosed(this.sellerInfo);
	this.authUserService.getUserLocation().then((userLocationInfo)=>{
          
          if(userLocationInfo != null && userLocationInfo != undefined) {
              this.userLocationInfo = userLocationInfo
			
			  console.log(this.userLocationInfo,'tens');
			  
          }      
          
      });
	                      this.loadProducts();

	
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
   
  addToCartPrepare(productItem) {
	 	   if(productItem.child.length == 1) {
		  this.addToCart(productItem,productItem.child[0].pmp_net_price, productItem.child[0].pmp_id, productItem.child[0].unit_name);
	  }else{
	  this.addToCart(productItem,productItem.pmp_net_price, 0, '');
	  }  
  }
  addToCart(product, amount, variationId, variationLabel) {
	  console.log("product:: ", product);
	   this.storage.get("sellerInfo").then( (data)=> {
		if(data != null) {
			if(data.seller_id != this.sellerInfo.seller_id) {
				this.presentConfirm(this.sellerInfo,  data, product, amount, variationId, variationLabel);
			}else {
				
		console.log(this.sellerInfo.seller_type,'sellertype');
	  if(this.sellerInfo.seller_type==0)
	  {
		  		  this.getliqourqty();

		  if(this.liqourqty<6)
		  {
		  
	 		 				this.processCartItems(product, amount, variationId, variationLabel);

		  }else{
			  this.alertsixbottel();
			  
		  }
	  }else{
		
		 				this.processCartItems(product, amount, variationId, variationLabel);
 
	  }
			}
		}else {
			
			this.storage.set("sellerInfo",  this.sellerInfo);
			this.processCartItems(product, amount, variationId, variationLabel);
		}
		
	});
	  
  }
  processCartItems(product, amount, variationId, variationLabel) {
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
                  let objElement: any = this;
                  setTimeout(()=>{				  
	              objElement.getCartItems();}, 1000);

			  });
	  });
  }
  
  getCartItems() {
	    this.storage.ready().then(()=>{
this.liqourqty=0;
      this.storage.get("cart").then( (data)=>{
		  if(data == null) {
			  data = [];
		  }
		  this.cartItemsIds = [];
        this.cartItems = data;
        
		this.carttotalamount = 0;
        if(this.cartItems.length > 0){

          this.cartItems.forEach( (item, index)=> {
             this.cartItemsIds.push(item.product.product_id);
this.carttotalamount = parseFloat(this.carttotalamount)+ (parseFloat(item.amount)*parseInt(item.qty));
this.liqourqty = parseInt(this.liqourqty)+parseInt(item.qty);

		});
		}else {
			this.carttotalamount=0;
		}

    });
    });
  }
  getliqourqty()
  {
	
  }
  
   incrementCatItem(index, catId) {
	  
	  	
	  if(this.sellerInfo.seller_type==0)
	  {
		  		  		  this.getliqourqty();

		  if(this.liqourqty<6)
		  {

this.allresult[catId][index].qty++;
	this.changeProductQtyToCart(this.allresult[catId][index]);
		  }else{
			  this.alertsixbottel();
			  
		  }
	  }else{
		
this.allresult[catId][index].qty++;
	this.changeProductQtyToCart(this.allresult[catId][index]); 
	  }
	  
		
    
 }
 
  increment(index) {
	  
		
	  	
	  if(this.sellerInfo.seller_type==0)
	  {
		  		  this.getliqourqty();

		  if(this.liqourqty<6)
		  {
		  
this.productList[index].qty++;
	this.changeProductQtyToCart(this.productList[index]);
		  }else{
			  this.alertsixbottel();
			  
		  }
	  }else{
		
this.productList[index].qty++;
	this.changeProductQtyToCart(this.productList[index]);
	  }
    
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
		this.carttotalamount=0;
		 this.cartItems.forEach( (item, index)=> {
			 if(product.product_id == item.product.product_id) {
				 
			 }else {
				this.cartItemsIds.push(item.product.product_id);
				this.carttotalamount =parseFloat(this.carttotalamount)+ (parseFloat(item.amount)*parseInt(item.qty));
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
presentConfirm(currentSeller, previousSeller, product, amount, variationId, variationLabel) {
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
		  let objElement = this;
		  setTimeout(()=> {
				objElement.processCartItems(product, amount, variationId, variationLabel);
		  }, 1000);
		  
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
			 if(result.message=='ok')
			 {
             this.product_image_path = result.product_image;
            this.productList = result.result;
			this.category_list = result.category;
			this.allresult=result;
			this.bind_km=result.bind_km;
			console.log(this.allresult,'all');
			 }
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
	
	 checkrestaurentclosed(merchatdata)
  {
	  let currenttime:any=new Date().getTime();
	  
	  console.log(currenttime,"current_time");
	  

	  if(merchatdata.dh_opening=='24 Hrs')
	  {
		  this.dataClosestatus = false;
		  
	  }else if(merchatdata.dh_opening=='Closed'){  
		 this.dataClosestatus = true;  
	  }else{
		  let currentdate = new Date().toISOString();
		  console.log(new Date().getTime(),'current_date_time');
       let current =currentdate.substr(0,10);
	   let opentimestring = current+' '+merchatdata.dh_opening;
	   let closetimestring = current+' '+merchatdata.dh_closing;
		  //console.log(currenttimestring,'currenttime');
		  let openingtime:any=new Date(opentimestring).getTime();
	  let closingtime:any=new Date(closetimestring).getTime();
	  
	  if(currenttime>closingtime)
	  {
		  		 this.dataClosestatus = true;  

		  
	  }else{
		  
		  		 this.dataClosestatus = false;  

	  }
	  	  console.log(openingtime,"openingtime");
	  console.log(closingtime,"closingtime");

	  }
	  
  }

   getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = this.deg2rad(lat2-lat1);  // deg2rad below
    var dLon = this.deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d;
   }

   deg2rad(deg) {
    return deg * (Math.PI/180)
   }
   
   getInThisArea(lat1,lon1,lat2,lon2)
   {
	  // 	   console.log(lat1);
	  // console.log(lon1);
	  // console.log(lat2);
	  //console.log(lon2);
if(!this.dataClosestatus)
{
	   let distance = this.getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2);
	   if(distance>this.bind_km)
	   {
		   this.bind_error=true;
		   		   return true;

	   }else{
		   this.bind_error=false;
		   return false;
	   }
}
	   
   }
   alertsixbottel()
 {
	 let alert = this.alertCtrl.create({
								title: 'Max limit 6 bottles',
								subTitle: '6 bottle allowed at once per user',
								buttons: ['Dismiss']
							  });
							  alert.present();
				return ;
 }
  }