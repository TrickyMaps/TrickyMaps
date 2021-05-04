import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomepageComponent } from './homepage/homepage.component';
import { SetupComponent } from './setup/setup.component';
import { InstructionsComponent } from './instructions/instructions.component';
import { GameplayComponent } from './gameplay/gameplay.component';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ScoreComponent } from './score/score.component';

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    SetupComponent,
    InstructionsComponent,
    GameplayComponent,
    ScoreComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
