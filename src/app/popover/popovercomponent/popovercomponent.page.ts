import { Component, OnInit } from '@angular/core';
import {PopoverController} from '@ionic/angular';
@Component({
  selector: 'app-popovercomponent',
  templateUrl: './popovercomponent.page.html',
  styleUrls: ['./popovercomponent.page.scss'],
})
export class PopovercomponentPage implements OnInit {

  constructor(private popoverController:PopoverController) { }

  ngOnInit() {
  }

  close(){
    this.popoverController.dismiss();
  }

  lanzarCamara(){
    this.popoverController.dismiss('camera');
  }

  lanzarGaleria(){
    this.popoverController.dismiss('gallery');

  }
}
