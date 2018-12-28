import { Component } from '@angular/core';
import {  NavController } from 'ionic-angular';
import { OrdersPage } from '../orders/orders';
import { MyaccountPage } from '../myaccount/myaccount';
import { HomePage } from '../home/home';
import { ExplorePage } from '../explore/explore';
import { LoginPage } from '../login/login';

import { AuthUserService } from '../../providers/authUserService';

import { StatusBar } from '@ionic-native/status-bar';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  tab1Root = HomePage;
  tab3Root = ExplorePage;
  tab4Root = MyaccountPage;
  tabBarElement: any;
  userInfo: any = {};

  constructor(public statusBar: StatusBar,public navCtrl: NavController,private authUserService: AuthUserService) {
  statusBar.show();
	   statusBar.styleDefault();
      statusBar.overlaysWebView(false);
      statusBar.backgroundColorByHexString('#000000');

	  
  }
  ionViewDidLoad() {
		      //this.tabBarElement.style.display = 'visible';

  } 
  ionViewWillEnter() {
	  	 	      this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
				  if (this.tabBarElement) {
		      this.tabBarElement.style.display = 'flex';
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
  
}
