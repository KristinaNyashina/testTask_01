import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from "@angular/common/http";
import { ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDialogModule } from "@angular/material/dialog";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule, MAT_FORM_FIELD_DEFAULT_OPTIONS } from "@angular/material/form-field";
import { MatButtonModule } from "@angular/material/button";
import { MatSortModule } from "@angular/material/sort";

import { AppWebRoutingModule } from './app.web.routing-module';
import { AppComponent } from './app.component';
import { ClientListWebComponent } from './components/client-list/client-list.web.component';
import { HeaderWebComponent } from './components/header/header.web.component';
import { ClientManagerService } from "./services/client-manager.service";
import { ClientsData } from "./data/clients";
import { ClientDialogWebComponent } from "./components/client-dialog/client-dialog.web.component";

const components: any[] = [
  AppComponent,
  ClientListWebComponent,
  HeaderWebComponent,
  ClientDialogWebComponent
];

@NgModule({
  declarations: [
    components
  ],
  imports: [
    BrowserModule,
    AppWebRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatDividerModule,
    MatTableModule,
    MatCheckboxModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSortModule,
  ],
  providers: [
    ClientManagerService,
    ClientsData,
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline', hideRequiredMarker: true }
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
