import { Injectable } from '@angular/core';
import { User } from '../model/User';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Router } from '@angular/router';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuth } from '@angular/fire/auth'
import {auth} from 'firebase/app';
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
  constructor(private fAuth:AngularFireAuth,
    private local: NativeStorage, private google: GooglePlus, private router: Router) { 
    
  }

  doRegister(email:string,password:string,name:string){
    return this.fAuth.auth.createUserWithEmailAndPassword(email,password).then(r=>{
      let user: User = {
        email: r.user.email,
        displayName: name,
        imageURL: '',
        userId: r.user.uid
      }
      this.user = user;
      this.saveSession(user);
    });
  }

  doLogin(email:string,password:string){
    return this.fAuth.auth.signInWithEmailAndPassword(email,password).then(r=>{
      let user: User = {
        email: r.user.email,
        displayName: r.user.displayName,
        imageURL: '',
        userId: r.user.uid
      }
      this.user = user;
      this.saveSession(user);
    })
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
