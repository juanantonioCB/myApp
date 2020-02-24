import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { UiComponent } from '../common/ui/ui.component';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Tab1Page } from '../tab1/tab1.page';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  userForm:FormGroup;
  constructor(private auth: AuthService, private loading: UiComponent, private router: Router,
    private formBuilder: FormBuilder,private ui:UiComponent) { }

  ngOnInit() {
    this.userForm=this.formBuilder.group({
      email:['',[Validators.required,Validators.email]],
      password:['',Validators.required]
    });
  }

  async login(){
    await this.ui.presentLoading();

    this.auth.doLogin(this.userForm.get('email').value,this.userForm.get('password').value).then(r=>{
      this.router.navigate([Tab1Page]);
    }).catch(async err=>{
      await this.ui.presentAlert('Error','',err);
    })
    await this.ui.hideLoading();

  }

  public async loginGoogle() {
    this.loading.presentLoading();
    const r: boolean = await this.auth.loginGoogle();
    this.loading.hideLoading();
    if (r) {
      this.router.navigate(['/tabs']);
    }
  }
}
