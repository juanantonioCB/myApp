import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../services/auth.service';
import { StreamingMedia, StreamingVideoOptions } from '@ionic-native/streaming-media/ngx';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { UiComponent } from '../common/ui/ui.component';
import { IncidenciasService } from '../servicios/incidencias.service';
import { Incidencia } from '../model/Incidencia';
import { Router } from '@angular/router';
import { Tab2Page } from '../tab2/tab2.page';
import { trigger, state, style, animate, transition } from "@angular/animations";
import { NativeStorage } from '@ionic-native/native-storage/ngx';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  nombre: any;
  imagen: any;
  email: any;
  textoBuscar: string = '';
  reproduciendo: boolean;
  incidencias: Incidencia[];

  constructor(private translate: TranslateService, private auth: AuthService,
    private nativeAudio: NativeAudio,
    private db: IncidenciasService,
    private router: Router,
    private local:NativeStorage,
    private ui: UiComponent) {
    this.nombre = auth.user.displayName;
    this.imagen = auth.user.imageURL;
    this.email = auth.user.email;
  }

  async ngOnInit() {
    await this.cargarLocal();
    this.db.getIncidencias().subscribe(res => {
      this.incidencias = res;
      this.guardarLocal();
    });
    this.cargarLocal();
  }

  async guardarLocal(){
    await this.local.setItem('incidencias',this.incidencias);
  }

  async cargarLocal(){
    this.local.getItem('incidencias').then(r=>{
      this.incidencias=r;
    }).catch(err=>{
      console.log(err);
    })
  }

  async radio() {
    if (!this.reproduciendo) {
      await this.ui.presentLoading();
      
      this.nativeAudio.preloadSimple('uniqueId1', 'http://radioclasica.rtveradio.cires21.com/radioclasica/mp3/icecast.audio').then(r=>{
        this.nativeAudio.play('uniqueId1').then(d => {
          this.reproduciendo = true;
        }).catch(err=>{
          console.log(err);
        });
      });
      
      await this.ui.hideLoading();
    } else {
      await this.ui.presentLoading();
      await this.nativeAudio.stop('uniqueId1');
      await this.nativeAudio.unload('uniqueId1');
      this.reproduciendo = false;
      await this.ui.hideLoading();
    }
  }

  buscarIncidencia(event) {
    this.textoBuscar = event.target.value;
  }

  doRefresh(event) {
    console.log('Async operation has ended');
    this.db.getIncidencias().subscribe(res => {
      this.incidencias = res;
      event.target.complete();
    });
  }

  edit(id: string) {
    this.router.navigate([Tab2Page, id]);
  }

  async delete(id: any) {
    console.log('delete');
    console.log(id);
    await this.ui.presentLoading();
    this.db.removeIncidencia(id).then(r => {
      this.ui.presentToast('Incidencia eliminada correctamente', 'success');
    }).catch(err => {
      console.log(err);
      this.ui.presentToast('Error al borrar la incidencia', 'danger');
    });
    await this.ui.hideLoading();
  }

  public logout() {
    this.auth.logout();
  }

}
