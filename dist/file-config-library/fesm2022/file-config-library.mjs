import * as i0 from '@angular/core';
import { inject, Injectable, Input, Component } from '@angular/core';
import * as i1 from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

class MasterService {
    constructor() {
        this.http = inject(HttpClient);
    }
    // private BASE_URL: string = 'https://dev-api.file-service.mobioffice.io';
    //#region POST
    getDetailsWithProcess(payload, BASE_URL) {
        return this.http.post(`${BASE_URL}/getFilesPath/v4`, payload);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: MasterService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: MasterService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: MasterService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }] });

class DashboardUiComponent {
    constructor() {
        this.masterService = inject(MasterService);
        this.BASE_URL = 'https://dev-api.file-service.mobioffice.io';
        this.menus = [];
        this.styleSketchNumber = null;
        this.selectedProcessName = null;
        this.tableData = [];
        this.selectedTab = 'latest';
        this.latestTableData = [];
        this.historyTableData = [];
    }
    ngOnInit() {
        console.log('we are in dashboard library component');
        this.onInit();
    }
    onInit() {
        this.getAllMaster();
    }
    getAllMaster() {
        // this.masterService.getProcessList().subscribe((res: any) => {
        //   console.log(res);
        //   this.menus = res.data.map((item: any) => {
        //     return { ...item, isSelected: false };
        //   });
        // });
    }
    itemSelected(item) {
        console.log(item);
        this.selectedProcessName = item.processName;
        item.isSelected = true;
        this.menus.map((item) => {
            if (item.processName !== this.selectedProcessName)
                item.isSelected = false;
        });
        console.log(this.styleDetailsForDownload);
        if (this.selectedProcessName) {
            const data = this.styleDetailsForDownload.filePaths[this.selectedProcessName];
            console.log(data);
            this.prepareTableData(data);
        }
    }
    // prepareTableData(data: any) {
    //   this.tableData = Object.entries(data).map(([version, files]: any) => ({
    //     version,
    //     files: Object.entries(files).map(([fileName, details]: any) => ({
    //       fileName,
    //       createdDate: details.createdDate,
    //       url: details.url,
    //     })),
    //   }));
    //   console.log(this.tableData);
    // }
    prepareTableData(data) {
        const allFiles = [];
        // Flatten all versions into single array
        Object.entries(data).forEach(([version, files]) => {
            Object.entries(files).forEach(([fileName, details]) => {
                allFiles.push({
                    version,
                    fileName,
                    createdDate: details.createdDate,
                    url: details.url,
                });
            });
        });
        // Sort by createdDate DESC
        allFiles.sort((a, b) => {
            const d1 = this.parseDate(a.createdDate);
            const d2 = this.parseDate(b.createdDate);
            return d2 - d1;
        });
        if (allFiles.length > 0) {
            // 🔥 First element only → Latest
            const latestFile = allFiles[0];
            this.latestTableData = [
                {
                    version: latestFile.version,
                    files: [latestFile],
                },
            ];
            // Remaining → History (group back by version)
            const remaining = allFiles.slice(1);
            const groupedHistory = {};
            remaining.forEach((file) => {
                if (!groupedHistory[file.version]) {
                    groupedHistory[file.version] = [];
                }
                groupedHistory[file.version].push(file);
            });
            this.historyTableData = Object.entries(groupedHistory).map(([version, files]) => ({
                version,
                files,
            }));
        }
        console.log('Latest:', this.latestTableData);
        console.log('History:', this.historyTableData);
    }
    parseDate(dateStr) {
        const [datePart, timePart] = dateStr.split(' ');
        const [day, month, year] = datePart.split('-');
        return new Date(`${year}-${month}-${day}T${timePart}`);
    }
    enterPressed() {
        const payload = {
            packetBarCode: this.styleSketchNumber,
            rootFolderName: 'uploads',
            isAllVersionNeeded: 1,
        };
        this.masterService.getDetailsWithProcess(payload, this.BASE_URL).subscribe({
            next: (res) => {
                this.styleDetailsForDownload = res;
                if (res?.filePaths) {
                    const objectKeys = Object.keys(res.filePaths);
                    this.menus = objectKeys.map((item) => ({
                        processName: item,
                        isSelected: false,
                    }));
                }
                else {
                    this.menus = [];
                    this.styleDetailsForDownload = [];
                }
            },
            error: (err) => {
                this.menus = [];
                this.styleDetailsForDownload = [];
                this.tableData = [];
            },
        });
    }
    downloadFile(file) {
        const encodedUrl = encodeURIComponent(file.url);
        const fullUrl = `${this.BASE_URL}/${encodedUrl}`;
        window.open(fullUrl, '_blank');
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: DashboardUiComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "17.3.12", type: DashboardUiComponent, isStandalone: true, selector: "lib-file-config-library", inputs: { BASE_URL: "BASE_URL" }, providers: [MasterService], ngImport: i0, template: "<div class=\"dashboard-component p-0 m-0\">\r\n  <!-- input filed to search style / sketch number -->\r\n  <div class=\"p-10 col-3 d-flex flex-column\">\r\n    <label class=\"form-group-label text-white-color mb-1\">Enter ID</label>\r\n    <input\r\n      type=\"text\"\r\n      class=\"form-control input-background-color text-white-color\"\r\n      placeholder=\"Enter ID\"\r\n      [(ngModel)]=\"styleSketchNumber\"\r\n      (keydown.enter)=\"enterPressed()\"\r\n    />\r\n  </div>\r\n\r\n  <div class=\"row m-0 p-0 master-container\">\r\n    <div class=\"col-12 m-0 p-0 d-flex\">\r\n      <!-- Sidebar -->\r\n      <div class=\"side__bar d-flex flex-column\">\r\n        @for (item of menus; track item) {\r\n          <div\r\n            class=\"menu-item list-item border-bottom-one\"\r\n            [class.active-menu]=\"item.isSelected\"\r\n            (click)=\"itemSelected(item)\"\r\n          >\r\n            <label class=\"menu-header w-100 cursor-pointer\">\r\n              {{ item.processName }}\r\n            </label>\r\n          </div>\r\n        }\r\n      </div>\r\n\r\n      <!-- Right content -->\r\n      <div class=\"display-container flex-grow-1 ms-3 p-10\">\r\n        <h4 class=\"text-white-color mb-1 border-bottom-one\">File Details:</h4>\r\n\r\n        @if (!!selectedProcessName) {\r\n          <div class=\"tabs\">\r\n            <button\r\n              class=\"tab-btn\"\r\n              [class.active]=\"selectedTab === 'latest'\"\r\n              (click)=\"selectedTab = 'latest'\"\r\n            >\r\n              Latest\r\n            </button>\r\n\r\n            <button\r\n              class=\"tab-btn\"\r\n              [class.active]=\"selectedTab === 'history'\"\r\n              (click)=\"selectedTab = 'history'\"\r\n            >\r\n              History\r\n            </button>\r\n          </div>\r\n        }\r\n\r\n        <!-- Table -->\r\n\r\n        @if (latestTableData.length || historyTableData.length) {\r\n          <table class=\"custom-table w-100 mt-2\">\r\n            <thead>\r\n              <tr>\r\n                <th class=\"text-white-color\">Version</th>\r\n                <th class=\"text-white-color\">File Name</th>\r\n                <th class=\"text-white-color\">Created Date</th>\r\n              </tr>\r\n            </thead>\r\n\r\n            <tbody>\r\n              @for (\r\n                group of selectedTab === \"latest\"\r\n                  ? latestTableData\r\n                  : historyTableData;\r\n                track group.version\r\n              ) {\r\n                @for (\r\n                  file of group.files;\r\n                  track file.fileName;\r\n                  let i = $index\r\n                ) {\r\n                  <tr>\r\n                    <td class=\"text-white-color\">\r\n                      @if (i === 0) {\r\n                        {{ group.version }}\r\n                      }\r\n                    </td>\r\n                    <td>\r\n                      <div class=\"file-cell\">\r\n                        <span class=\"file-name text-white-color\">{{\r\n                          file.fileName\r\n                        }}</span>\r\n\r\n                        <svg\r\n                          class=\"download-icon\"\r\n                          xmlns=\"http://www.w3.org/2000/svg\"\r\n                          viewBox=\"0 0 24 24\"\r\n                          width=\"16\"\r\n                          height=\"16\"\r\n                          (click)=\"downloadFile(file)\"\r\n                          title=\"Download\"\r\n                        >\r\n                          <path\r\n                            fill=\"currentColor\"\r\n                            d=\"M5 20h14v-2H5v2Zm7-18v10.17l3.59-3.58L17 10l-5 5-5-5 1.41-1.41L11 12.17V2h1Z\"\r\n                          />\r\n                        </svg>\r\n                      </div>\r\n                    </td>\r\n                    <td class=\"text-white-color\">\r\n                      {{ file.createdDate }}\r\n                    </td>\r\n                  </tr>\r\n                }\r\n\r\n                <tr class=\"version-separator\">\r\n                  <td colspan=\"3\"></td>\r\n                </tr>\r\n              }\r\n            </tbody>\r\n          </table>\r\n        }\r\n      </div>\r\n    </div>\r\n  </div>\r\n</div>\r\n", styles: ["@charset \"UTF-8\";:host{--background-color: rgb(24, 24, 27);--border-color: #d0d5dd80;--gray-dark-3: #3a3a3a;--input-background-color: rgb(40, 40, 40);--text-dark-color: #000;--text-white-color: #fff;--button-color: #ab7340;display:block}.dashboard-component{height:100vh;background-color:var(--input-background-color)}.dashboard-component .h-100{height:100px}.dashboard-component .text-dark-color{color:var(--text-dark-color)}.dashboard-component .text-white-color{color:var(--text-white-color)}.dashboard-component .h-50{height:50px}.dashboard-component .p-10{padding:10px}.dashboard-component .input-background-color{background-color:var(--background-color)!important}.dashboard-component .input-background-color::placeholder{color:var(--text-white-color);opacity:1}.dashboard-component .form-group-label{margin-bottom:6px!important;font-size:12px!important}.dashboard-component input.form-control{height:36px}.dashboard-component .border-bottom-one{border-bottom:1px solid var(--border-color)}.dashboard-component .cursor-pointer{cursor:pointer}.dashboard-component .master-container .side__bar .menu-header{padding:10px 14px;font-size:14px;font-weight:400}.dashboard-component .master-container .side__bar{width:200px;overflow-y:auto;max-height:calc(100vh - 80px);border-right:1px solid #d0d5dd;background-color:var(--background-color);color:var(--text-white-color);flex-shrink:0}.dashboard-component .master-container .menu-item{position:relative}.dashboard-component .master-container .dropdown-indicator{margin-left:auto}.dashboard-component .master-container .list-item.active-menu{background-color:var(--button-color)}.dashboard-component .master-container .child-menu{display:block}.dashboard-component .master-container .child-menu div,.dashboard-component .master-container .child-menu.pl-3{padding-left:20px}.dashboard-component .master-container .sticky-search{position:sticky;top:0;z-index:10;padding:5px}.dashboard-component .master-container .menu-list{flex:1;overflow-y:auto;padding:10px 0}.dashboard-component .master-container .side__bar{display:flex;flex-direction:column;height:91vh;overflow:hidden}.dashboard-component .display-container{background-color:var(--background-color);overflow-y:auto;max-height:91vh}.dashboard-component .custom-table{border-collapse:collapse}.dashboard-component .custom-table th,.dashboard-component .custom-table td{padding:10px 12px;text-align:left;border:none}.dashboard-component .custom-table tbody tr{border-bottom:none}.dashboard-component .version-separator td{height:10px;border-bottom:2px solid var(--text-white-color);opacity:.5}.dashboard-component .download-icon{font-size:16px;color:var(--button-color);cursor:pointer}.dashboard-component .download-icon:hover{transform:scale(1.1)}.dashboard-component .tabs{display:flex;gap:10px;margin-bottom:12px}.dashboard-component .tab-btn{padding:6px 18px;background-color:var(--input-background-color);cursor:pointer;border-radius:6px;color:var(--text-white-color);transition:all .3s ease}.dashboard-component .tab-btn.active,.dashboard-component .tab-btn:hover{background-color:var(--button-color);color:var(--text-white-color)}\n"], dependencies: [{ kind: "ngmodule", type: FormsModule }, { kind: "directive", type: i1.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i1.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i1.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: DashboardUiComponent, decorators: [{
            type: Component,
            args: [{ selector: 'lib-file-config-library', standalone: true, imports: [FormsModule], providers: [MasterService], template: "<div class=\"dashboard-component p-0 m-0\">\r\n  <!-- input filed to search style / sketch number -->\r\n  <div class=\"p-10 col-3 d-flex flex-column\">\r\n    <label class=\"form-group-label text-white-color mb-1\">Enter ID</label>\r\n    <input\r\n      type=\"text\"\r\n      class=\"form-control input-background-color text-white-color\"\r\n      placeholder=\"Enter ID\"\r\n      [(ngModel)]=\"styleSketchNumber\"\r\n      (keydown.enter)=\"enterPressed()\"\r\n    />\r\n  </div>\r\n\r\n  <div class=\"row m-0 p-0 master-container\">\r\n    <div class=\"col-12 m-0 p-0 d-flex\">\r\n      <!-- Sidebar -->\r\n      <div class=\"side__bar d-flex flex-column\">\r\n        @for (item of menus; track item) {\r\n          <div\r\n            class=\"menu-item list-item border-bottom-one\"\r\n            [class.active-menu]=\"item.isSelected\"\r\n            (click)=\"itemSelected(item)\"\r\n          >\r\n            <label class=\"menu-header w-100 cursor-pointer\">\r\n              {{ item.processName }}\r\n            </label>\r\n          </div>\r\n        }\r\n      </div>\r\n\r\n      <!-- Right content -->\r\n      <div class=\"display-container flex-grow-1 ms-3 p-10\">\r\n        <h4 class=\"text-white-color mb-1 border-bottom-one\">File Details:</h4>\r\n\r\n        @if (!!selectedProcessName) {\r\n          <div class=\"tabs\">\r\n            <button\r\n              class=\"tab-btn\"\r\n              [class.active]=\"selectedTab === 'latest'\"\r\n              (click)=\"selectedTab = 'latest'\"\r\n            >\r\n              Latest\r\n            </button>\r\n\r\n            <button\r\n              class=\"tab-btn\"\r\n              [class.active]=\"selectedTab === 'history'\"\r\n              (click)=\"selectedTab = 'history'\"\r\n            >\r\n              History\r\n            </button>\r\n          </div>\r\n        }\r\n\r\n        <!-- Table -->\r\n\r\n        @if (latestTableData.length || historyTableData.length) {\r\n          <table class=\"custom-table w-100 mt-2\">\r\n            <thead>\r\n              <tr>\r\n                <th class=\"text-white-color\">Version</th>\r\n                <th class=\"text-white-color\">File Name</th>\r\n                <th class=\"text-white-color\">Created Date</th>\r\n              </tr>\r\n            </thead>\r\n\r\n            <tbody>\r\n              @for (\r\n                group of selectedTab === \"latest\"\r\n                  ? latestTableData\r\n                  : historyTableData;\r\n                track group.version\r\n              ) {\r\n                @for (\r\n                  file of group.files;\r\n                  track file.fileName;\r\n                  let i = $index\r\n                ) {\r\n                  <tr>\r\n                    <td class=\"text-white-color\">\r\n                      @if (i === 0) {\r\n                        {{ group.version }}\r\n                      }\r\n                    </td>\r\n                    <td>\r\n                      <div class=\"file-cell\">\r\n                        <span class=\"file-name text-white-color\">{{\r\n                          file.fileName\r\n                        }}</span>\r\n\r\n                        <svg\r\n                          class=\"download-icon\"\r\n                          xmlns=\"http://www.w3.org/2000/svg\"\r\n                          viewBox=\"0 0 24 24\"\r\n                          width=\"16\"\r\n                          height=\"16\"\r\n                          (click)=\"downloadFile(file)\"\r\n                          title=\"Download\"\r\n                        >\r\n                          <path\r\n                            fill=\"currentColor\"\r\n                            d=\"M5 20h14v-2H5v2Zm7-18v10.17l3.59-3.58L17 10l-5 5-5-5 1.41-1.41L11 12.17V2h1Z\"\r\n                          />\r\n                        </svg>\r\n                      </div>\r\n                    </td>\r\n                    <td class=\"text-white-color\">\r\n                      {{ file.createdDate }}\r\n                    </td>\r\n                  </tr>\r\n                }\r\n\r\n                <tr class=\"version-separator\">\r\n                  <td colspan=\"3\"></td>\r\n                </tr>\r\n              }\r\n            </tbody>\r\n          </table>\r\n        }\r\n      </div>\r\n    </div>\r\n  </div>\r\n</div>\r\n", styles: ["@charset \"UTF-8\";:host{--background-color: rgb(24, 24, 27);--border-color: #d0d5dd80;--gray-dark-3: #3a3a3a;--input-background-color: rgb(40, 40, 40);--text-dark-color: #000;--text-white-color: #fff;--button-color: #ab7340;display:block}.dashboard-component{height:100vh;background-color:var(--input-background-color)}.dashboard-component .h-100{height:100px}.dashboard-component .text-dark-color{color:var(--text-dark-color)}.dashboard-component .text-white-color{color:var(--text-white-color)}.dashboard-component .h-50{height:50px}.dashboard-component .p-10{padding:10px}.dashboard-component .input-background-color{background-color:var(--background-color)!important}.dashboard-component .input-background-color::placeholder{color:var(--text-white-color);opacity:1}.dashboard-component .form-group-label{margin-bottom:6px!important;font-size:12px!important}.dashboard-component input.form-control{height:36px}.dashboard-component .border-bottom-one{border-bottom:1px solid var(--border-color)}.dashboard-component .cursor-pointer{cursor:pointer}.dashboard-component .master-container .side__bar .menu-header{padding:10px 14px;font-size:14px;font-weight:400}.dashboard-component .master-container .side__bar{width:200px;overflow-y:auto;max-height:calc(100vh - 80px);border-right:1px solid #d0d5dd;background-color:var(--background-color);color:var(--text-white-color);flex-shrink:0}.dashboard-component .master-container .menu-item{position:relative}.dashboard-component .master-container .dropdown-indicator{margin-left:auto}.dashboard-component .master-container .list-item.active-menu{background-color:var(--button-color)}.dashboard-component .master-container .child-menu{display:block}.dashboard-component .master-container .child-menu div,.dashboard-component .master-container .child-menu.pl-3{padding-left:20px}.dashboard-component .master-container .sticky-search{position:sticky;top:0;z-index:10;padding:5px}.dashboard-component .master-container .menu-list{flex:1;overflow-y:auto;padding:10px 0}.dashboard-component .master-container .side__bar{display:flex;flex-direction:column;height:91vh;overflow:hidden}.dashboard-component .display-container{background-color:var(--background-color);overflow-y:auto;max-height:91vh}.dashboard-component .custom-table{border-collapse:collapse}.dashboard-component .custom-table th,.dashboard-component .custom-table td{padding:10px 12px;text-align:left;border:none}.dashboard-component .custom-table tbody tr{border-bottom:none}.dashboard-component .version-separator td{height:10px;border-bottom:2px solid var(--text-white-color);opacity:.5}.dashboard-component .download-icon{font-size:16px;color:var(--button-color);cursor:pointer}.dashboard-component .download-icon:hover{transform:scale(1.1)}.dashboard-component .tabs{display:flex;gap:10px;margin-bottom:12px}.dashboard-component .tab-btn{padding:6px 18px;background-color:var(--input-background-color);cursor:pointer;border-radius:6px;color:var(--text-white-color);transition:all .3s ease}.dashboard-component .tab-btn.active,.dashboard-component .tab-btn:hover{background-color:var(--button-color);color:var(--text-white-color)}\n"] }]
        }], propDecorators: { BASE_URL: [{
                type: Input
            }] } });

/*
 * Public API Surface of file-config-library
 */
// export * from './lib/file-config-library.service';
// export * from './lib/file-config-library.component';

/**
 * Generated bundle index. Do not edit.
 */

export { DashboardUiComponent };
//# sourceMappingURL=file-config-library.mjs.map
