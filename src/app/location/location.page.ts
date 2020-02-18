import { Component, OnInit } from '@angular/core';
import {Map,tileLayer,marker} from 'leaflet';

@Component({
  selector: 'app-location',
  templateUrl: './location.page.html',
  styleUrls: ['./location.page.scss'],
})
export class LocationPage implements OnInit {

  address:string[];
  constructor(private map:Map) { }

  ngOnInit() {
    new Map("map").setView([37.5,-4.65], 13);

  }

}
