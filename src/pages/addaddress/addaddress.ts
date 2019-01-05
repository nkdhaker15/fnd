import { Component ,NgZone} from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Geolocation } from '@ionic-native/geolocation';

import { ApiBackendService } from '../../providers/apiBackendService';
import { AuthUserService } from '../../providers/authUserService';


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
  constructor(public navCtrl: NavController, public navParams: NavParams, public apiBackendService: ApiBackendService, private authUserService: AuthUserService,  public loadingCtrl: LoadingController, private formBuilder: FormBuilder,private ngZone: NgZone, private geolocation: Geolocation) {
	  	  this.geocoder = new google.maps.Geocoder();

    this.addAddressForm = this.formBuilder.group({
      ab_name: [''],
      ab_mobile_number: [''],
      ab_pincode: [''],
      ab_state: [''],
      ab_address: [''],
      ab_city: [''],
      ab_locality: [''],
      ab_type: [''],
      ab_default: [''],
        
    });
      
      if(this.navParams.get('addressInfo') != undefined) {
          this.addressInfo = this.navParams.get('addressInfo');
          
           this.addAddressForm.setValue({
                    ab_name: this.addressInfo.ab_name,
                  ab_mobile_number: this.addressInfo.ab_mobile_number,
                  ab_pincode: this.addressInfo.ab_pincode,
                  ab_state: this.addressInfo.ab_state,
                  ab_address: this.addressInfo.ab_address,
                  ab_city: this.addressInfo.ab_city,
                  ab_locality: this.addressInfo.ab_locality,
                   ab_type: this.addressInfo.ab_type,
                ab_default: this.addressInfo.ab_default==true?1:0,
           });
      }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddaddressPage');
	this.map = new google.maps.Map(document.getElementById('map'), {
		center: { lat: -34.9011, lng: -56.1645 },
		zoom: 15,
		            mapTypeId: google.maps.MapTypeId.ROADMAP,
		 disableDefaultUI: true
	});
	/*
	this.map.addMarker({
                  title: 'Ionic',
                  icon: 'blue',
                  animation: 'DROP',
                  draggable:true,
                  position: {
                    lat: -34.9011,
                    lng: -56.1645
                  }
                })
                .then(marker => {
                  marker.on(GoogleMapsEvent.MARKER_DRAG_END)
                    .subscribe(() => {
                      marker.getCurrentPosition().then((resp) => {

                           console.log(resp);

                          }).catch((error) => {
                            console.log('Error getting location', error);
                          });
                    });
                });*/

             
  }
    
  ionViewWillEnter() {	  	 	      
    
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
      }
     this.apiBackendService.addUserAddresses(credentials).then((result: any) => {         
         
         if(result.message == 'failed') {
              this.registerErrorMsg = result.notification;
         }else
          if(result.message == 'ok') {             
                 
          }
          
        }, (err) => { 
        console.log(err); 
        });
	  
  }
  backButtonAction(){
     this.navCtrl.pop();
	}
}
