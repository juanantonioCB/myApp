import { Component, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { GoogleMaps, GoogleMap, GoogleMapsEvent, GoogleMapOptions, CameraPosition, MarkerOptions, Marker, Environment, LocationService, MyLocation, Geocoder, GeocoderResult } from '@ionic-native/google-maps';
import { Incidencia } from '../model/Incidencia';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { PopovercomponentPage } from '../popover/popovercomponent/popovercomponent.page';
import { PopoverController } from '@ionic/angular';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { IncidenciasService } from '../servicios/incidencias.service';
import { UiComponent } from '../common/ui/ui.component';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  gmap: GoogleMap;
  image: any;
  incidenciaForm: FormGroup;
  pickupLocation: string;
  ubicacion: string;
  isRunning: boolean;
  incidencia: Incidencia;
  constructor(private formBuilder: FormBuilder, private router: Router,
    private popoverController: PopoverController,
    private ui: UiComponent,
    private camera: Camera,
    private incidenciaDB: IncidenciasService,
    private imagePicker: ImagePicker) {
    this.incidencia = {
      nombre: '',
      descripcion: '',
      imagen: '',
      latitud: undefined,
      longitud: undefined
    }
  }

  ngOnInit() {
    this.image = 'assets/no_image.png';
    this.incidenciaForm = this.formBuilder.group({
      titulo: ['', [Validators.required, Validators.minLength(5)]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]]
    });
    this.loadmap();
  }

  public choosePhoto() {
    let options = {
      maximumImagesCount: 1,
      width: 800,
      height: 800,
      quality: 100,
    };
    this.imagePicker.getPictures(options).then((results) => {
      for (var i = 0; i < results.length; i++) {
        console.log('Image URI: ' + results[i]);
      }
    }, (err) => { });
  }

  public takePhoto() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      this.image = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
      // Handle error
    });
  }

  createPopover() {
    this.popoverController.create({
      component: PopovercomponentPage,
      showBackdrop: false,

    }).then((popoverElement) => {
      popoverElement.onDidDismiss().then((d) => {
        console.log(d)
        if (d.data) {
          if (d.data === 'camera') {
            this.takePhoto();
          }
          if (d.data === 'gallery') {
            this.choosePhoto();
          }
        }
      })
      popoverElement.present();
    })
  }




  async crearIncidencia() {

    console.log('TEST'+this.incidenciaForm.get('titulo').value);
    this.incidencia.nombre = this.incidenciaForm.get('titulo').value;
    this.incidencia.descripcion = this.incidenciaForm.get('descripcion').value;
    if (this.image != 'assets/no_image.png') {
      this.incidencia.imagen = this.image;
    }

    await this.ui.presentLoading();
    this.incidenciaDB.addIncidencia(this.incidencia).then(async res => {
      console.log(res);
      await this.ui.presentToast('Incidencia agregada correctamente', 'success');
    }
    ).catch(async e => {
      await this.ui.presentToast('Ha ocurrido un error', 'danger');
    });
    await this.ui.hideLoading();


  }

  cargarUbicacion() {
    // Address -> latitude,longitude
    Geocoder.geocode({
      "address": this.ubicacion
    }).then((results: GeocoderResult[]) => {
      this.incidencia.latitud = results[0].position.lat;
      this.incidencia.longitud = results[0].position.lng;
      if (!results.length) {
        this.isRunning = false;
        return null;
      }
      // Add a marker
      let marker: Marker = this.gmap.addMarkerSync({
        'position': results[0].position,
        'title': JSON.stringify(results[0].position)
      });
      // Move to the position
      this.gmap.animateCamera({
        'target': marker.getPosition(),
        'zoom': 17
      }).then(() => {
        marker.showInfoWindow();
        this.isRunning = false;
      });
    });
  }

  cargarImagen() {

  }

  loadmap() {
    LocationService.getMyLocation().then((myLocation: MyLocation) => {
      this.incidencia.latitud=myLocation.latLng.lat;
      this.incidencia.longitud=myLocation.latLng.lng;
      let options: GoogleMapOptions = {
        camera: {
          target: myLocation.latLng,
          zoom: 15
        }
      };
      this.gmap = GoogleMaps.create('map_canvas', options);

    });
  }

}


