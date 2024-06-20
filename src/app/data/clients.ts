import { map, Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { IClient } from "../models/client";

@Injectable()
export class ClientsData {
  constructor(
    private http: HttpClient,
  ) {
  }

  public getAll(): Observable<IClient[]> {
    return this.http.get<{ users: IClient[] }>('https://test-data.directorix.cloud/task1')
      .pipe(map(response => response.users));
  }
}



