import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { UiComponent } from '../common/ui/ui.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(private auth: AuthService, private loading: UiComponent, private router: Router) { }

  ngOnInit() {
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
