import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Platform } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Device } from '@ionic-native/device';
import { Storage } from '@ionic/storage';

import { ApiBackendService } from '../../providers/apiBackendService';
import { AuthUserService } from '../../providers/authUserService';

import * as firebase from 'firebase';
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
	map: any;
	orderInfo: any = {order_id: 0};
	tabBarElement: any;
	shownGroup = null;
	diseases = [];
	userInfo: any = {};
	markers = [];
	orderprocesStatus: boolean = false;
	ref = firebase.database().ref('geolocations/');
  constructor(public navCtrl: NavController, public navParams: NavParams, public apiBackendService: ApiBackendService, private authUserService: AuthUserService,  public loadingCtrl: LoadingController, public platform: Platform, private device: Device, private geolocation: Geolocation, public storage: Storage) {
	  	    this.platform.ready().then(() => {
				this.initMap();
					  	  	  	  	     
			});

			this.ref.on('value', resp => {
			  this.deleteMarkers();
			  snapshotToArray(resp).forEach(data => {
				if(data.uuid !== this.device.uuid) {
				  let image = 'assets/imgs/green-bike.png';
				  let updatelocation = new google.maps.LatLng(data.latitude,data.longitude);
				  this.addMarker(updatelocation,image);
				  this.setMapOnAll(this.map);
				} else {
				  let image = 'assets/imgs/blue-bike.png';
				  let updatelocation = new google.maps.LatLng(data.latitude,data.longitude);
				  this.addMarker(updatelocation,image);
				  this.setMapOnAll(this.map);
				}
			  });
			});			

  }

initMap() {
	let objElement: any = this;
  this.geolocation.getCurrentPosition({ maximumAge: 3000, timeout: 5000, enableHighAccuracy: true }).then((resp) => {
    console.log("resp:: ", resp);   
    console.log("objElement.mapElement.nativeElement:: ", objElement.mapElement.nativeElement);   
   let mylocation = new google.maps.LatLng(resp.coords.latitude,resp.coords.longitude);
    objElement.map = new google.maps.Map(objElement.mapElement.nativeElement, {
      zoom: 15,
      center: mylocation
    });
  });
  let watch = this.geolocation.watchPosition();
   watch.subscribe((data) => {
	  objElement.deleteMarkers();
	  objElement.updateGeolocation(objElement.device.uuid, data.coords.latitude,data.coords.longitude);
	  let updatelocation = new google.maps.LatLng(data.coords.latitude,data.coords.longitude);
	  let image = 'assets/imgs/blue-bike.png';
	  objElement.addMarker(updatelocation,image);
	  objElement.setMapOnAll(objElement.map);
  });
}

addMarker(location, image) {
  let marker = new google.maps.Marker({
    position: location,
    map: this.map
   
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

updateGeolocation(uuid, lat, lng) {
  if(localStorage.getItem('mykey')) {
    firebase.database().ref('geolocations/'+localStorage.getItem('mykey')).set({
      uuid: uuid,
      latitude: lat,
      longitude : lng
    });
  } else {
    let newData = this.ref.push();
    newData.set({
      uuid: uuid,
      latitude: lat,
      longitude: lng
    });
    localStorage.setItem('mykey', newData.key);
  }
}
  ionViewWillEnter() {	  	 	      
    
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
			  this.orderprocesStatus = true;
		  }
    });
      
      

  }

  backButtonAction(){
	  
     this.navCtrl.setRoot(TabsPage);
	}
    gotoOrderRating() {
		this.navCtrl.push(RatingreviewPage, {order_id: this.orderInfo.order_id});
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