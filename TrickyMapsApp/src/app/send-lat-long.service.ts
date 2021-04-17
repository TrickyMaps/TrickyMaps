import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SendLatLongService {

  constructor() { }
  latitude: number;
  longitude: number;
  
  setLatitude(data){
    this.latitude = data;
  }
  getLatitude(){
    return this.latitude;
  }

  setLongitude(data){
    this.longitude = data;
  }
  getLongitude(){
    return this.longitude;
  }
}
