import { Component } from '@angular/core';
import {App, IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';

import { ApiBackendService } from '../../providers/apiBackendService';
import { AuthUserService } from '../../providers/authUserService';
OrderprocessingPage
import { CartPage } from '../cart/cart';
import { RmenuPage } from '../rmenu/rmenu';
import { OrderprocessingPage } from '../orderprocessing/orderprocessing';

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
   orderprocesStatus: boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, public apiBackendService: ApiBackendService, private authUserService: AuthUserService,  public loadingCtrl: LoadingController,public storage: Storage, public appCtrl: App) {
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
	
	this.storage.get("orderInProcessing").then( (data)=>{
		  if(data == null) {
			  this.orderprocesStatus = false;
		  }else {
			  this.orderprocesStatus = true;
		  }
    });
    });
	this.authUserService.getUserLocation().then((userLocationInfo)=>{
          
          if(userLocationInfo != null && userLocationInfo != undefined) {
              this.userLocationInfo = userLocationInfo;
			  this.loadDashboardInfo();
          }else {
			  
			  this.navCtrl.push(DetectlocationPage);	  
		  }         
          
      });			  
      this.authUserService.getUser().then((user)=>{
          
          if(user != null && user != undefined) {
              this.userInfo = user;
          }         
          
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
                 
				}, (err) => { 
				console.log(err); 
				 this.loading.dismiss();
				});
   }
    
   productListPage(sellerInfo: any)
  {         sellerInfo.seller_img_base_url = this.dashboardData.seller_url;
	  	   this.appCtrl.getRootNav().push(RmenuPage, {sellerInfo: sellerInfo});    
	 // let nav = this.app.getRootNav(); 
	      

  } 
   
   mycartMethod()
  {
		   this.appCtrl.getRootNav().push(CartPage);    
	 // let nav = this.app.getRootNav(); 
	      

  } 
  doRefresh(refresher) {
   

    setTimeout(() => {
      
      refresher.complete();
    }, 2000);
  }
  
   opendetectlocation()
  {  
	 	  	  	   this.appCtrl.getRootNav().push(DetectlocationPage);     
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
		  	  	   this.appCtrl.getRootNav().push(SearchdataPage,{searchdataobj:this.searchdataobj});    
  
  }
  
  showorderprocessing()
  {
	  
	  this.navCtrl.push(OrderprocessingPage)
  }
}
