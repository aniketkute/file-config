import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, switchMap, catchError, finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class MasterService {
  readonly http = inject(HttpClient);
  // BASE_URL1 = 'http://192.168.54.189:4000'; server URL for testing

  //#region POST
  getDetailsWithProcess(payload: any, BASE_URL: string) {
    return this.http.post(`${BASE_URL}/getFilesPath/v4`, payload);
  }

  getDetailsFromVersion(payload: any, BASE_URL: string) {
    return this.http.post(`${BASE_URL}/getfilesUrlByMultiBarcode`, payload);
  }

  //#endregion

  // #region Api Calling and data setting.
  getFullDetails(
    styleSketchNumber: string,
    BASE_URL: string,
    PD_BASE_URL: string,
  ): Observable<any> {
    const payload = {
      packetBarCode: styleSketchNumber,
      rootFolderName: 'uploads',
      isAllVersionNeeded: 1,
    };

    return this.getDetailsWithProcess(payload, BASE_URL).pipe(
      switchMap((res: any) => {
        const styleDetails = res || [];

        const menus = res?.filePaths
          ? Object.keys(res.filePaths).map((item) => ({
            processName: item,
            isSelected: false,
          }))
          : [];

        return this.getDetailsWithProcessForPd(
          styleSketchNumber,
          PD_BASE_URL,
        ).pipe(
          map((pdRes: any) => {
            const pdData = pdRes?.data || {};
            const pdMenus: any[] = [];

            if (pdData['briefImage']) {
              pdMenus.push({ processName: 'Brief Images', isSelected: false });
            }

            if (pdData['subBriefImage']) {
              pdMenus.push({
                processName: 'Sub Brief Images',
                isSelected: false,
              });
            }

            if (!styleDetails?.filePaths?.['sketch'] && pdData['sketchImage']) {
              pdMenus.push({ processName: 'sketch', isSelected: false });
            }

            return {
              styleDetails,
              menus,
              pdData,
              pdMenus,
            };
          }),
        );
      }),
      catchError(() =>
        of({
          styleDetails: [],
          menus: [],
          pdData: [],
          pdMenus: [],
        }),
      ),
    );
  }

  getVersionDetailsFromPd(
    styleNo: string,
    PD_URL: string,
    refFromEmrGatiDiaVendor: boolean,
  ) {
    return this.http.get(
      `${PD_URL}/pd/file/getVersionByStyleNumber?number=${styleNo}&refFromEmrGatiDiaVendor=${refFromEmrGatiDiaVendor}`,
    );
  }

  getDetailsWithProcessForPd(number: string, BASE_URL: string) {
    return this.http.get(`${BASE_URL}/pd/file/getImagev2?number=${number}`);
  }

  getSyleVersionFromBag(MFG_BASE_URL: string, bagNo: string) {
    return this.http.get(
      `${MFG_BASE_URL}/asset/v1/bag/getStyleVersionByBagNo?bagNo=${bagNo}`,
    );
  }

  getFileConfigRoleMapping(MFG_BASE_URL: string) {
    return this.http.get(`${MFG_BASE_URL}/asset/v1/linkUserFileConfig/getAll`);
  }
}
