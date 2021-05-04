import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Loader } from '@googlemaps/js-api-loader';
import { SendLatLongService } from '../send-lat-long.service';
import { SendJsonDataService } from '../send-json-data.service';
import { SendScoreService } from '../send-score.service';

declare const getKey;

@Component({
  selector: 'app-gameplay',
  templateUrl: './gameplay.component.html',
  styleUrls: ['./gameplay.component.css']
})

export class GameplayComponent implements OnInit {

  constructor(private router: Router, private sendLatLong: SendLatLongService,
    private sendJson: SendJsonDataService,
    private activatedRoute: ActivatedRoute,
    private sendScore: SendScoreService) { }

  //variables store data from previous screen
  latitude: number;
  longitude: number; 
  responseJson: any;
  destinationCords: any;
  destinationLat: any;
  destinationLng: any;
  fileName: any;


  guessMade: boolean = false;
  gmarkers = [];

  guessLat: number;
  guessLng: number;

  ngOnInit(): void {
    this.sendJson.getData();
    var video = document.getElementById('responseVideo');
    //this.activatedRoute.data.subscribe(data => video.setAttribute('src', `http://68.14.109.119:5800/api/static_video/${data['info']['filename']}`));
    this.activatedRoute.data.subscribe(data => this.setReturnedData(data['info']['end_cords'], data['info']['filename']));

    this.destinationCords = JSON.stringify(this.getReturnedCords());
    console.log(this.destinationCords);
    this.destinationCords = this.destinationCords.toString().split('{"lat":');
    this.destinationCords = this.destinationCords.toString().split('"lon":');
    this.destinationCords = this.destinationCords.toString().split('}');
    this.destinationCords = this.destinationCords.toString().split(',');
    this.destinationLat = Number(this.destinationCords[1]);
    this.destinationLng = Number(this.destinationCords[3]);
    console.log(this.destinationCords);
    console.log("lat end = " + this.destinationLat);
    console.log("lng end = " + this.destinationLng);

    this.fileName = JSON.stringify(this.getReturnedFile());
    this.fileName = this.fileName.split('"'); //getting rid of " and " at front and end
    //console.log("the file = " + this.fileName[1]);

    
    var video = document.getElementById('responseVideo');
    video.setAttribute('src', `http://68.14.109.119:5800/api/static_video/${this.fileName[1]}`);

    this.initMap();  
  }

  initMap(){
    var madeGuess = false;
    this.responseJson = this.sendJson.getData();
    console.log(this.responseJson);

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

      console.log("this.guessLat:" + this.guessLat);
      console.log("this.guessLng:" + this.guessLng);

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

  setReturnedData(cordsData, fileData){
    this.destinationCords = cordsData;
    this.fileName = fileData;
  }

  getReturnedCords(){
    return this.destinationCords;
  }

  getReturnedFile(){
    return this.fileName;
  }

  scorePage(){
    if(confirm("Are you sure you want to proceed to the scoring page? Your guess will be finalized")){

      const info: any = {
        "destination_lat": this.destinationLat,
        "destination_lon": this.destinationLng,
        "guess_lat": this.guessLat,
        "guess_lon": this.guessLng
      };

      this.sendScore.setScore(info);

      this.router.navigate(['/score']);
    } else {
      console.log("stay put");
    }
    
  }

}