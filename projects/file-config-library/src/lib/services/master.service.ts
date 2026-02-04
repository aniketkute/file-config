import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MasterService {
  readonly http = inject(HttpClient);
  // private BASE_URL: string = 'https://dev-api.file-service.mobioffice.io';

  //#region POST
  getDetailsWithProcess(payload: any, BASE_URL: string) {
    return this.http.post(`${BASE_URL}/getFilesPath/v4`, payload);
  }
  //#endregion

  //#region GET
  // getProcessList() {
  //   return this.http.get(`${this.BASE_URL}/pd/v1/FileProcessConfig/getAll`);
  // }
  //#endregion
}
