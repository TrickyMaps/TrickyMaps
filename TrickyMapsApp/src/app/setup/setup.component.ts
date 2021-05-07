import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, NavigationStart, NavigationEnd, RouterEvent, Event } from '@angular/router';
import { SendLatLongService } from '../send-lat-long.service';
import { SendJsonDataService } from '../send-json-data.service';

declare function getLocation();
declare function carousel();
declare const outputUpdate: any;

@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.css']
})
export class SetupComponent implements OnInit {

  showLoadingIndicator = true; //loading indicator
  constructor(private router: Router, private http: HttpClient,
    private sendLatLong: SendLatLongService,
    private sendJson: SendJsonDataService) {
      this.router.events.subscribe((RouterEvent: Event) =>{
        if(RouterEvent instanceof NavigationStart){ //loading icon appears
          this.showLoadingIndicator = true;
        }
        if (RouterEvent instanceof NavigationEnd){  //loading icon wont appear unless user clicks "Get Tricky" Button
          this.showLoadingIndicator = false;
        }
      });
  }

  @ViewChild('f', { static: false }) signupForm: NgForm; //form data

  info: any = { //sending dist -> mile radius, lat/long and fps speed to backend
    "dist": null,
    "lat": null,
    "lon": null,
    "fps": null
  };
  

  async onSubmit() {
    this.info.dist = this.signupForm.value.userData.mileRadius; //equal to user data (json data)
    this.info.fps = this.signupForm.value.userData.FPS; //equal to user data (json data)

    
    var str = document.getElementsByTagName("h2")[0].innerHTML.toString(); //h2 element contains lat and long 
    var split = str.split("<br>"); //removing <br> 
    var split2 = split.toString().split("Latitude: ") //make it a string to use split method, then remove latitude
    var split3 = split2.toString().split("Longitude: "); //remove Long
    var split4 = split3.toString().split(","); //remove comma inbetween two words
    var latitude = Number(split4[1].toString()); //latitude number is left -> convert to number
    var longitude = Number(split4[3].toString()); //longitude number is left -> convert to number


    //sharing lat and long to next page (for google map)
    this.sendLatLong.setLatitude(latitude);
    this.sendLatLong.setLongitude(longitude);

    this.info.lat = latitude; //(json data)
    this.info.lon = longitude; //(json data)
  
    this.sendJson.setData(this.info); //calls setter method in send-json-data.service.ts
    this.GamePage();

  }

  ngOnInit(): void {
    alert("This app requires your current location");
    getLocation(); //in script.js
    carousel(); //in script.js
  }

  framePerSecondValue(){
    var vol;
    outputUpdate(vol); //in script.js
  }
  
  HomePage(){
    this.router.navigate(['/home']); //back to home page
  }

  GamePage(){
    this.router.navigate(['/game']); //where game begins
  }

}
