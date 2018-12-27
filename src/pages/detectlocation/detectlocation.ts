import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

import { AuthUserService } from '../../providers/authUserService';
import { TabsPage } from '../tabs/tabs';
/**
 * Generated class for the DetectlocationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var google: any;
@IonicPage()
@Component({
  selector: 'page-detectlocation',
  templateUrl: 'detectlocation.html',
})
export class DetectlocationPage {
  GoogleAutocomplete: any;
  autocompleteItems: any = [];
  autocomplete: any;
  geocoder: any;
  markers: any = [];
  map: any;
  currentSelectedAddress: any ='';
  userLocationInfo: any = {};
  constructor(public navCtrl: NavController, public navParams: NavParams, private geolocation: Geolocation, private authUserService: AuthUserService, private ngZone: NgZone,  public loadingCtrl: LoadingController) {
	  this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
	  this.autocomplete = { input: '' };
	  this.autocompleteItems = [];
	  this.geocoder = new google.maps.Geocoder();
	this.markers = [];

  }
 tryGeolocation(){
  this.clearMarkers();
 
  this.geolocation.getCurrentPosition().then((resp) => {
    let pos = {
		
      lat: resp.coords.latitude,
      lng: resp.coords.longitude
    };
	let place_data: any = {'location': pos};
  this.geocodeUserAddress(place_data);
    /*let marker = new google.maps.Marker({
      position: pos,
      map: this.map,
      title: 'I am here!'
    });
    this.markers.push(marker);
    this.map.setCenter(pos);*/
  }).catch((error) => {
    console.log('Error getting location', error);
  });
} 
 selectSearchResult(item){
  this.clearMarkers();
  this.autocompleteItems = [];
  let place_data: any = {'placeId': item.place_id};
  this.geocodeUserAddress(place_data);
 
} 

 geocodeUserAddress(addressSource: any) {
	  let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
	 this.geocoder.geocode(addressSource, (results, status) => {
		 loading.dismiss();
    if(status === 'OK' && results[0]){
      let position = {
          lat: results[0].geometry.location.lat,
          lng: results[0].geometry.location.lng
      };
	  this.ngZone.run(()=>{
		this.currentSelectedAddress = results[0].formatted_address;  
	  });
	  
	  this.userLocationInfo = {address: results[0].formatted_address, lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng()};
	  console.log("results:: ", results);
      let marker = new google.maps.Marker({
        position: results[0].geometry.location,
        map: this.map,
      });
      this.markers.push(marker);
      this.map.setCenter(results[0].geometry.location);
    }
  });
 }
 updateSearchResults(){
  if (this.autocomplete.input == '') {
    this.autocompleteItems = [];
    return;
  }
  this.GoogleAutocomplete.getPlacePredictions({ input: this.autocomplete.input },
	(predictions, status) => {
    this.autocompleteItems = [];
	predictions.forEach((prediction) => {
        this.autocompleteItems.push(prediction);
      });
    /*this.zone.run(() => {
      predictions.forEach((prediction) => {
        this.autocompleteItems.push(prediction);
      });
    });*/
  });
}
  clearMarkers() {
	  
	  for(let i=0; i< this.markers.length; i++) {
		  if(this.markers[i]) {
			  this.markers[i].setMap(null);
		  }
	  }
  }
  setUserLocation() {
	  this.authUserService.saveUserLocation(this.userLocationInfo).then((status)=>{
                  this.navCtrl.setRoot(TabsPage);
              });
	  
  }
  ionViewDidEnter(){
	//Set latitude and longitude of some place
	this.map = new google.maps.Map(document.getElementById('map'), {
		center: { lat: -34.9011, lng: -56.1645 },
		zoom: 15
	});
}

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetectlocationPage');
  }

}
