import { Component, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { GoogleMaps, GoogleMap, GoogleMapsEvent, GoogleMapOptions, CameraPosition, MarkerOptions, Marker, Environment, LocationService, MyLocation, Geocoder, GeocoderResult } from '@ionic-native/google-maps';
import { Incidencia } from '../model/Incidencia';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { PopovercomponentPage } from '../popover/popovercomponent/popovercomponent.page';
import { PopoverController, NavController } from '@ionic/angular';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { IncidenciasService } from '../servicios/incidencias.service';
import { UiComponent } from '../common/ui/ui.component';
import { StreamingMedia, StreamingVideoOptions } from '@ionic-native/streaming-media/ngx';
import { Tab1Page } from '../tab1/tab1.page';
import { File, IWriteOptions, FileEntry } from '@ionic-native/file/ngx';
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
  id: string;

  constructor(private formBuilder: FormBuilder, private router: Router,
    private popoverController: PopoverController,
    private ui: UiComponent,
    private camera: Camera,
    private incidenciaDB: IncidenciasService,
    private imagePicker: ImagePicker,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private file: File
  ) {
    this.incidencia = {
      nombre: undefined,
      descripcion: undefined,
      imagen: '',
      latitud: 0,
      longitud: 0
    };
  }

  async ngOnInit() {
    this.image = 'assets/no_image.png';
    this.incidenciaForm = this.formBuilder.group({
      titulo: ['', [Validators.required, Validators.minLength(5)]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]]
    });
    this.loadmap();
    await this.loadIncidencia();
  }

  ionViewWillEnter() {
    //this.incidenciaForm.reset();
  }

  async loadIncidencia() {
    this.id = this.route.snapshot.params['id'];
    console.log(this.id);
    if (this.id) {
      this.incidenciaDB.getIncidencia(this.id).subscribe(res => {
        ///////////////////
        ///////////////////
        this.incidencia = res;
        this.incidenciaForm = this.formBuilder.group({
          titulo: [res.nombre],
          descripcion: [res.descripcion]
        });
        this.incidencia.latitud = res.latitud;
        this.incidencia.longitud = res.longitud;
        this.image = res.imagen;
        this.loadUbicacion(res.latitud, res.longitud);
      });

    }
  }

  public choosePhoto() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    }
    this.camera.getPicture(options).then(async (imageData) => {
      await this.ui.generateImage('data:image/jpeg;base64,' + imageData, 1, 300, 300).then(im => {
        this.image = 'data:image/jpeg;base64,' + im;
      }).catch(async err => {
        console.log('ERROR DE COMPRESIÓN' + err);
        this.image === undefined;
        await this.ui.presentAlert('Error', '', 'Archivo no válido');

      });
    }, (err) => {
      console.log('ERROR EN LA CÁMARA ' + err);
      this.ui.presentToast('Ha ocurrido un error al cargar la cámara', 'danger');
    });
  }

  public takePhoto() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.CAMERA
    };
    this.camera.getPicture(options).then(async (imageData) => {
      await this.ui.generateImage('data:image/jpeg;base64,' + imageData, 1, 300, 300).then(im => {
        this.image = 'data:image/jpeg;base64,' + im;
      }).catch(err => {
        console.log('ERROR DE COMPRESIÓN' + err);
        this.image === undefined;
      });
    }, (err) => {
      console.log('ERROR EN LA CÁMARA ' + err);
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
    this.incidencia.imagen = this.image;
    await this.ui.presentLoading();
    if (this.id) {
      await this.incidenciaDB.updateIncidencia(this.incidencia, this.id).then(async res => {
        await this.ui.presentToast('Incidencia actualizada correctamente', 'success');
      }).catch(async err => {
        console.log(err);
        await this.ui.presentAlert('Ha ocurrido un error', '', err);
      }
      );
    } else {
      this.incidenciaDB.addIncidencia(this.incidencia).then(async res => {
        await this.ui.presentToast('Incidencia agregada correctamente', 'success');
      }
      ).catch(async e => {
        console.log(e);
        await this.ui.presentToast('Ha ocurrido un error', 'danger');
      });
    }
    this.incidenciaForm.reset();
    this.ubicacion = '';
    this.image = 'assets/no_image.png';
    await this.ui.hideLoading();
    this.router.navigate([Tab1Page]);
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
    }).catch(async e=>{
      console.log(e);
      await this.ui.presentAlert('Error','','Ha ocurrido un error al conocer tu ubicación');
    });
  }

  cargarImagen() {

  }


  loadUbicacion(lat: number, lng: number) {
    let marker: Marker = this.gmap.addMarkerSync({
      'position': {
        lat: lat,
        lng: lng
      },
      'title': JSON.stringify('Mi Ubicación actual')
    });
    this.gmap.animateCamera({
      'target': marker.getPosition(),
      'zoom': 17
    }).then(() => {
      marker.showInfoWindow();
      this.isRunning = false;
    });
  }

  loadmap() {
    LocationService.getMyLocation().then(async (myLocation: MyLocation) => {
      this.incidencia.latitud = myLocation.latLng.lat;
      this.incidencia.longitud = myLocation.latLng.lng;
      this.gmap = await GoogleMaps.create('map_canvas');
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
    }).catch(err => {
      console.log(err);
    });
  }

}


