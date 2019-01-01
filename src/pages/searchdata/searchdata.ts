import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { ApiBackendService } from '../../providers/apiBackendService';
import { AuthUserService } from '../../providers/authUserService';

/**
 * Generated class for the SearchdataPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-searchdata',
  templateUrl: 'searchdata.html',
})
export class SearchdataPage {
	  tabBarElement: any;
	    searchdataobj: any = {};
		  userInfo: any = {};
   dashboardData: any = {};
   userLocationInfo: any = {address: ''};
   loading: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public apiBackendService: ApiBackendService, private authUserService: AuthUserService,  public loadingCtrl: LoadingController) {
	  	  	  	  	      this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
						       this.searchdataobj = this.navParams.get("searchdataobj");
  }

   loadSearchInfo() {
		
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
    
  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchdataPage');
		  	  	  	      this.tabBarElement.style.display = 'none';
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
          this.loadSearchInfo();
      });
      

  }

}
