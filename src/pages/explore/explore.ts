import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, LoadingController, ViewController} from 'ionic-angular';

import { ApiBackendService } from '../../providers/apiBackendService';
import { AuthUserService } from '../../providers/authUserService';
import { RmenuPage } from '../rmenu/rmenu';

/**
 * Generated class for the ExplorePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-explore',
  templateUrl: 'explore.html',
})
export class ExplorePage {

   userLocationInfo: any = {address: ''};
   loading: any;
   dashboardData: any = {};

  constructor(public navCtrl: NavController, public navParams: NavParams, public apiBackendService: ApiBackendService, private authUserService: AuthUserService,  public loadingCtrl: LoadingController, public viewCtrl: ViewController) {
	   this.loading = this.loadingCtrl.create({
                content: 'Please wait...'
              });
			  
			  this.authUserService.getUserLocation().then((userLocationInfo)=>{
          console.log("userLocationInfo:: ", userLocationInfo);
          if(userLocationInfo != null && userLocationInfo != undefined) {
              this.userLocationInfo = userLocationInfo;
			 // this.loadDashboardInfo();
          }else {
			  
			//  this.navCtrl.push(DetectlocationPage);	  
		  }         
          
      });
			  
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ExplorePage');
  }
  getItems(ev: any) {
	  
	  	let user_req = {
				  
				  lat: this.userLocationInfo.lat,
				  lng: this.userLocationInfo.lng,
				  searchdata:ev.target.value
			  };
			   this.apiBackendService.getDashbboardInfo(user_req).then((result: any) => { 
				 this.loading.dismiss();
				 
				this.dashboardData = result;
                 console.log("this.dashboardData:: ", this.dashboardData);
				}, (err) => { 
				console.log(err); 
				 //this.loading.dismiss();
				});
  }
  onCancel(ev: any) {
  }
  
   productListPage(sellerInfo: any)
  {         sellerInfo.seller_img_base_url = this.dashboardData.seller_url;
	  	   this.navCtrl.push(RmenuPage, {sellerInfo: sellerInfo});    
	 // let nav = this.app.getRootNav(); 
	      //console.log('click OrdersPage');

  } 

}
