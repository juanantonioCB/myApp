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
import { StreamingMedia, StreamingVideoOptions } from '@ionic-native/streaming-media/ngx';
import { Tab1Page } from '../tab1/tab1.page';



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
    private imagePicker: ImagePicker,
  ) {
    this.incidencia = {
      nombre: undefined,
      descripcion: undefined,
      imagen: '',
      latitud: 0,
      longitud: 0
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
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then(async (imageData) => {
      await this.ui.generateImage('data:image/jpeg;base64,' + imageData, 1, 300, 300).then(im => {
        this.image = 'data:image/jpeg;base64,' + im;
      }).catch(err => {
        console.log('ERROR DE COMPRESIÓN' + err);
        this.image === undefined;
      });

    }, (err) => {
      console.log('ERROR EN LA CÁMARA '+err);
      this.ui.presentToast('Ha ocurrido un error al cargar la cámara', 'danger');
    });
  }


  createPopover() {
    this.popoverController.create({
      component: PopovercomponentPage,
      showBackdrop: false,

    }).then((popoverElement) => {
      popoverElement.onDidDismiss().then((d) => {
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
    this.incidencia.nombre = this.incidenciaForm.get('titulo').value;
    this.incidencia.descripcion = this.incidenciaForm.get('descripcion').value;
    //if (this.image != 'assets/no_image.png') {
      this.incidencia.imagen = this.image;
    //}
    await this.ui.presentLoading();
    this.incidenciaDB.addIncidencia(this.incidencia).then(async res => {
      await this.ui.presentToast('Incidencia agregada correctamente', 'success');
    }
    ).catch(async e => {
      console.log(e);
      await this.ui.presentToast('Ha ocurrido un error', 'danger');
    });
    this.incidenciaForm.reset();
    this.ubicacion='';
    this.image='assets/no_image.png';
    await this.ui.hideLoading();

    this.router.navigate([Tab1Page]);

  }

  cargarUbicacion() {
    // Address -> latitude,longitude
    console.log('oojjoj');
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
        'title': JSON.stringify(this.ubicacion)
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
    LocationService.getMyLocation().then(async (myLocation: MyLocation) => {
      this.incidencia.latitud = myLocation.latLng.lat;
      this.incidencia.longitud = myLocation.latLng.lng;
      let options: GoogleMapOptions = {
        camera: {
          target: myLocation.latLng,
          zoom: 15
        }
      };
      
      this.gmap = await GoogleMaps.create('map_canvas', options);

      let marker: Marker = this.gmap.addMarkerSync({
        'position': myLocation.latLng,
        'title': JSON.stringify('Mi Ubicación actual')
      });
      this.gmap.animateCamera({
        'target': marker.getPosition(),
        'zoom': 17
      }).then(() => {
        marker.showInfoWindow();
        this.isRunning = false;
      });
    });
  }

}


