import { Component ,NgZone} from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Platform  } from 'ionic-angular';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Geolocation } from '@ionic-native/geolocation';

import { ApiBackendService } from '../../providers/apiBackendService';
import { AuthUserService } from '../../providers/authUserService';
import { Diagnostic } from '@ionic-native/diagnostic';


/**
 * Generated class for the AddaddressPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var google: any;

@IonicPage()
@Component({
  selector: 'page-addaddress',
  templateUrl: 'addaddress.html',
})
export class AddaddressPage {
  addAddressForm: FormGroup;
   userInfo: any = {};
   userAddresses: any = [];
   registerErrorMsg: string = ''; 
   addressInfo: any = {};
     geocoder: any;
  markers: any = [];
  map: any;
     loading: any;
   showothername:boolean=false;
   userlocation:any={};
  address_latlng: any = {lat: 0, lng: 0};
  errormessage:any='';
  constructor(public navCtrl: NavController, public navParams: NavParams, public apiBackendService: ApiBackendService, private authUserService: AuthUserService,  public loadingCtrl: LoadingController, private formBuilder: FormBuilder,private ngZone: NgZone, public geolocation: Geolocation, private platform: Platform,private diagnostic: Diagnostic) {
	  
	   this.authUserService.getUserLocation().then((data)=>{
         console.log("userlocation:: ", data);
          if(data != null && data != undefined) {
              this.userlocation = data;
             // this.loadAddresses();
          }         
          
      });
	  
	   this.loading = this.loadingCtrl.create({
					content: 'Please wait...'
					
				  });
				  
				  
	  	  this.geocoder = new google.maps.Geocoder();

    this.addAddressForm = this.formBuilder.group({
      ab_name: [''],
      ab_mobile_number: [''],
	  ab_houseno: [''],
      ab_pincode: [''],
      ab_state: [''],
      ab_address: [''],
      ab_city: [''],
      ab_locality: [''],
      ab_type: ['1'],
      
        
    });
      
      if(this.navParams.get('addressInfo') != undefined) {
          this.addressInfo = this.navParams.get('addressInfo');
          let house_no: any = '';
		  if(this.addressInfo.ab_houseno != undefined) {
			 house_no =  this.addressInfo.ab_houseno;
		  }
		  if(this.addressInfo.ab_type==3)
		  {
			  this.showothername=true;
		  }
           this.addAddressForm.setValue({                    
                  ab_houseno:house_no,
                  ab_mobile_number: this.addressInfo.ab_mobile_number,
                  ab_name: this.addressInfo.ab_name,
                  ab_pincode: this.addressInfo.ab_pincode,
                  ab_state: this.addressInfo.ab_state,
                  ab_address: this.addressInfo.ab_address,
                  ab_city: this.addressInfo.ab_city,
                  ab_locality: this.addressInfo.ab_locality,
                   ab_type: this.addressInfo.ab_type
                
           });
		   if(this.addressInfo.ab_lat != undefined ) {
			this.address_latlng['lat'] = this.addressInfo.ab_lat;   
		   }
		   
		   if(this.addressInfo.ab_long != undefined ) {
			this.address_latlng['lng'] = this.addressInfo.ab_long;
		   }
		   
      }
  }
placeToAddress(place){
        var address: any = {};
        place.address_components.forEach(function(c) {
			let types: any = c.types; 
			let lastType: any = types[types.length-1];
			address[types[0]] = c.long_name;
			address[lastType] = c.long_name;
            /*switch(c.types[0]){
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
               
            }*/
        });
		address['address']= '';
		address['landmark']= '';
		address['houseno']= '';
		address['city']= '';
		address['state']= '';
		if(address['administrative_area_level_2'] != '' && address['administrative_area_level_2'] != undefined && address['sublocality_level_2'] != null) {
		     	 address['city'] = address['administrative_area_level_2'];
		}else if(address['locality'] != null && address['locality'] != undefined) {
			address['city'] = address['locality'];
		}	
		if(address['point_of_interest'] != null && address['point_of_interest'] != undefined) {
			address['landmark']= address['point_of_interest'];
		}else if(address['neighborhood'] != null && address['neighborhood'] != undefined) {
			address['landmark']= address['neighborhood'];
		}
		if(address['premise'] != null && address['premise'] != undefined) {
			address['houseno']= address['premise'];
		}
		let addressArr = [];
		if(address['sublocality_level_3'] != '' && address['sublocality_level_3'] != undefined && address['sublocality_level_2'] != null) {
		     	 addressArr.push(address['sublocality_level_3']);
		    }
			if(address['sublocality_level_2'] != '' && address['sublocality_level_2'] != undefined && address['sublocality_level_2'] != null) {
		     	 addressArr.push(address['sublocality_level_2']);
		    }
			if(address['sublocality_level_1'] != '' && address['sublocality_level_1'] != undefined && address['sublocality_level_2'] != null) {
			if(address['city'] != address['sublocality_level_1']){		
		     	addressArr.push(address['sublocality_level_1']);
			}
		    }else if(address['locality'] != null && address['locality'] != undefined) {
			if(address['city'] != address['locality']){		
		     	addressArr.push(address['locality']);
			}
		}
		address['address'] = addressArr.join(", ");
		if(address['administrative_area_level_1'] != null && address['administrative_area_level_1'] != undefined) {
			address['state'] = address['administrative_area_level_1'];
		}
		
		
        return address;
    } 
 geocodeUserAddress(addressSource: any) {
	 this.geocoder.geocode(addressSource, (results, status) => {
		 
    if(status === 'OK' && results[0]){
      let position = {
          lat: results[0].geometry.location.lat,
          lng: results[0].geometry.location.lng
      };
	  this.address_latlng['lat'] = results[0].geometry.location.lat();
		   this.address_latlng['lng'] = results[0].geometry.location.lng();
	  let address: any = this.placeToAddress(results[0]);
	  
	   console.log("address:: ", address);
	   console.log("results:: ", results);
	   if(address['address']!='')
	   {
	   this.addAddressForm.setValue({   
				  ab_mobile_number: this.addAddressForm.value['ab_mobile_number'],
                  ab_name: this.addAddressForm.value['ab_name'],	   
                  ab_houseno:  address['houseno'],
                  ab_pincode: address['postal_code'],
                  ab_state: address['state'],
                  ab_address: address['address'],
                  ab_city: address['city'],
                  ab_locality: address['landmark'],
                   ab_type: this.addAddressForm.value['ab_type']
                
           });
	   }else{
		    this.addAddressForm.setValue({   
				  ab_mobile_number: this.addAddressForm.value['ab_mobile_number'],
                  ab_name: this.addAddressForm.value['ab_name'],	   
                  ab_houseno:  address['houseno'],
                  ab_pincode: address['postal_code'],
                  ab_state: address['state'],
                  ab_address: address['locality'],
                  ab_city: address['city'],
                  ab_locality: address['landmark'],
                   ab_type: this.addAddressForm.value['ab_type']
                
           }); 
		   
	   }
	  
		  
		  //this.setUserLocation();
	  
    }
 });
 }
  initPage(){
	  if(this.address_latlng['lat'] != 0 && this.address_latlng['lng'] != 0) {
		  this.loadMap(this.address_latlng['lat'], this.address_latlng['lat']);
	  }else{
			this.geolocation.getCurrentPosition().then(result => {
				//console.log(result.coords.latitude);
			  console.log(result.coords.longitude);
			  this.address_latlng['lat'] = result.coords.latitude;
			  this.address_latlng['lng'] = result.coords.longitude;
			  
			  this.loadMap(result.coords.latitude, result.coords.longitude);
			  
					  console.log(this.address_latlng,"test");
   
		  this.geocodeUserAddress({
			  lat: result.coords.latitude,
			  lng: result.coords.longitude
			});
		
			  
		  });
	  }
  }
    addMarker(){
     
      let marker = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: this.map.getCenter()
      });
     
      let content = "<h4>Information!</h4>";         
      this.addInfoWindow(marker, content);
     
    }
    
      addInfoWindow(marker, content){
        let infoWindow = new google.maps.InfoWindow({
          content:content
        })
    
        google.maps.event.addListener(marker, 'click', () => {
          infoWindow.open(this.map, marker);
        })
    
      }
        loadMap(lat, lng){
        let latLng = new google.maps.LatLng(lat, lng);
    
        let mapOption = {
          center: latLng,
          zoom: 17,
          mapTypeId:'roadmap',
          disableDefaultUI: true
        }
    
        let element = document.getElementById('map');
    
        this.map = new google.maps.Map(element, mapOption);
    
        let marker = new google.maps.Marker({
          position: latLng,
          title: 'Current Location',
		  draggable: true
          
        })
		let objElement: any = this;
        google.maps.event.addListener(marker, 'dragend', function (event) {
			 console.log('event:: ', event);
			 console.log('lat:: ', event.latLng.lat());
			 console.log('lng:: ', event.latLng.lng());
			 
			 let pos = {
			  lat: event.latLng.lat(),
			  lng: event.latLng.lng()
			};
			let place_data: any = {'location': pos};
		  objElement.geocodeUserAddress(place_data);
			 
		});
        let content = '<div id="myId" class="item item-thumbnail-left item-text-wrap">';
           content += ' <ion-item>';
              content += '<ion-row>';
               content += '<h6> '+marker.title+'</h6>';
               content += '<h6> '+ marker.position +'</h6>';
              content += '</ion-row>';
            content += '</ion-item>';
          content += '</div>';
        
        this.addInfoWindow(marker, content);
        marker.setMap(this.map);
    
        // this.loadPoints();
      }
	  
  ionViewWillEnter() {	  	 	      
     this.platform.ready().then(() => {
		 
		  this.diagnostic.getPermissionAuthorizationStatus(this.diagnostic.permission.ACCESS_FINE_LOCATION).then((status) => {
      
      if (status != this.diagnostic.permissionStatus.GRANTED) {
        this.diagnostic.requestRuntimePermission(this.diagnostic.permission.ACCESS_FINE_LOCATION).then((data) => {
            if(data == this.diagnostic.permissionStatus.GRANTED) {
				  this.diagnostic.isLocationEnabled().then((isEnabled) => {
  if(!isEnabled){
      //handle confirmation window code here and then call switchToLocationSettings
    this.diagnostic.switchToLocationSettings();
  }else{
       this.initPage();
  }});
			 
		    }
        })
      } else {
		    this.diagnostic.isLocationEnabled().then((isEnabled) => {
  if(!isEnabled){
      //handle confirmation window code here and then call switchToLocationSettings
    this.diagnostic.switchToLocationSettings();
  }else{
        this.initPage();
  }});
      }
    }, (statusError) => {
      console.log("statusError");
      console.log(statusError);
    });
          
          
        });
      this.authUserService.getUser().then((user)=>{
          console.log("user:: ", user);
          if(user != null && user != undefined) {
              this.userInfo = user;
          }         
          
      });
      
      let user_req = {
              ab_user_id: this.userInfo.user_id
          };
         let loading = this.loadingCtrl.create({
                content: 'Please wait...'
              });
              loading.present();
         this.apiBackendService.getUserAddresses(user_req).then((result: any) => { 
             loading.dismiss();
             console.log("result::", result);
            this.userAddresses = result;

            }, (err) => { 
            console.log(err); 
             loading.dismiss();
            });

  } 
  
  addUserAddress() {
      this.registerErrorMsg = '';
      let credentials = this.addAddressForm.value;
     credentials['ab_user_id'] = this.userInfo.user_id;
      if(this.addressInfo['ab_id'] != undefined) {
          credentials['ab_id'] = this.addressInfo['ab_id'];
      }else{
		            credentials['ab_id'] = 0;

		  
	  }
	  credentials['ab_lat'] = this.address_latlng['lat'];
		credentials['ab_long'] =   this.address_latlng['lng'];
		
		if( credentials['ab_lat']=='')
		{
			this.errormessage ='Please drag n drop on map for accuracy';
			return;
		}
		if( credentials['ab_address']=='')
		{
			this.errormessage ='Please Enter Location';
			return;
		}
		if( credentials['ab_houseno']=='')
		{
			this.errormessage ='Please Enter HOUSE / FLAT NO.';
			return;
		}
		if( credentials['ab_locality']=='')
		{
			this.errormessage ='Please Enter LANDMARK';
			return;
		}
		
		
		
		
						  this.loading.present();

     this.apiBackendService.addUserAddresses(credentials).then((result: any) => {         
         
         if(result.message == 'failed') {
              this.registerErrorMsg = result.notification;
         }else
          if(result.message == 'ok') {             
                 this.backButtonAction();
				 				  this.loading.dismiss();

          }
          
        }, (err) => { 
        console.log(err);
		this.loading.dismiss();

        });
	  
  }
  backButtonAction(){
     this.navCtrl.pop();
	}
	
	hidemewhen()
	{
		      let credentials = this.addAddressForm.value;

		//console.log("test",this.addAddressForm.ab_type);
		if(credentials['ab_type']=='3')
		{
			
			this.showothername =true;
		}else{
			
			this.showothername =false;
		}
		
	}
}
