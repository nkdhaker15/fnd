import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Diagnostic } from '@ionic-native/diagnostic';

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
  tabBarElement: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, private geolocation: Geolocation, private authUserService: AuthUserService, private ngZone: NgZone,  public loadingCtrl: LoadingController, private diagnostic: Diagnostic) {
	  this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
	  this.autocomplete = { input: '' };
	  this.autocompleteItems = [];
	  this.geocoder = new google.maps.Geocoder();
	this.markers = [];
	    


  }
  tryGeolocation() {
    this.diagnostic.getPermissionAuthorizationStatus(this.diagnostic.permission.ACCESS_FINE_LOCATION).then((status) => {
      //console.log("AuthorizationStatus");
      //console.log(status);
      if (status != this.diagnostic.permissionStatus.GRANTED) {
        this.diagnostic.requestRuntimePermission(this.diagnostic.permission.ACCESS_FINE_LOCATION).then((data) => {
          console.log("getCameraAuthorizationStatus");
          console.log(data);
		  if(data == this.diagnostic.permissionStatus.GRANTED) {
			    this.diagnostic.isLocationEnabled().then((isEnabled) => {
  if(!isEnabled){
      //handle confirmation window code here and then call switchToLocationSettings
    this.diagnostic.switchToLocationSettings();
  }else{
        this.tryGeolocationAfterPermission();
  }});
  
			//  this.tryGeolocationAfterPermission();
		  }
        })
      } else {
		    this.diagnostic.isLocationEnabled().then((isEnabled) => {
  if(!isEnabled){
      //handle confirmation window code here and then call switchToLocationSettings
    this.diagnostic.switchToLocationSettings();
  }else{
        this.tryGeolocationAfterPermission();
  }});
       // this.tryGeolocationAfterPermission();
      }
    }, (statusError) => {
      console.log("statusError");
      console.log(statusError);
    });
  } 
 tryGeolocationAfterPermission(){
  this.clearMarkers();
  let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
	this.geolocation.getCurrentPosition().then((resp) => {
	  loading.dismiss();
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
	  loading.dismiss();
   // console.log('Error getting location', error);
  });
} 
 selectSearchResult(item){
  this.clearMarkers();
  this.autocompleteItems = [];
  let place_data: any = {'placeId': item.place_id};
  this.geocodeUserAddress(place_data);
 
} 
 placeToAddress(place){
	 console.log(place,'checkresult');
        var address: any = {};
		
		/*
       place.address_components.forEach(function(c) {
			let types: any = c.types; 
			let lastType: any = types[types.length-1];
			address[types[0]] = c;
			address[lastType] = c;
           /* switch(c.types[0]){
                case 'street_number':
                    address.StreetNumber = c;
                    break;
                case 'route':
                    address.StreetName = c;
                    break;
                case 'neighborhood': case 'locality':    // North Hollywood or Los Angeles?
                    address.City = c;
                    break;
                case 'administrative_area_level_1':     //  Note some countries don't have states
                    address.State = c;
                    break;
                case 'postal_code':
                    address.Zip = c;
                    break;
                case 'country':
                    address.Country = c;
                    break;
               
            }
        });
		address['address']= '';
		
		if(address['sublocality_level_1'] != null && address['sublocality_level_1'] != undefined) {
			if(address['sublocality_level_2'] != '' && address['sublocality_level_2'] != undefined && address['sublocality_level_2'] != null) {
		     	address['address'] += address['sublocality_level_2'].long_name+', ';
		    }
			address['address'] += address['sublocality_level_1'].long_name;
		}else if(address['locality'] != null && address['locality'] != undefined) {
			address['address'] += address['locality'].long_name;
		}*/
		if(place.fullAddress!=null && place.fullAddress!=undefined )
		{
		address['address']= place.fullAddress;	
		}
		if(place.formatted_address!=null && place.formatted_address!=undefined )
		{
		address['address']= place.formatted_address;	
		}
		
	//	place.
        return address;
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
	  let address: any = this.placeToAddress(results[0]);
	  console.log(address,'myaddress');

	  this.ngZone.run(()=>{
		this.currentSelectedAddress = address['address'];  
		
	  });
	  
	  this.userLocationInfo = {address: address['address'], fullAddress: results[0].formatted_address, lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng()};
	  //console.log("results:: ", results);
      
	  this.setUserLocation();
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
		  

	
}

  ionViewDidLoad() {
   // console.log('ionViewDidLoad DetectlocationPage');
  }

}
