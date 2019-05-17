import { Component } from '@angular/core';
import {App, IonicPage, NavController, NavParams, LoadingController ,AlertController} from 'ionic-angular';
import { Device } from '@ionic-native/device';


import { ApiBackendService } from '../../providers/apiBackendService';
import { AuthUserService } from '../../providers/authUserService';
import { CartPage } from '../cart/cart';
import { RmenuPage } from '../rmenu/rmenu';
import { OrderprocessingPage } from '../orderprocessing/orderprocessing';
import { OffersPage } from '../offers/offers';


import { OrdersPage } from '../orders/orders';
import { MyaccountPage } from '../myaccount/myaccount';
import { ExplorePage } from '../explore/explore';
import { LoginPage } from '../login/login';
import { DisclaimerPage } from '../disclaimer/disclaimer';

import { SharePage } from '../share/share';

import { SearchdataPage } from '../searchdata/searchdata';
import { DetectlocationPage } from '../detectlocation/detectlocation';

import { Storage } from '@ionic/storage';
declare var window: any;

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
    allow_drink_status:any =0;
   userLocationInfo: any = {address: ''};
   loading: any;
   alert:any;
   orderprocesStatus: boolean = false;
   dashboardDatashowstatus:boolean=false;
   bind_km: any = 0;
   slider_middle_data:any=[];
   orderCurrentTransInfo:any={};
     userFirebaseToken: any = '';
