import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SendJsonDataService {

  constructor() { }

  theData: any;

  setData(data){
    this.theData = data;
  }
  getData(){
    return this.theData;
  }
}
