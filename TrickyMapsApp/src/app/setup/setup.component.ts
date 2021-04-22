import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { SendLatLongService } from '../send-lat-long.service';

import axios from "axios";

declare function getLocation();
declare function carousel();
declare function getAddress();
declare const outputUpdate: any;

@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.css']
})
export class SetupComponent implements OnInit {

  constructor(private router: Router, private http: HttpClient,
    private sendLatLong: SendLatLongService) {

  }
  @ViewChild('f', { static: false }) signupForm: NgForm;

  info: any = {
    "dist": null,
    "lat": null,
    "lon": null,
    "fps": null
  };
  

  onSubmit() {
    this.info.dist = this.signupForm.value.userData.mileRadius;
    console.log(this.info.fps = this.signupForm.value.userData.FPS);

    var str = document.getElementsByTagName("h2")[0].innerHTML.toString(); //h2 element contains lat and long 
    var split = str.split("<br>"); //removing <br> 
    var split2 = split.toString().split("Latitude: ") //make it a string to use split method, then remove latitude
    var split3 = split2.toString().split("Longitude: "); //remove Long
    var split4 = split3.toString().split(","); //remove comma inbetween two words
    console.log("split4 = " + split4);
    var latitude = Number(split4[1].toString()); //latitude number is left -> convert to number
    var longitude = Number(split4[3].toString()); //longitude number is left -> convert to number

    //sharing lat and long to next page
    this.sendLatLong.setLatitude(latitude);
    this.sendLatLong.setLongitude(longitude);

    this.info.lat = latitude;
    this.info.lon = longitude;

    console.log(typeof(this.info)); //object -> json
    console.log(typeof(JSON.stringify(this.info))); //string
    const Url ='http://10.103.114.67:5000/api/get_location_from_point';
    
    axios.post(Url, this.info).then(data=>console.log(data)).catch(err=>console.log(err));
    this.GamePage();
  }

  ngOnInit(): void {
    alert("This app requires your current location");

    getAddress();

    getLocation();
    carousel();
  }

  framePerSecondValue(){
    var vol;
    outputUpdate(vol);
  }
  
  HomePage(){
    this.router.navigate(['/home']); //back to home page
  }

  GamePage(){
    this.router.navigate(['/game']); //where game begins
  }

}