userDeviceId:any='';
userdeviceos:any='';
  constructor(public navCtrl: NavController, public navParams: NavParams, public apiBackendService: ApiBackendService, private authUserService: AuthUserService,  public loadingCtrl: LoadingController,public storage: Storage, public appCtrl: App, private alertCtrl: AlertController,private device: Device) {
     this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
				  if (this.tabBarElement) {
		      this.tabBarElement.style.display = 'flex';
				  }
				  
				  	  let objElement: any = this;
					  if(objElement.device.platform=='Android')
					  {
				  window.FirebasePlugin.onTokenRefresh(function(token) {
    // save this server-side and use it to push notifications to this device
					objElement.userFirebaseToken = token;
			console.log("firebase token::", token);
			objElement.userDeviceId = objElement.device.uuid;
			objElement.userdeviceos = objElement.device.platform;
			console.log('Device UUID is: ' + objElement.device.uuid);
			
		}, function(error) {
			console.error(error);
		});
					  }
				   
  }
  ionViewDidLoad()
  {
	  		  	    this.storage.ready().then(()=>{

      this.storage.get("cart").then( (data)=>{
		  if(data == null) {
			  data = [];
		  }
        this.cartItems = data;
          this.cartcount=  this.cartItems.length;
        

    });
	
	

    });
	
	this.authUserService.getUser().then((user)=>{
          
          if(user != null && user != undefined) {
              this.userInfo = user;
          }         
          
      });
	
	this.authUserService.getUserLocation().then((userLocationInfo)=>{
          
          if(userLocationInfo != null && userLocationInfo != undefined) {
              this.userLocationInfo = userLocationInfo
			  console.log(this.userLocationInfo,'userLocationInfo');
			  	this.storage.get("allow_drink_status").then( (data)=>{
					  if(data == null) {
						  this.allow_drink_status = 0;
					  }else {
						  this.allow_drink_status = 1;
					  }
					  			  	  					  this.loadDashboardInfo();

				});

          }else {
			  
			  this.navCtrl.push(DetectlocationPage);	  
		  }         
          
      });			  
      
      
          
	  

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
		//console.log(data,'test');
		  if(data == null) {
			  this.orderprocesStatus = false;
		  }else {
			  this.orderprocesStatus = true;
			  this.loadCurrentStatus(data.order_id);
		  }
    });

    });
	
	
	
	this.authUserService.getUserLocation().then((userLocationInfo)=>{
          
          if(userLocationInfo != null && userLocationInfo != undefined) {
              this.userLocationInfo = userLocationInfo
			  console.log(this.userLocationInfo,'userLocationInfo');
			  	this.storage.get("allow_drink_status").then( (data)=>{
					  if(data == null) {
						  this.allow_drink_status = 0;
					  }else {
						  this.allow_drink_status = 1;
					  }
				});
			  
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
  
  loadCurrentStatus(strorderid) {
   let objElement: any = this;
   if(this.orderprocesStatus) {
	  setTimeout(()=> {
						objElement.loadCurrentStatus(strorderid);
	   }, 30000);
   }
      let order_req: any = {
		  order_id: strorderid
	  };
    this.apiBackendService.getOrderStatusUser(order_req).then((orderTrack: any)=>{
			
			this.orderCurrentTransInfo = orderTrack.result;
			if(this.orderCurrentTransInfo.trans_order_status == 4 || this.orderCurrentTransInfo.trans_id<=0) {
				
				this.storage.set("orderInProcessing", null);
			}
  
		});
}

   filterRestrauntByTypeAndPopular(type: any) {
	  let restrauntData = [];
	  let merchantData = this.dashboardData.merchant;
	  if(merchantData != undefined) {
		  for(let i=0; i < merchantData.length; i++) {
			  if(merchantData[i].seller_type == type && merchantData[i].seller_is_popular == 1 && !this.getInThisArea(this.userLocationInfo.lat,this.userLocationInfo.lng,merchantData[i].seller_latitude,merchantData[i].seller_longitude) && !this.checkrestaurentclosed(merchantData[i])) {
				  	 console.log(restrauntData,'type='+type);

				  restrauntData.push(merchantData[i]);
			  }
		  }
	  }
	 // console.log(restrauntData,'type='+type);
	  return restrauntData;
	  
  }
   filterRestrauntByTypeAndStreet(type: any) {
	  let restrauntData = [];
	  let merchantData = this.dashboardData.merchant;
	  if(merchantData != undefined) {
		  for(let i=0; i < merchantData.length; i++) {
			  if(merchantData[i].seller_is_street == 1 && !this.getInThisArea(this.userLocationInfo.lat,this.userLocationInfo.lng,merchantData[i].seller_latitude,merchantData[i].seller_longitude) && !this.checkrestaurentclosed(merchantData[i])) {
				  restrauntData.push(merchantData[i]);
			  }
		  }
	  }
	 // console.log(restrauntData,'type='+type);
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
  
  
   filterRestrauntByDistance(type: any) {
	  let restrauntData = [];
	  let merchantData = this.dashboardData.merchant;
	  if(merchantData != undefined) {
		  for(let i=0; i < merchantData.length; i++) {
			  if(merchantData[i].seller_type == type && this.bind_km < merchantData[i].distance) {
				  restrauntData.push(merchantData[i]);
			  }
		  }
	  }
	  return restrauntData;
	  
  }
  
  
  loadDashboardInfo() {
		
		let user_req = {
				  
				  lat: this.userLocationInfo.lat,
				  lng: this.userLocationInfo.lng,
				  allow_drink_status: this.allow_drink_status,
				  user_id:this.userInfo.user_id,
				  device_id:this.userDeviceId,
				  fcm_token:this.userFirebaseToken,
				  device_os:this.userdeviceos
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
				
				console.log(this.dashboardData);
				this.dashboardDatashowstatus=true;
                 this.bind_km = this.dashboardData.km_bind;
				 this.slider_middle_data=this.dashboardData.slider_middle;
				 if(result.recentorder.order_id>0)
				 {
				 			this.storage.set("orderInProcessing", result.recentorder);
				 }else{
						this.storage.set("orderInProcessing", null);
				 	 
				 }

				}, (err) => { 
				console.log(err); 
				 this.loading.dismiss();
				});
   }
    
   productListPage(sellerInfo: any)
  {   
				sellerInfo.seller_img_base_url = this.dashboardData.seller_url;
			//	this.appCtrl.getRootNav().push(RmenuPage, {sellerInfo: sellerInfo});    
			this.navCtrl.push(RmenuPage, {sellerInfo: sellerInfo});
  
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
	  }else if(strtype==4)
	  {
	  this.searchdataobj.title = strdataobject;
	  	  this.searchdataobj.id = 0;	  
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
 
  
   myMethod()
  {
	   if(this.userInfo.user_id!=null)
	  {
	  	   this.navCtrl.push(OrdersPage);    
	  }else{
		  	   this.navCtrl.push(LoginPage);    
	  
		  
	  }
  }
   myaccountMethod()
  {
	  if(this.userInfo.user_id!=null)
	  {
	  	   this.navCtrl.push(MyaccountPage);    
	  }else{
		  	   this.navCtrl.push(LoginPage);    
	   
		  
	  }
  }
  myMethoddisclaimer()
  {		  	 
         this.storage.get("allow_drink_status").then( (data)=>{
					  if(data != null) {
						   this.searchdataobj.type = 3;
						 this.searchdataobj.title = 'Popular Liquor Shop Near You';
	  	                 this.searchdataobj.id = 0;

						  this.navCtrl.push(SearchdataPage,{searchdataobj:this.searchdataobj}); 
						  
					  }else{
										this.navCtrl.push(DisclaimerPage);	  
		
					  }
					  
			});  
  }
  
  explorePagedata()
  {	   
	   this.navCtrl.push(ExplorePage); 
  }
  calldriver()
  {
	
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
	  if(merchatdata.seller_id==58)
	  {
	  	  console.log(currenttime,"currenttime");
	  console.log(closingtime,"closingtime");
	  }

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
	   //	   console.log(lat1);
	  // console.log(lon1);
	 //  console.log(lat2);
	//   console.log(lon2);

	   let distance = this.getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2);
	   if(distance>this.bind_km)
	   {
		   return true;
	   }else{
		   return false;
	   }
	   
   }
   openbannerrespect(sliderdata)
   {
	   if(sliderdata.slider_screen==1)
	   {
		    if(this.userInfo.user_id!=null)
	  {
	  	   this.navCtrl.push(SharePage);    
	  }else{
		  	   this.navCtrl.push(LoginPage);    
	  
		  
	  }
	   }
	    if(sliderdata.slider_screen==2)
	   {
		    if(this.userInfo.user_id!=null)
	  {
	  	   this.navCtrl.push(OffersPage);    
	  }else{
		  	   this.navCtrl.push(LoginPage);    
	  
		  
	  }
	   }
	    if(sliderdata.slider_resto_id>0)
	   {
		  
       this.dashboardData.merchant.forEach( (item, index)=> {
							 
							 if(item.seller_id==sliderdata.slider_resto_id)
							 {
								 
										  	 	item.seller_img_base_url = this.dashboardData.seller_url;
			//	this.appCtrl.getRootNav().push(RmenuPage, {sellerInfo: sellerInfo});    
			this.navCtrl.push(RmenuPage, {sellerInfo: item});    
 
							 }
						});

						
	   }
	   
	   
   }
   
   filterRestrauntByoutclose() {
	  let restrauntData = [];
	  let merchantData = this.dashboardData.merchant;
	  if(merchantData != undefined) {
		  for(let i=0; i < merchantData.length; i++) {
			  if( !this.getInThisArea(this.userLocationInfo.lat,this.userLocationInfo.lng,merchantData[i].seller_latitude,merchantData[i].seller_longitude) && !this.checkrestaurentclosed(merchantData)) {
				  restrauntData.push(merchantData[i]);
			  }
		  }
	  }
	  return restrauntData;
	  
  }
   filterRestrauntByoutcloselist() {
	  let restrauntData = [];
	  let merchantData = this.dashboardData.merchant;
	  if(merchantData != undefined) {
		  for(let i=0; i < merchantData.length; i++) {
			  if( this.getInThisArea(this.userLocationInfo.lat,this.userLocationInfo.lng,merchantData[i].seller_latitude,merchantData[i].seller_longitude) || this.checkrestaurentclosed(merchantData)) {
				  restrauntData.push(merchantData[i]);
			  }
		  }
	  }
	  return restrauntData;
	  
  }
}
