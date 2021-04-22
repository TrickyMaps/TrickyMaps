import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Loader } from '@googlemaps/js-api-loader';
import { SendLatLongService } from '../send-lat-long.service';


declare const getKey;

@Component({
  selector: 'app-gameplay',
  templateUrl: './gameplay.component.html',
  styleUrls: ['./gameplay.component.css']
})

export class GameplayComponent implements OnInit {

  constructor(private router: Router, private sendLatLong: SendLatLongService) { }

  //variables store data from previous screen
  latitude: number;
  longitude: number; 
  guessMade: boolean = false;
  gmarkers = [];

  guessLat: number;
  guessLng: number;

  ngOnInit(): void {
    this.initMap();  
  }

  initMap(){
    var madeGuess = false;

    //retrieve lat and long from setup page (used as coordinates in map in right box)
    this.latitude = this.sendLatLong.getLatitude();
    console.log(this.latitude);
    this.longitude = this.sendLatLong.getLongitude();
    console.log(this.longitude);


    /* So the javascript file api.js with the 
          method getKey() is not on github. In order for this to work:
      1: create a new javascript file named 'api.js' 
      2: put it in the js folder in assets
      3: in that method, write:
        function getKey(){
          return ________; <- this is where the api key goes (put it in single quotation marks)
        } 
      ****api.js is included in the .gitignore file, this is why these steps are important*/


    let loader = new Loader({
      apiKey: `${getKey()}` //indirectly getting key (hiding it)
    })

    loader.load().then(() => {
      var theMap = this.getMap();
      this.yourLocation(theMap);

      theMap.addListener("click", (e) => {
        this.placeMarkerAndPanTo(e.latLng, theMap);
      });
    })
  }
  
  placeMarkerAndPanTo(latLng: google.maps.LatLng, map: google.maps.Map){

      console.log("array length (before remove method)= " + this.gmarkers.length);
      //if user made a guess when they already made one, remove original guess from the map
      if (this.gmarkers.length > 0) {
        this.removeMarker(); 
      }

      console.log(this.gmarkers.length);

      console.log("array length (after remove method)= " + this.gmarkers.length);
        
      var userGuess = new google.maps.Marker({
          position: latLng,
          map: map,
          title: "Your Guess",
          icon: {                             
            url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"                          
          }
      });

      this.gmarkers.push(userGuess); //add guess to array
      console.log("array length (after push)= " + this.gmarkers.length);
      
      map.panTo(latLng);
      console.log("latLng of guess = " + latLng);
        
      var latLngStr = latLng.toString();
      var split = latLngStr.toString().split("(");
      var split2 = split.toString().split(")");
      var split3 = split2.toString().split(",");
      //console.log("lat = " + Number(split3[1].toString()));
      //console.log("long = " + Number(split3[2].toString()));
      this.guessLat = Number(split3[1].toString()); //players guess lat
      this.guessLng = Number(split3[2].toString()); //players guess lng

      if(this.guessMade == false){
        this.guessMade = true;
      }
      
  }

  removeMarker(){
    this.gmarkers[0].setMap(null); //removing guess from map
    this.gmarkers.shift(); //remove first and only element from array
  }

  exitGame(){ //x button in top left
    if (confirm('Are you sure you want to leave the game?')) {
      // go to home page
      this.router.navigate(['/home']);
    } else {
      // Do nothing!
      console.log("stay");
    }
  }

  getMap(){
    const map = new google.maps.Map(document.getElementById("map"), {
      //setting lat and lng = data sent over from setuppage
      center: {lat: this.latitude, lng: this.longitude},
      zoom: 14,
      streetViewControl: false
    });
    return map;
  }

  yourLocation(map: any){
    new google.maps.Marker({
      position: {lat: this.latitude, lng: this.longitude},
      map: map,
      title: "Your Location",
      icon:{
        url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
      }
    })
  }

  scorePage(){
    if(confirm("Are you sure you want to proceed to the scoring page? Your guess will be finalized")){
      this.router.navigate(['/score']);
    } else {
      console.log("stay put");
    }
    
  }

}