import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { ApiBackendService } from '../../providers/apiBackendService';
import { AuthUserService } from '../../providers/authUserService';
import { RmenuPage } from '../rmenu/rmenu';
import { Storage } from '@ionic/storage';

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
	    searchdataobj: any = {};
		  userInfo: any = {};
   dashboardData: any = {};
   userLocationInfo: any = {address: ''};
   loading: any;
allow_drink_status:any=0;
   bind_km: any = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams, public apiBackendService: ApiBackendService, private authUserService: AuthUserService,  public loadingCtrl: LoadingController,public storage: Storage) {
						       this.searchdataobj = this.navParams.get("searchdataobj");
  }

   loadSearchInfo() {
		
		let user_req = {
				  
				  lat: this.userLocationInfo.lat,
				  lng: this.userLocationInfo.lng,
				  type:this.searchdataobj.type,
				  id:this.searchdataobj.id
			  };
			  if(this.userInfo  != null) {
				  user_req['user_id'] = this.userInfo.user_id;
			  }
			 this.loading = this.loadingCtrl.create({
					content: 'Please wait...'
					
				  });
				  this.loading.present();
			 this.apiBackendService.getSearchResultInfo(user_req).then((result: any) => { 
				 this.loading.dismiss();
				 this.bind_km =result.km_bind;
				this.dashboardData = result;
                 console.log("this.dashboardData:: ", this.dashboardData);
				}, (err) => { 
				console.log(err); 
				 this.loading.dismiss();
				});
   }
    
  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchdataPage');
						  this.authUserService.getUserLocation().then((userLocationInfo)=>{
          console.log("userLocationInfo:: ", userLocationInfo);
          if(userLocationInfo != null && userLocationInfo != undefined) {
              this.userLocationInfo = userLocationInfo;
          }         
          
      });	
this.storage.get("allow_drink_status").then( (data)=>{
					  if(data == null) {
						  this.allow_drink_status = 0;
					  }else {
						  this.allow_drink_status = 1;
					  }
					  //this.loadDashboardInfo();
				});	  
      this.authUserService.getUser().then((user)=>{
          console.log("user:: ", user);
          if(user != null && user != undefined) {
              this.userInfo = user;
          }         
          this.loadSearchInfo();
      });
      

  }
  
   productListPage(sellerInfo: any)
  {         sellerInfo.seller_img_base_url = this.dashboardData.seller_url;
	  	   this.navCtrl.push(RmenuPage, {sellerInfo: sellerInfo});    
	 // let nav = this.app.getRootNav(); 
	      //console.log('click OrdersPage');

  } 
  	 checkrestaurentclosed(merchatdata)
  {
	  let currenttime:any=new Date().getTime();
	  
	 // console.log(currenttime,"current_time");
	  
      let dataClosestatus:boolean=true;
	  if(merchatdata.dh_opening=='24 Hrs')
	  {
		  dataClosestatus = false;
		  
	  }else if(merchatdata.dh_opening=='Closed'){  
		 dataClosestatus = true;  
	  }else{
		  let currentdate = new Date().toISOString();
		//  console.log(new Date().getTime(),'current_date_time');
       let current =currentdate.substr(0,10);
	   let opentimestring = current+' '+merchatdata.dh_opening;
	   let closetimestring = current+' '+merchatdata.dh_closing;
		  //console.log(currenttimestring,'currenttime');
		  let openingtime:any=new Date(opentimestring).getTime();
	  let closingtime:any=new Date(closetimestring).getTime();
	  
	  if(currenttime>closingtime)
	  {
		  		 dataClosestatus = true;  

		  
	  }else{
			  		 dataClosestatus = false;  
	  
	  }
	  //	  console.log(openingtime,"openingtime");
	 // console.log(closingtime,"closingtime");

	  }
	return  dataClosestatus; 
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
	//   	  console.log(lat1);
	//   console.log(lon1);
	//   console.log(lat2);
 //  console.log(lon2);

	   let distance = this.getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2);
	   		   console.log('true',distance);

	   if(distance>this.bind_km)
	   {
		   console.log('true');
		   return true;
	   }else{
		   return false;
	   }
	   
   }

}
