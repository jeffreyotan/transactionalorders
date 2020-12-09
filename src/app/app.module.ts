import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { FormComponent } from './components/form.component';
import { WebService } from './web.service';

const ROUTES: Routes = [
  { path: "", component: FormComponent },
  { path: "home", component: FormComponent },
  { path: "form", component: FormComponent },
  { path: "**", redirectTo:"/", pathMatch: "full"}
];

@NgModule({
  declarations: [
    AppComponent,
    FormComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(ROUTES),
    HttpClientModule
  ],
  providers: [
    WebService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
