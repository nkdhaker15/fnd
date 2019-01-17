import { Component, ViewChild  } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, Slides, LoadingController   } from 'ionic-angular';
import { FormBuilder, FormGroup } from '@angular/forms';

import { ApiBackendService } from '../../providers/apiBackendService';
import { AuthUserService } from '../../providers/authUserService';
/**
 * Generated class for the RatingreviewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ratingreview',
  templateUrl: 'ratingreview.html',
})
export class RatingreviewPage {
  @ViewChild('mySlider') slider:  Slides;	
  userInfo: any = {};
  driverRatingForm: FormGroup;
  sellerRatingForm: FormGroup;
  selectedSlideIndex: any = 0;
  selectOrderId: any = 0;
  orderinfo:any={};
  constructor(public navCtrl: NavController, public navParams: NavParams, public apiBackendService: ApiBackendService, private authUserService: AuthUserService, private formBuilder: FormBuilder, public events: Events,  public loadingCtrl: LoadingController) {
     this.driverRatingForm = this.formBuilder.group({
      driver_rating: [''],
      driver_review: [''],
    });
	this.sellerRatingForm = this.formBuilder.group({
      seller_rating: [''],
      seller_review: [''],
    });
	let objElement: any = this;
	this.events.subscribe('star-rating:changed', (starRating) => {console.log('selectedSlideIndex:: ', objElement.selectedSlideIndex, starRating);
	    if(objElement.selectedSlideIndex >0) {
				objElement.sellerRatingForm.patchValue({seller_rating: starRating});
				         
		}else {
			objElement.driverRatingForm.patchValue({driver_rating: starRating});
		}
	});
	if(this.navParams.get('orderinfo') != undefined) {
		this.orderinfo = this.navParams.get('orderinfo');
		this.selectOrderId = this.orderinfo.trans_id;
		console.log("test",this.orderinfo);
	}
  }
  slideChanged() {
    this.selectedSlideIndex = this.slider.getActiveIndex();
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RatingreviewPage');
  }
  
  ionViewWillEnter() {	  	 	      
    
      this.authUserService.getUser().then((user)=>{
          console.log("user:: ", user);
          if(user != null && user != undefined) {
              this.userInfo = user;
             // this.loadFaq();
          }         
          
      });
      
      

  }
  saveDriverRating() {
      
      let credentials = this.driverRatingForm.value;
     credentials['user_id'] = this.userInfo.user_id;
     credentials['order_id'] = this.selectOrderId;
     let loading: any = this.loadingCtrl.create({
					content: 'Please wait...'
					
				  });
	 
		loading.present();

     this.apiBackendService.saveDriverRating(credentials).then((result: any) => {         
         
         loading.dismiss();
              this.slider.slideTo(2, 500);
          
        }, (err) => { 
        console.log(err);
		loading.dismiss();

        });
	  
  }
   saveSellerRating() {
      
      let credentials = this.sellerRatingForm.value;
     credentials['user_id'] = this.userInfo.user_id;
	 credentials['order_id'] = this.selectOrderId;
     let loading: any = this.loadingCtrl.create({
					content: 'Please wait...'
					
				  });
	 
		loading.present();

     this.apiBackendService.saveSellerRating(credentials).then((result: any) => {         
         
         loading.dismiss();
          this.navCtrl.pop();
          
        }, (err) => { 
        console.log(err);
		loading.dismiss();

        });
	  
  }

}
