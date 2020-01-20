import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Globalization } from '@ionic-native/globalization/ngx';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from './services/auth.service';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private globalization: Globalization,
    private translate: TranslateService,
    private auth: AuthService,
    private router: Router
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(async () => {
      this.translate.setDefaultLang('es');
      this.globalization.getPreferredLanguage()
        .then(res => {
          const language = res.value.substring(0, 2);
          if (language === 'es') {
            this.translate.use('es');
          } else {
            this.translate.use('en');
          }
        })
        .catch(e => console.log(e));
      await this.auth.checkSesion();
      if (this.auth.isAuthenticated()) {
        this.router.events.subscribe(event => {
          if (event instanceof NavigationEnd) {
            if (this.router.url === '/' || this.router.url === '/login') {
              this.router.navigate(['/tabs']);
            }
          }
        })
      }
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
