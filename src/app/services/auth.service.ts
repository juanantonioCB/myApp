import { Injectable } from '@angular/core';
import { User } from '../model/User';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public user: User/*= {
    email: 'test@test.com',
    displayName: 'test',
    imageURL: '',
    userId: '1'
  }*/;
  constructor(private local: NativeStorage, private google: GooglePlus, private router: Router) { 
    
  }

  public async checkSesion(): Promise<void> {
    if (!this.user) {
      try {
        this.user = await this.local.getItem('user');
      } catch (err) {
        this.user = null;
      }

    }
  }
  public isAuthenticated(): boolean {
    return this.user ? true : false;
  }

  public async saveSession(user?: User) {
    if (user) {
      await this.local.setItem('user', user);
    } else {
      await this.local.remove('user');
    }
  }

  public loginGoogle():Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.google.login({

      }).then(d => {
        console.log(d);
        if (d && d.email) {
          let user: User = {
            email: d.email,
            displayName: d.displayName,
            imageURL: d.imageUrl,
            userId: d.userId
          }
          this.user = user;
          this.saveSession(user);
          resolve(true);
        }else{
          resolve(false);
        }
      })
        .catch(err => {console.log(err);resolve(false);
        });
    });
  }

  public async logout() {
    await this.google.logout();
    this.user = null;
    await this.saveSession();
    this.router.navigate(['login']);

  }

}
