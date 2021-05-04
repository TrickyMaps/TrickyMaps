import { HttpClient } from '@angular/common/http';
import { Component, ComponentFactoryResolver, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, NavigationStart, NavigationEnd, RouterEvent, Event } from '@angular/router';
import { SendLatLongService } from '../send-lat-long.service';
import { SendJsonDataService } from '../send-json-data.service';

declare function getLocation();
declare function carousel();
declare function getAddress();
declare function getJSON(json_data);
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
        if(RouterEvent instanceof NavigationStart){
          this.showLoadingIndicator = true;
        }
        if (RouterEvent instanceof NavigationEnd){
          this.showLoadingIndicator = false;
        }
      });
  }

  @ViewChild('f', { static: false }) signupForm: NgForm;

  info: any = {
    "dist": null,
    "lat": null,
    "lon": null,
    "fps": null
  };
  

  async onSubmit() {
    this.info.dist = this.signupForm.value.userData.mileRadius;
    this.info.fps = this.signupForm.value.userData.FPS;

    
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
  
    this.sendJson.setData(this.info);
    this.GamePage();

  }

  ngOnInit(): void {
    alert("This app requires your current location");

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
    console.log("this.showingindicator " + this.showLoadingIndicator); //false
    this.router.navigate(['/game']); //where game begins
    console.log("this.showingindicator " + this.showLoadingIndicator); //true
  }

}
