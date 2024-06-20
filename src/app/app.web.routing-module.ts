import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {ClientListWebComponent} from "./components/client-list/client-list.web.component";

const components: any[] = [
];

const routes: Routes = [

  {
    path: '',
    component: ClientListWebComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  declarations: components,
  exports: [RouterModule]
})

export class AppWebRoutingModule { }
