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

    let loader = new Loader({
      apiKey: `${getKey()}` //indirectly getting key (hiding it)
    })

    loader.load().then(() => {
      var theMap = this.getMap();
      this.yourLocation(theMap);

      theMap.addListener("click", (e) => {
        if(madeGuess == false){
          madeGuess = this.placeMarkerAndPanTo(e.latLng, theMap);
        } else {
          alert('Already made your guess! Click "See Score" to proceed!');
        }
        
      });
    })
  }
  
  placeMarkerAndPanTo(latLng: google.maps.LatLng, map: google.maps.Map): boolean {
      if (confirm('Do you want this to be your guess? You only get one so make it count!')) {
        new google.maps.Marker({
          position: latLng,
          map: map,
          title: "Your Guess",
          icon: {                             
            url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"                          
          }
        });
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

        this.guessMade = true;
        return true;
      } else {
        console.log("guess nullified");
        return false;
      }
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
    this.router.navigate(['/score']);
  }

}