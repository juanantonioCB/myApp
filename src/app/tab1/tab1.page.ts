import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../services/auth.service';
import { StreamingMedia, StreamingVideoOptions } from '@ionic-native/streaming-media/ngx';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { UiComponent } from '../common/ui/ui.component';
import { IncidenciasService } from '../servicios/incidencias.service';
import { Incidencia } from '../model/Incidencia';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  nombre: any;
  imagen: any;
  reproduciendo:boolean;
  incidencias:Incidencia[];
  constructor(private translate: TranslateService, private auth: AuthService,
    private nativeAudio: NativeAudio,
    private db:IncidenciasService,
    private ui:UiComponent) {
    this.nombre = auth.user.displayName;
    this.imagen = auth.user.imageURL;
  }

  ngOnInit(){
    this.db.getIncidencias().subscribe(res=>{
      this.incidencias=res;
    });
  }


  async radio() {
    if(!this.reproduciendo){
      await this.ui.presentLoading();
      this.nativeAudio.preloadSimple('uniqueId1', 'http://20423.live.streamtheworld.com/LOS40.mp3');
      this.nativeAudio.play('uniqueId1').then(d=>{
        this.reproduciendo=true;
      });
      await this.ui.hideLoading();
    }else{
      await this.ui.presentLoading();
      await this.nativeAudio.stop('uniqueId1');
      this.reproduciendo=false;
      await this.ui.hideLoading();
    }

  }

  public logout() {
    this.auth.logout();
  }
}
