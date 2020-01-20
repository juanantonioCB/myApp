import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  constructor(private translate: TranslateService, private auth:AuthService) { }

  async ionViewDidEnter() {
    this.translate.get('hellow').subscribe(value => {
      console.log(value)
    });
    this.translate.use('en');
    let mipalabra = await this.translate.get('close').toPromise();
  }

  public logout(){
    this.auth.logout();
  }
}
