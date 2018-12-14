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
    
  saveUser(user_data: any) {    
    return new Promise(resolve => {  
        this.storage.set('current_user', user_data);  
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
