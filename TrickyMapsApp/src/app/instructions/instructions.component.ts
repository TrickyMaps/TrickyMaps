import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
declare const sliderOptions: any;

let counter = 0;
@Component({
  selector: 'app-instructions',
  templateUrl: './instructions.component.html',
  styleUrls: ['./instructions.component.css']
})
export class InstructionsComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  slider(){
    sliderOptions(counter);
  }

  HomePage(){
    this.router.navigate(['/home']);
    console.log("click");
  }

}
