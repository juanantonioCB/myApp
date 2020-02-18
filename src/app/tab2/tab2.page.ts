import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GoogleMaps, GoogleMap, GoogleMapsEvent, GoogleMapOptions, CameraPosition, MarkerOptions, Marker, Environment, LocationService, MyLocation, Geocoder, GeocoderResult } from '@ionic-native/google-maps';
import { Incidencia } from '../model/Incidencia';

import {PopovercomponentPage} from '../popover/popovercomponent/popovercomponent.page';
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
    private popoverController: PopoverController) {
    this.incidencia = {
      nombre: '',
      descripcion: '',
      imagen: '',
      latitud: 0,
      longitud: 0
    }
  }

  createPopover(){
    this.popoverController.create({
      component:PopovercomponentPage,
      showBackdrop:false,

    }).then((popoverElement)=>{
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


