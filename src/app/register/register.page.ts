import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { UiComponent } from '../common/ui/ui.component';
import { Router } from '@angular/router';
import { Tab1Page } from '../tab1/tab1.page';
import { Tab1PageModule } from '../tab1/tab1.module';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  registerForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private auth: AuthService,
    private ui: UiComponent,
    private router:Router) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]

    });
  }

  async doRegister() {
    await this.ui.presentLoading();
    this.auth.doRegister(this.registerForm.get('email').value, this.registerForm.get('password').value,
    this.registerForm.get('name').value).then(res => {
      this.router.navigate([Tab1Page]);
    }).catch(err => {
      this.ui.presentAlert('Error', '', err);
    });
    await this.ui.hideLoading();
  }

}
