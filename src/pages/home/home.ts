import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';

import { ApiBackendService } from '../../providers/apiBackendService';
import { AuthUserService } from '../../providers/authUserService';

import { CartPage } from '../cart/cart';
import { RmenuPage } from '../rmenu/rmenu';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  tabBarElement: any;
  userInfo: any = {};
    numbers = [0,1,2,3];
   dashboardData: any = {};
  constructor(public navCtrl: NavController, public navParams: NavParams, public apiBackendService: ApiBackendService, private authUserService: AuthUserService,  public loadingCtrl: LoadingController) {
     
  }
  ionViewWillEnter() {	  	 	      
    
      this.authUserService.getUser().then((user)=>{
          console.log("user:: ", user);
          if(user != null && user != undefined) {
              this.userInfo = user;
              this.loadDashboardInfo();
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
				  user_id: this.userInfo.user_id
			  };
			 let loading = this.loadingCtrl.create({
					content: 'Please wait...'
				  });
				  loading.present();
			 this.apiBackendService.getDashbboardInfo(user_req).then((result: any) => { 
				 loading.dismiss();
				 
				this.dashboardData = result;
                 console.log("this.dashboardData:: ", this.dashboardData);
				}, (err) => { 
				console.log(err); 
				 loading.dismiss();
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
}
