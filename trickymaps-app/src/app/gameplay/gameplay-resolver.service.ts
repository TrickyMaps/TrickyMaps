import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { SendJsonDataService } from '../send-json-data.service';

@Injectable({
  providedIn: 'root'
})
export class GameplayResolverService implements Resolve<JSON>{

  constructor(private sendJson: SendJsonDataService) { }
  
  theData: any;

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<JSON> | Promise<JSON> | JSON {
    
    this.theData = this.sendJson.getData();
    //var send = JSON.stringify(this.theData);
    //var jsonSend = JSON.parse(send);
    console.log("theData = " + JSON.stringify(this.theData));
 
    const promise: Promise<JSON> = new Promise((resolve, reject) => {
      const Url = "http://68.14.109.119:5800/api/get_video";
      var otherParam = {
        headers: {
          "content-type": "application/json; charset=UTF-8"
        },
        body: JSON.stringify(this.theData, null, 2),
        //body: send,null,
        method: "POST"
      }

      console.log(otherParam)

      resolve(
      fetch(Url, otherParam)
        .then(res => { return res.json() })
        .then(data => { console.log(data); return data })
        .catch(error => { console.log(error); }))
      
    });
    return promise;
  }

}


