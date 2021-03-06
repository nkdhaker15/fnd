import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Platform,Navbar } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Device } from '@ionic-native/device';
import { Storage } from '@ionic/storage';
import { ApiBackendService } from '../../providers/apiBackendService';
import { AuthUserService } from '../../providers/authUserService';


import { TabsPage } from '../tabs/tabs';
import { RatingreviewPage } from '../ratingreview/ratingreview';
/**
 * Generated class for the FaqPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var google: any;
@IonicPage()
@Component({
  selector: 'page-orderprocessing',
  templateUrl: 'orderprocessing.html',
})
export class OrderprocessingPage {
	@ViewChild('map') mapElement: ElementRef;
    @ViewChild(Navbar) navBar: Navbar;

	map: any;
	loadingObj: any=null;
	driverLatLng: any = {lat:0, lng:0};
	userLatLng: any = {lat:0, lng:0};
	orderInfo: any = {order_id: 0};
	tabBarElement: any;
	shownGroup = null;
	diseases = [];
	userInfo: any = {};
	orderTransInfo: any = {};
	markers = [];
	directionsService: any;
	directionsDisplay: any;
	orderprocesStatus: boolean = false;
	orderprocesPageStatus: boolean = false;
	currentInterval: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public apiBackendService: ApiBackendService, private authUserService: AuthUserService,  public loadingCtrl: LoadingController, public platform: Platform, private device: Device, private geolocation: Geolocation, public storage: Storage) {
	  this.platform.registerBackButtonAction(this.backButtonAction.bind(this),500);
	  	    this.platform.ready().then(() => {				
					
					this.initMap() ;
					  	  	  	  	     
			});
			
			
  }
 displayDirection(location1, location2) {
           this.directionsService.route({
	          origin: location1,
	          destination: location2,
	          travelMode: 'DRIVING'
	        }, (response, status) => {
	          if (status === 'OK') {
	            this.directionsDisplay.setDirections(response);
	          }else {
				  console.log("response:: ", response);
				  
			  }
	        });
} 
loadCurrentStatus() {
	if(this.loadingObj != null) {
		this.loadingObj.dismiss().catch(()=>{});
	}
	  this.loadingObj = this.loadingCtrl.create({
      content: 'Please wait...'
    });
   // this.loadingObj.present();
   let objElement: any = this;
   if(this.orderprocesPageStatus) {
	  setTimeout(()=> {
						objElement.loadCurrentStatus();
	   }, 10000);
   }
      let order_req: any = {
		  order_id: this.orderInfo.order_id
	  };
    this.apiBackendService.getOrderStatusUser(order_req).then((orderTrack: any)=>{
		    this.loadingObj.dismiss();
			
			this.orderTransInfo = orderTrack.result;
			if(this.orderTransInfo.trans_order_status == 4) {
				
				this.storage.set("orderInProcessing", null);
				this.gotoOrderRating();
			}else{
if(orderTrack.result.trans_lat>0)
			{		
let updatelocation = new google.maps.LatLng(orderTrack.result.trans_lat,orderTrack.result.trans_long);
let updatelocation2 = new google.maps.LatLng(orderTrack.result.trans_delivery_lat,orderTrack.result.trans_delivery_long);
this.displayDirection(updatelocation, updatelocation2);
this.addMarker(updatelocation,'assets/icon/scootericon.png');
			}else{
let updatelocation = new google.maps.LatLng(orderTrack.result.trans_seller_lat,orderTrack.result.trans_seller_long);
let updatelocation2 = new google.maps.LatLng(orderTrack.result.trans_delivery_lat,orderTrack.result.trans_delivery_long);
this.displayDirection(updatelocation, updatelocation2);
}

			}
  
		});
}


initMap() {
	let objElement: any = this;
  this.geolocation.getCurrentPosition({ maximumAge: 3000, timeout: 5000, enableHighAccuracy: true }).then((resp) => {
    console.log("resp:: ", resp);   
	this.userLatLng.lat = resp.coords.latitude;
	this.userLatLng.lng = resp.coords.longitude;
	
    console.log("objElement.mapElement.nativeElement:: ", objElement.mapElement.nativeElement);   
   let mylocation = new google.maps.LatLng(resp.coords.latitude,resp.coords.longitude);
    objElement.map = new google.maps.Map(objElement.mapElement.nativeElement, {
      zoom: 15,
      center: mylocation,
	   mapTypeControlOptions: {
      mapTypeIds: [google.maps.MapTypeId.ROADMAP, google.maps.MapTypeId.HYBRID]
    }, 
    disableDefaultUI: true, 
    mapTypeControl: true,
    scaleControl: true,
    zoomControl: true,
    zoomControlOptions: {
      style: google.maps.ZoomControlStyle.LARGE 
    },
    mapTypeId: google.maps.MapTypeId.ROADMAP
    });
	objElement.directionsService = new google.maps.DirectionsService();
objElement.directionsDisplay = new google.maps.DirectionsRenderer();
objElement.directionsDisplay.setMap(objElement.map);
objElement.loadCurrentStatus();
  });
 
}

addMarker(location, image) {
  let marker = new google.maps.Marker({
    position: location,
    map: this.map,
	color:'#000000',
	icon:image
   
  });
  this.markers.push(marker);
}

setMapOnAll(map) {
  for (var i = 0; i < this.markers.length; i++) {
    this.markers[i].setMap(map);
  }
}

clearMarkers() {
  this.setMapOnAll(null);
}

deleteMarkers() {
  this.clearMarkers();
  this.markers = [];
}


  ionViewWillEnter() {	  	 	      
    this.orderprocesPageStatus = true;
      this.authUserService.getUser().then((user)=>{
          console.log("user:: ", user);
          if(user != null && user != undefined) {
              this.userInfo = user;
             // this.loadFaq();
          }         
          
      });
	  
	  	this.storage.get("orderInProcessing").then( (data)=>{
			
		  if(data == null) {
			  this.orderprocesStatus = false;
		  }else {
			  this.orderInfo = data;
			  console.log("this.orderInfo:: ", this.orderInfo);
			  this.orderprocesStatus = true;
		  }
    });
      
      

  }
  ionViewCanLeave() {
	   this.orderprocesPageStatus = false;
  }
   ionViewDidLoad() {
	   this.navBar.backButtonClick = (e:UIEvent)=>{
     // todo something
     this.navCtrl.push(TabsPage);
    }
    console.log('ionViewDidLoad SignupfinalPage');
  }
  backButtonAction(){
	  this.orderprocesPageStatus = false;
     this.navCtrl.setRoot(TabsPage);
	}
    gotoOrderRating() {
		this.navCtrl.push(RatingreviewPage, {order_id: this.orderInfo.order_id, orderinfo: this.orderTransInfo});
	}
	

}

export const snapshotToArray = snapshot => {
    let returnArr = [];

    snapshot.forEach(childSnapshot => {
        let item = childSnapshot.val();
        item.key = childSnapshot.key;
        returnArr.push(item);
    });

    return returnArr;
};