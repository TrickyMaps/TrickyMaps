import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SendScoreService {

  constructor() { }

  theScore: any;

  setScore(score){
    this.theScore = score;
    console.log(this.theScore);
  }
  getScore(){
    console.log(this.theScore);
    return this.theScore;
  }
}
