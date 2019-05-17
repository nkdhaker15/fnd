import { Component } from '@angular/core';
import {  NavController } from 'ionic-angular';
import { OrdersPage } from '../orders/orders';
import { MyaccountPage } from '../myaccount/myaccount';
import { HomePage } from '../home/home';
import { ExplorePage } from '../explore/explore';
import { LoginPage } from '../login/login';
import { DisclaimerPage } from '../disclaimer/disclaimer';
import { Storage } from '@ionic/storage';
import { SearchdataPage } from '../searchdata/searchdata';

import { AuthUserService } from '../../providers/authUserService';

import { StatusBar } from '@ionic-native/status-bar';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  tab1Root = HomePage;
  tab3Root = ExplorePage;
  tab4Root = MyaccountPage;
  tab5Root = DisclaimerPage;
  tabBarElement: any;
  userInfo: any = {};
  searchdataobj: any = {};
   hidetab:boolean=false;
  constructor(public statusBar: StatusBar,public navCtrl: NavController,private authUserService: AuthUserService,public storage: Storage) {
  statusBar.show();
	   
      statusBar.overlaysWebView(false);
      statusBar.backgroundColorByHexString('#ffffff');
statusBar.styleDefault();

this.navCtrl.setRoot(HomePage);
	  
  }
  ionViewDidLoad() {
		      //this.tabBarElement.style.display = 'visible';

  } 
  ionViewWillEnter() {
				  if (this.tabBarElement) {
		      this.tabBarElement.style.display = 'none';
				  }
	  
      this.authUserService.getUser().then((user)=>{
          console.log("user:: ", user);
          if(user != null && user != undefined) {
              this.userInfo = user;
          }         
          
      });
      
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
										this.navCtrl.setRoot(DisclaimerPage);	  
		
					  }
					  
			});  
  }
  
}
