import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SendJsonDataService } from '../send-json-data.service';
import { SendScoreService } from '../send-score.service';

@Component({
  selector: 'app-score',
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.css']
})
export class ScoreComponent implements OnInit {

  constructor(private router: Router, private sendJson: SendJsonDataService,
    private sendScore: SendScoreService) { }

  theRetrievedData: any;
  theScore: any;
  output:any;
  outputScore: any;
  outputFeet: any;

  ngOnInit(): void {
    this.theRetrievedData = JSON.stringify(this.sendScore.getScore());
    console.log("the lat = " + this.theRetrievedData);

    //sending values from gameplay.component.ts over using send-score.service.ts and extracting the number value
    this.theRetrievedData = this.theRetrievedData.toString().split('"destination_lat":');
    this.theRetrievedData = this.theRetrievedData.toString().split('"destination_lon":');
    this.theRetrievedData = this.theRetrievedData.toString().split('"guess_lat":');
    this.theRetrievedData = this.theRetrievedData.toString().split('"guess_lon":');
    this.theRetrievedData = this.theRetrievedData.toString().split('}');
    this.theRetrievedData = this.theRetrievedData.toString().split(',');
    console.log("simp = " + this.theRetrievedData[1]);
    console.log("simp = " + this.theRetrievedData[3]);
    console.log("simp = " + this.theRetrievedData[5]);
    console.log("simp = " + this.theRetrievedData[7]);

    var info: any = { //data sent for second api call
      "destination_lat": Number(this.theRetrievedData[1]),
      "destination_lon": Number(this.theRetrievedData[3]),
      "guess_lat": Number(this.theRetrievedData[5]),
      "guess_lon": Number(this.theRetrievedData[7])
    };

    //second api call
    const Url = "http://68.14.109.119:5800/api/get_score";
      var otherParam = {
        headers: {
          "content-type": "application/json; charset=UTF-8"
        },
        body: JSON.stringify(info, null, 2),
        method: "POST"
      }

      console.log(otherParam)

      fetch(Url, otherParam)
        .then(res => { return res.json() })
        .then(data => this.setScore(data))
        .catch(error => { console.log(error); })

        setTimeout(()=>{     
          this.output = JSON.stringify(this.getScore());
          console.log(this.output); //wait to setScore then you can get it
        }, 2000);

        setTimeout(()=>{
          //reformatting output to print it correctly
          this.output = this.output.toString().split('{"feet_from_destination":');
          this.output = this.output.toString().split(',"score":');
          this.output = this.output.toString().split('}');
          this.output = this.output.toString().split(',');
          this.outputScore = this.output[2];
          this.outputFeet = this.output[1];
          console.log("output = " + this.output);
        }, 2500);
  }

  HomePage(){
    this.router.navigate(['/home']);
  }

  getScore(){
    console.log("theScore = " + this.theScore);
    return this.theScore;
  }

  setScore(data){
    console.log("theScore = " + this.theScore);
    this.theScore = data;
  }

}
