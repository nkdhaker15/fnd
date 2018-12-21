import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { HttpModule } from '@angular/http';
import { SocialSharing } from '@ionic-native/social-sharing';
/*import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder } from '@ionic-native/native-geocoder';
import { Facebook } from '@ionic-native/facebook';*/

import { MyApp } from './app.component';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { AftersplashPage } from '../pages/aftersplash/aftersplash';
import { LoginPage } from '../pages/login/login';
import { SignuponePage } from '../pages/signupone/signupone';
import { SignupotpPage } from '../pages/signupotp/signupotp'; 
import { SignupfinalPage } from '../pages/signupfinal/signupfinal';
import { MyaccountPage } from '../pages/myaccount/myaccount';
import { OrderdetailPage } from '../pages/orderdetail/orderdetail';
import { RmenuPage } from '../pages/rmenu/rmenu';
//import { SearchdataPage } from '../pages/searchdata/searchdata';

import { AddressbookPage } from '../pages/addressbook/addressbook';
import { CartPage } from '../pages/cart/cart';
import { ChangepasswordPage } from '../pages/changepassword/changepassword';
import { ForgotpasswordPage } from '../pages/forgotpassword/forgotpassword';
import { EditprofilePage } from '../pages/editprofile/editprofile';
import { OffersPage } from '../pages/offers/offers';
import { OrdersPage } from '../pages/orders/orders';
import { SharePage } from '../pages/share/share';
import { FaqPage } from '../pages/faq/faq';
import { ExplorePage } from '../pages/explore/explore';

import { AddaddressPage } from '../pages/addaddress/addaddress';
import { ApiBackendService } from '../providers/apiBackendService';
import { AuthUserService } from '../providers/authUserService';
//import { DetectlocationPage } from '../pages/detectlocation/detectlocation';

import { AndroidFullScreen } from '@ionic-native/android-full-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StarRatingModule } from 'ionic3-star-rating';
import { ShrinkingSegmentHeader } from '../components/shrinking-segment-header/shrinking-segment-header';

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
	CartPage,
    HomePage,
	EditprofilePage,
	AftersplashPage,
	LoginPage,
	SignuponePage,
	SignupotpPage,
	SignupfinalPage,
	MyaccountPage,
	AddressbookPage,
	ChangepasswordPage,
	ForgotpasswordPage,
	OffersPage,
	OrdersPage,
	SharePage,
	FaqPage,
	OrderdetailPage,
	AddaddressPage,
	RmenuPage,
    TabsPage,
	ExplorePage,
	
	ShrinkingSegmentHeader
  ],
  imports: [
    BrowserModule,
    HttpModule,  
	StarRatingModule,
    IonicStorageModule.forRoot(),  
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
	AftersplashPage,
    HomePage,
	CartPage,
	AddressbookPage,
	LoginPage,
	SignuponePage,
	SignupotpPage,
	SignupfinalPage,
	MyaccountPage,
	EditprofilePage,
	ChangepasswordPage,
	ForgotpasswordPage,
	OffersPage,
	OrdersPage,
	SharePage,
	OrderdetailPage,
	FaqPage,
	AddaddressPage,
	RmenuPage,
    TabsPage,
	ExplorePage
	
  ],
  providers: [
    StatusBar,
    SplashScreen,
	AndroidFullScreen,
    ApiBackendService,  
    AuthUserService,  
      SocialSharing,
   /* Geolocation,  
    NativeGeocoder,  
    Facebook,  */
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}