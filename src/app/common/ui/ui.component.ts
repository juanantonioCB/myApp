import { Component, OnInit } from '@angular/core';
import { LoadingController, ToastController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-ui',
  templateUrl: './ui.component.html',
  styleUrls: ['./ui.component.scss'],
})
export class UiComponent implements OnInit {

  constructor(private loadingController: LoadingController,
    private toastController: ToastController,
    private alertController: AlertController) { }
  loading: HTMLIonLoadingElement;
  ngOnInit() { }

  
  public async presentLoading() {
    await this.hideLoading();

    this.loading = await this.loadingController.create({

    });
    await this.loading.present();
  }

  async presentAlert(title:string,subtitle:string,message:string) {
    const alert = await this.alertController.create({
      header: title,
      subHeader: subtitle,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  public async hideLoading() {
    if (this.loading) {
      await this.loading.dismiss();
    }
    this.loading = null;
  }



  public async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color
    });
    toast.present();
  }



  generateImage(img: string,
    quality: number = 1,
    MAX_WIDTH: number,
    MAX_HEIGHT: number) {
    return new Promise((resolve, reject) => {
      const canvas: any = document.createElement('canvas');
      const image = new Image();
      image.crossOrigin = 'Anonymous';
      image.src = img;
      image.onload = () => {
        let width = image.width;
        let height = image.height;
        if (!MAX_HEIGHT) {
          MAX_HEIGHT = image.height;
        }
        if (!MAX_WIDTH) {
          MAX_WIDTH = image.width;
        }
        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0, width, height);
        const dataUrl = canvas
          .toDataURL('image/jpeg', quality)
          .replace(/^data:image\/(png|jpg|jpeg);base64,/, '');
        resolve(dataUrl);
      };
      image.onerror = e => {
        reject(e);
      };
    });
  }
  getImageFromBase64(base64: string) {
    return 'data:image/jpeg;base64,' + base64;
  }


}
