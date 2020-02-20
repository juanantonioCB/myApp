import { Component, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GoogleMaps, GoogleMap, GoogleMapsEvent, GoogleMapOptions, CameraPosition, MarkerOptions, Marker, Environment, LocationService, MyLocation, Geocoder, GeocoderResult } from '@ionic-native/google-maps';
import { Incidencia } from '../model/Incidencia';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { PopovercomponentPage } from '../popover/popovercomponent/popovercomponent.page';
import { PopoverController } from '@ionic/angular';
@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  gmap: GoogleMap;
  image: any;
  incidenciaForm: any;
  pickupLocation: string;
  ubicacion: string;
  isRunning: boolean;
  incidencia: Incidencia;
  constructor(private formBuilder: FormBuilder, private router: Router,
    private popoverController: PopoverController,
    private camera: Camera) {
    this.incidencia = {
      nombre: '',
      descripcion: '',
      imagen: '',
      latitud: 0,
      longitud: 0
    }
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

        }
      })
      popoverElement.present();
    })
  }

  ngOnInit() {
    this.image = 'assets/no_image.png';
    this.incidenciaForm = this.formBuilder.group({
      titulo: ['', Validators.minLength(5)],
      descripcion: ['']
    });
    this.loadmap();
  }


  crearIncidencia() { }

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


