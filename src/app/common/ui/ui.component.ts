import { Component, OnInit } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-ui',
  templateUrl: './ui.component.html',
  styleUrls: ['./ui.component.scss'],
})
export class UiComponent implements OnInit {

  constructor(private loadingController: LoadingController,
    private toastController: ToastController) { }
  loading: HTMLIonLoadingElement;
  ngOnInit() { }

  public async presentLoading() {
    await this.hideLoading();

    this.loading = await this.loadingController.create({

    });
    await this.loading.present();
  }

  public async hideLoading(){
    if(this.loading){
      await this.loading.dismiss();
    }
    this.loading=null;
  }

  public async presentToast(message:string, color:string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color:color
    });
    toast.present();
  }



}
