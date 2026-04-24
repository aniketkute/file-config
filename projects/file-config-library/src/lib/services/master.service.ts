import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MasterService {
  readonly http = inject(HttpClient);

  //#region POST
  getDetailsWithProcess(payload: any, BASE_URL: string) {
    return this.http.post(`${BASE_URL}/getFilesPath/v4`, payload);
  }

  getDetailsWithProcessForPd(number: string, BASE_URL: string) {
    return this.http.get(`${BASE_URL}/pd/file/getImagev2?number=${number}`);
  }
  //#endregion

}
