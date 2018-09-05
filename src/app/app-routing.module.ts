import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component'
import { NewsComponent } from './news/news.component';
import { TweetsComponent } from './tweets/tweets.component';

const routes: Routes = [
  { path: '', component: TweetsComponent},
];
 
@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
