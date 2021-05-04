import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GameplayResolverService } from './gameplay/gameplay-resolver.service';
import { GameplayComponent } from './gameplay/gameplay.component';
import { HomepageComponent } from './homepage/homepage.component';
import { InstructionsComponent } from './instructions/instructions.component';
import { ScoreComponent } from './score/score.component';
import { SetupComponent } from './setup/setup.component';

var sendJson: any;

const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: HomepageComponent},
  {path: 'setup', component: SetupComponent},
  {path: 'instructions', component: InstructionsComponent},
  {path: 'game', component: GameplayComponent, resolve: {info: GameplayResolverService}},
  {path: 'score', component: ScoreComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
