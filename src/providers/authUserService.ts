import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable()
export class AuthUserService {
  
  constructor(private storage: Storage) {
    console.log('Hello RestProvider Provider');
  }
    
  getUser() {
      return new Promise(resolve => {
        this.storage.get('current_user').then(data => {
          resolve(data);
        });
      });
  } 
    
  getUserLocation() {
      return new Promise(resolve => {
        this.storage.get('current_user_location').then(data => {
			    resolve(data);
        });
      });
  } 	
  saveUser(user_data: any) {    
    return new Promise(resolve => {  
        this.storage.set('current_user', user_data);  
        resolve(true);
    });    
  } 
  
  saveUserLocation(user_location_data: any) {    
    return new Promise(resolve => {  
	console.log("user_location_data:: ", user_location_data);
        this.storage.set('current_user_location', user_location_data);  
        resolve(true);
    });    
  } 
  
  logoutUser() {
      return new Promise(resolve => {  
        this.storage.set('current_user', null);  
        resolve(true);
    });
  }
  
}
