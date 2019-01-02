import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';

import { ApiBackendService } from '../../providers/apiBackendService';
import { AuthUserService } from '../../providers/authUserService';

import { CartPage } from '../cart/cart';
import { RmenuPage } from '../rmenu/rmenu';
import { SearchdataPage } from '../searchdata/searchdata';
import { DetectlocationPage } from '../detectlocation/detectlocation';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  tabBarElement: any;
  userInfo: any = {};
  searchdataobj: any = {};
    numbers = [0,1,2,3];
   dashboardData: any = {};
    cartItems: any = [];
    cartcount:any =0;
   userLocationInfo: any = {address: ''};
   loading: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public apiBackendService: ApiBackendService, private authUserService: AuthUserService,  public loadingCtrl: LoadingController,public storage: Storage) {
     this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
				  if (this.tabBarElement) {
		      this.tabBarElement.style.display = 'flex';
				  }
  }
  ionViewWillEnter() {	  	 	      
    
	   this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
				  if (this.tabBarElement) {
		      this.tabBarElement.style.display = 'flex';
				  }
				  	    this.storage.ready().then(()=>{

      this.storage.get("cart").then( (data)=>{
		  if(data == null) {
			  data = [];
		  }
        this.cartItems = data;
          this.cartcount=  this.cartItems.length;
        

    });
    });
	this.authUserService.getUserLocation().then((userLocationInfo)=>{
          console.log("userLocationInfo:: ", userLocationInfo);
          if(userLocationInfo != null && userLocationInfo != undefined) {
              this.userLocationInfo = userLocationInfo;
          }         
          
      });			  
      this.authUserService.getUser().then((user)=>{
          console.log("user:: ", user);
          if(user != null && user != undefined) {
              this.userInfo = user;
          }         
          this.loadDashboardInfo();
      });
      
                    


  }
   filterRestrauntByTypeAndPopular(type: any) {
	  let restrauntData = [];
	  let merchantData = this.dashboardData.merchant;
	  if(merchantData != undefined) {
		  for(let i=0; i < merchantData.length; i++) {
			  if(merchantData[i].seller_type == type && merchantData[i].seller_is_popular == 1) {
				  restrauntData.push(merchantData[i]);
			  }
		  }
	  }
	  return restrauntData;
	  
  }
  
  filterRestrauntByType(type: any) {
	  let restrauntData = [];
	  let merchantData = this.dashboardData.merchant;
	  if(merchantData != undefined) {
		  for(let i=0; i < merchantData.length; i++) {
			  if(merchantData[i].seller_type == type) {
				  restrauntData.push(merchantData[i]);
			  }
		  }
	  }
	  return restrauntData;
	  
  }
  loadDashboardInfo() {
		
		let user_req = {
				  
				  lat: this.userLocationInfo.lat,
				  lng: this.userLocationInfo.lng
			  };
			  if(this.userInfo  != null) {
				  user_req['user_id'] = this.userInfo.user_id;
			  }
			 this.loading = this.loadingCtrl.create({
					content: 'Please wait...'
					
				  });
				  this.loading.present();
			 this.apiBackendService.getDashbboardInfo(user_req).then((result: any) => { 
				 this.loading.dismiss();
				 
				this.dashboardData = result;
                 console.log("this.dashboardData:: ", this.dashboardData);
				}, (err) => { 
				console.log(err); 
				 this.loading.dismiss();
				});
   }
    
   productListPage(sellerInfo: any)
  {         sellerInfo.seller_img_base_url = this.dashboardData.seller_url;
	  	   this.navCtrl.push(RmenuPage, {sellerInfo: sellerInfo});    
	 // let nav = this.app.getRootNav(); 
	      //console.log('click OrdersPage');

  } 
   
   mycartMethod()
  {
	  	   this.navCtrl.push(CartPage);    
	 // let nav = this.app.getRootNav(); 
	      //console.log('click OrdersPage');

  } 
  doRefresh(refresher) {
    console.log('Begin async operation', refresher);

    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }
  
   opendetectlocation()
  {  
	 	  	  	   this.navCtrl.push(DetectlocationPage);     
  }
  
  showsearchdata(strtype,strdataobject)
  {
	  this.searchdataobj.type = strtype;
	  if(strtype==0)
	  {
		  	  this.searchdataobj.title = strdataobject.category_name; 
	  this.searchdataobj.id = strdataobject.category_id;
			  
	  }else  if(strtype==1)
	  {
	  this.searchdataobj.title = strdataobject;
	  	  this.searchdataobj.id = 0;	  
	  }else if(strtype==3)
	  {
	  this.searchdataobj.title = strdataobject;
	  	  this.searchdataobj.id = 0;	  
	  }else if(strtype==2)
	  {
	  this.searchdataobj.title = strdataobject.brand_name;
	  	  this.searchdataobj.id = strdataobject.brand_id;	  
	  }else{
	  this.searchdataobj.title = '';
 	  this.searchdataobj.id = 0;		  
	  }
		  	  	   this.navCtrl.push(SearchdataPage,{searchdataobj:this.searchdataobj});    
  
  }
}
