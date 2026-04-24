import * as i0 from '@angular/core';
import { inject, Injectable, Input, Component, NgModule } from '@angular/core';
import * as i1 from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import * as i2 from '@angular/material/progress-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

class MasterService {
    constructor() {
        this.http = inject(HttpClient);
    }
    //#region POST
    getDetailsWithProcess(payload, BASE_URL) {
        return this.http.post(`${BASE_URL}/getFilesPath/v4`, payload);
    }
    getDetailsWithProcessForPd(number, BASE_URL) {
        return this.http.get(`${BASE_URL}/pd/file/getImagev2?number=${number}`);
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
        this.PD_BASE_URL = "https://dev-api.jewelnext.mobioffice.io";
        this.loaderType = "bar";
        this.menus = [];
        this.styleSketchNumber = null;
        this.selectedProcessName = null;
        this.selectedTab = 'latest';
        this.latestTableData = [];
        this.historyTableData = [];
        this.pdMenus = [];
        this.loader = false;
    }
    ngOnInit() {
    }
    itemSelected(item, isPDData = false) {
        this.historyTableData = [];
        this.latestTableData = [];
        this.selectedProcessName = item.processName;
        item.isSelected = true;
        if (!isPDData) {
            this.menus.forEach((item) => {
                if (item.processName !== this.selectedProcessName)
                    item.isSelected = false;
            });
            this.pdMenus.forEach((item) => item.isSelected = false);
            if (this.selectedProcessName) {
                const data = this.styleDetailsForDownload.filePaths[this.selectedProcessName];
                this.prepareTableData(data);
            }
        }
        else {
            this.pdMenus.forEach((item) => {
                if (item.processName !== this.selectedProcessName)
                    item.isSelected = false;
            });
            this.menus.forEach((item) => item.isSelected = false);
            this.preparePDTableData();
        }
    }
    prepareTableData(data) {
        const allFiles = [];
        // Flatten all versions into single array
        Object.entries(data).forEach(([fileType, files]) => {
            Object.entries(files).forEach(([version, details]) => {
                Object.entries(details).forEach(([fileName, fileDetails]) => {
                    allFiles.push({
                        fileType,
                        version,
                        fileName,
                        createdDate: fileDetails.createdDate,
                        url: fileDetails.url,
                    });
                });
            });
        });
        if (allFiles.length > 0) {
            // 🔥 First element only → Latest
            const latest = Math.max(...allFiles.map(item => parseInt(item.version.replace('v', ''), 10)));
            const latestVersion = 'v' + latest;
            this.latestTableData = [{
                    version: latestVersion,
                    files: [],
                }];
            allFiles.forEach((file) => {
                if (file.version === latestVersion) {
                    this.latestTableData[0].files.push(file);
                }
                else {
                    const index = this.latestTableData.findIndex((item) => item.version === file.version);
                    if (index !== -1) {
                        this.latestTableData[index].files.push(file);
                    }
                    else {
                        this.latestTableData.push({
                            version: file.version,
                            files: [file],
                        });
                    }
                }
            });
        }
        console.log('Latest:', this.latestTableData);
        console.log('History:', this.historyTableData);
    }
    preparePDTableData() {
        ;
        switch (this.selectedProcessName) {
            case "sketch":
                const url = this.pdDataForDownload["sketchImage"];
                const fileArray = url?.split('/') || [];
                const fileType = fileArray?.[4] || "";
                const fileName = fileArray?.[fileArray?.length - 1] || "";
                this.latestTableData.push({
                    version: "",
                    files: [{ fileName, fileType, url, createdDate: "", version: "" }],
                });
                break;
            case "Brief Images":
                const briefUrls = this.pdDataForDownload["briefImage"];
                briefUrls.forEach((briefUrl) => {
                    const briefFileArray = briefUrl?.split('/') || [];
                    const briefFileType = briefFileArray?.[4] || "";
                    const briefFileName = briefFileArray?.[briefFileArray?.length - 1] || "";
                    this.latestTableData.push({
                        version: "",
                        files: [{ fileName: briefFileName, fileType: briefFileType, url: briefUrl, createdDate: "", version: "" }],
                    });
                });
                break;
            case "Sub Brief Images":
                const subBriefUrls = this.pdDataForDownload["subBriefImage"];
                subBriefUrls.forEach((subBriefUrl) => {
                    const subBriefFileArray = subBriefUrl?.split('/') || [];
                    const subBriefFileType = subBriefFileArray?.[4] || "";
                    const subBriefFileName = subBriefFileArray?.[subBriefFileArray?.length - 1] || "";
                    this.latestTableData.push({
                        version: "",
                        files: [{ fileName: subBriefFileName, fileType: subBriefFileType, url: subBriefUrl, createdDate: "", version: "" }],
                    });
                });
                break;
            default:
                break;
        }
    }
    enterPressed() {
        if (this.loader)
            return;
        this.loader = true;
        this.selectedProcessName = null;
        this.latestTableData = [];
        this.historyTableData = [];
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
                this.masterService.getDetailsWithProcessForPd(this.styleSketchNumber, this.PD_BASE_URL).subscribe({
                    next: (res) => {
                        this.pdDataForDownload = res?.data;
                        this.pdMenus = [];
                        if (!!this.pdDataForDownload["briefImage"]) {
                            this.pdMenus = [{
                                    processName: "Brief Images",
                                    isSelected: false,
                                },
                            ];
                        }
                        if (!!this.pdDataForDownload["subBriefImage"]) {
                            this.pdMenus.push({
                                processName: "Sub Brief Images",
                                isSelected: false,
                            });
                        }
                        if (!this.styleDetailsForDownload.filePaths["sketch"] && !!this.pdDataForDownload["sketchImage"]) {
                            this.pdMenus.push({
                                processName: "sketch",
                                isSelected: false,
                            });
                        }
                        this.loader = false;
                    }, error: (err) => {
                        this.pdMenus = [];
                        this.pdDataForDownload = [];
                        this.loader = false;
                    },
                });
            },
            error: (err) => {
                this.menus = [];
                this.styleDetailsForDownload = [];
                this.loader = false;
            },
        });
    }
    downloadFile(file) {
        const encodedUrl = encodeURIComponent(file.url);
        const fullUrl = `${this.BASE_URL}/${encodedUrl}`;
        window.open(fullUrl, '_blank');
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: DashboardUiComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "17.3.12", type: DashboardUiComponent, isStandalone: true, selector: "lib-file-config-library", inputs: { BASE_URL: "BASE_URL", PD_BASE_URL: "PD_BASE_URL", loaderType: "loaderType" }, providers: [MasterService], ngImport: i0, template: "@if(loader){\r\n  <div id=\"wrapper\">\r\n    @if (loaderType === \"circle\") {\r\n\r\n      <div class=\"profile-main-loader\">\r\n        <div class=\"loader spinner-container\">\r\n          <div class=\"spinner-border text-yellow\" role=\"status\"></div>\r\n        </div>\r\n      </div>\r\n    }\r\n    @if (loaderType === \"bar\") {\r\n      <div style=\"position: absolute; top: 0px; height: 2px;\" class=\"w-100\">\r\n        <mat-progress-bar color=\"primary\" mode=\"indeterminate\" class=\"mat-progress-bar\"> </mat-progress-bar>\r\n      </div>\r\n    }\r\n  </div>\r\n}\r\n\r\n<div class=\"dashboard-component p-0 m-0\">\r\n  <!-- input filed to search style / sketch number -->\r\n  <div class=\"p-10 col-3 d-flex flex-column\">\r\n    <label class=\"form-group-label text-white-color mb-1\">Enter ID</label>\r\n    <input\r\n      type=\"text\"\r\n      class=\"form-control input-background-color text-white-color\"\r\n      placeholder=\"Enter ID\"\r\n      [(ngModel)]=\"styleSketchNumber\"\r\n      (keydown.enter)=\"enterPressed()\"\r\n    />\r\n  </div>\r\n\r\n  <div class=\"row m-0 p-0 master-container\">\r\n    <div class=\"col-12 m-0 p-0 d-flex\">\r\n      <!-- Sidebar -->\r\n      <div class=\"side__bar d-flex flex-column\">\r\n        @for (item of pdMenus; track item) {\r\n          <div\r\n            class=\"menu-item list-item border-bottom-one\"\r\n            [class.active-menu]=\"item.isSelected\"\r\n            (click)=\"itemSelected(item, true)\"\r\n          >\r\n            <label class=\"menu-header w-100 cursor-pointer\">\r\n              {{ item.processName }}\r\n            </label>\r\n          </div>\r\n        }\r\n        @for (item of menus; track item) {\r\n          <div\r\n            class=\"menu-item list-item border-bottom-one\"\r\n            [class.active-menu]=\"item.isSelected\"\r\n            (click)=\"itemSelected(item)\"\r\n          >\r\n            <label class=\"menu-header w-100 cursor-pointer\">\r\n              {{ item.processName }}\r\n            </label>\r\n          </div>\r\n        }\r\n      </div>\r\n\r\n      <!-- Right content -->\r\n      <div class=\"display-container flex-grow-1 ms-3 p-10\">\r\n        <h4 class=\"text-white-color mb-1 border-bottom-one\">File Details:</h4>\r\n\r\n        @if (!!selectedProcessName) {\r\n          <div class=\"tabs\">\r\n            <button\r\n              class=\"tab-btn\"\r\n              [class.active]=\"selectedTab === 'latest'\"\r\n              (click)=\"selectedTab = 'latest'\"\r\n            >\r\n              Latest\r\n            </button>\r\n\r\n            <button\r\n              class=\"tab-btn\"\r\n              [class.active]=\"selectedTab === 'history'\"\r\n              (click)=\"selectedTab = 'history'\"\r\n            >\r\n              History\r\n            </button>\r\n          </div>\r\n        }\r\n\r\n        <!-- Table -->\r\n\r\n        @if (latestTableData.length || historyTableData.length) {\r\n          <table class=\"custom-table w-100 mt-2\">\r\n            <thead>\r\n              <tr>\r\n                <th class=\"text-white-color\">Version</th>\r\n                <th class=\"text-white-color\">File Name</th>\r\n                <th class=\"text-white-color\">File Type</th>\r\n                <th class=\"text-white-color\">Created Date</th>\r\n              </tr>\r\n            </thead>\r\n\r\n            <tbody>\r\n              @for (\r\n                group of selectedTab === \"latest\"\r\n                  ? latestTableData\r\n                  : historyTableData;\r\n                track group.version\r\n              ) {\r\n                @for (\r\n                  file of group.files;\r\n                  track file.fileName;\r\n                  let i = $index\r\n                ) {\r\n                  <tr>\r\n                    <td class=\"text-white-color\">\r\n                        {{ group.version }}\r\n                    </td>\r\n                    <td>\r\n                      <div class=\"file-cell\">\r\n                        <span class=\"file-name text-white-color\">{{\r\n                          file.fileName\r\n                        }}</span>\r\n\r\n                        <svg\r\n                          class=\"download-icon\"\r\n                          xmlns=\"http://www.w3.org/2000/svg\"\r\n                          viewBox=\"0 0 24 24\"\r\n                          width=\"16\"\r\n                          height=\"16\"\r\n                          (click)=\"downloadFile(file)\"\r\n                          title=\"Download\"\r\n                        >\r\n                          <path\r\n                            fill=\"currentColor\"\r\n                            d=\"M5 20h14v-2H5v2Zm7-18v10.17l3.59-3.58L17 10l-5 5-5-5 1.41-1.41L11 12.17V2h1Z\"\r\n                          />\r\n                        </svg>\r\n                      </div>\r\n                    </td>\r\n                    <td class=\"text-white-color\">\r\n                      {{ file.fileType }}\r\n                    </td>\r\n                    <td class=\"text-white-color\">\r\n                      {{ file.createdDate }}\r\n                    </td>\r\n                  </tr>\r\n                }\r\n              }\r\n            </tbody>\r\n          </table>\r\n        }\r\n      </div>\r\n    </div>\r\n  </div>\r\n</div>\r\n", styles: ["@charset \"UTF-8\";:host{--background-color: rgb(24, 24, 27);--border-color: #d0d5dd80;--gray-dark-3: #3a3a3a;--input-background-color: rgb(40, 40, 40);--text-dark-color: #000;--text-white-color: #fff;--button-color: #ab7340;display:block}.dashboard-component{height:100vh;background-color:var(--input-background-color)}.dashboard-component .h-100{height:100px}.dashboard-component .text-dark-color{color:var(--text-dark-color)}.dashboard-component .text-white-color{color:var(--text-white-color)}.dashboard-component .h-50{height:50px}.dashboard-component .p-10{padding:10px}.dashboard-component .input-background-color{background-color:var(--background-color)!important}.dashboard-component .input-background-color::placeholder{color:var(--text-white-color);opacity:1}.dashboard-component .form-group-label{margin-bottom:6px!important;font-size:12px!important}.dashboard-component input.form-control{height:36px}.dashboard-component .border-bottom-one{border-bottom:1px solid var(--border-color)}.dashboard-component .cursor-pointer{cursor:pointer}.dashboard-component .master-container .side__bar .menu-header{padding:10px 14px;font-size:14px;font-weight:400}.dashboard-component .master-container .side__bar{width:200px;overflow-y:auto;max-height:calc(100vh - 80px);border-right:1px solid #d0d5dd;background-color:var(--background-color);color:var(--text-white-color);flex-shrink:0}.dashboard-component .master-container .menu-item{position:relative}.dashboard-component .master-container .dropdown-indicator{margin-left:auto}.dashboard-component .master-container .list-item.active-menu{background-color:var(--button-color)}.dashboard-component .master-container .child-menu{display:block}.dashboard-component .master-container .child-menu div,.dashboard-component .master-container .child-menu.pl-3{padding-left:20px}.dashboard-component .master-container .sticky-search{position:sticky;top:0;z-index:10;padding:5px}.dashboard-component .master-container .menu-list{flex:1;overflow-y:auto;padding:10px 0}.dashboard-component .master-container .side__bar{display:flex;flex-direction:column;height:91vh;overflow:hidden}.dashboard-component .display-container{background-color:var(--background-color);overflow-y:auto;max-height:91vh}.dashboard-component .custom-table{border-collapse:collapse}.dashboard-component .custom-table th,.dashboard-component .custom-table td{padding:10px 12px;text-align:left;border:none}.dashboard-component .custom-table tbody tr{border-bottom:none}.dashboard-component .version-separator td{height:10px;border-bottom:2px solid var(--text-white-color);opacity:.5}.dashboard-component .download-icon{font-size:16px;color:var(--button-color);cursor:pointer}.dashboard-component .download-icon:hover{transform:scale(1.1)}.dashboard-component .tabs{display:flex;gap:10px;margin-bottom:12px}.dashboard-component .tab-btn{padding:6px 18px;background-color:var(--input-background-color);cursor:pointer;border-radius:6px;color:var(--text-white-color);transition:all .3s ease}.dashboard-component .tab-btn.active,.dashboard-component .tab-btn:hover{background-color:var(--button-color);color:var(--text-white-color)}.profile-main-loader{left:50%!important;position:fixed!important;top:50%!important;margin-top:-100px;width:45px;z-index:90000000!important}.mat-progress-bar{height:2px!important;color:#ab7340!important}.text-yellow{color:#ab7340!important}\n"], dependencies: [{ kind: "ngmodule", type: FormsModule }, { kind: "directive", type: i1.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i1.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i1.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "ngmodule", type: MatProgressBarModule }, { kind: "component", type: i2.MatProgressBar, selector: "mat-progress-bar", inputs: ["color", "value", "bufferValue", "mode"], outputs: ["animationEnd"], exportAs: ["matProgressBar"] }, { kind: "ngmodule", type: MatProgressSpinnerModule }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: DashboardUiComponent, decorators: [{
            type: Component,
            args: [{ selector: 'lib-file-config-library', standalone: true, imports: [FormsModule, MatProgressBarModule, MatProgressSpinnerModule], providers: [MasterService], template: "@if(loader){\r\n  <div id=\"wrapper\">\r\n    @if (loaderType === \"circle\") {\r\n\r\n      <div class=\"profile-main-loader\">\r\n        <div class=\"loader spinner-container\">\r\n          <div class=\"spinner-border text-yellow\" role=\"status\"></div>\r\n        </div>\r\n      </div>\r\n    }\r\n    @if (loaderType === \"bar\") {\r\n      <div style=\"position: absolute; top: 0px; height: 2px;\" class=\"w-100\">\r\n        <mat-progress-bar color=\"primary\" mode=\"indeterminate\" class=\"mat-progress-bar\"> </mat-progress-bar>\r\n      </div>\r\n    }\r\n  </div>\r\n}\r\n\r\n<div class=\"dashboard-component p-0 m-0\">\r\n  <!-- input filed to search style / sketch number -->\r\n  <div class=\"p-10 col-3 d-flex flex-column\">\r\n    <label class=\"form-group-label text-white-color mb-1\">Enter ID</label>\r\n    <input\r\n      type=\"text\"\r\n      class=\"form-control input-background-color text-white-color\"\r\n      placeholder=\"Enter ID\"\r\n      [(ngModel)]=\"styleSketchNumber\"\r\n      (keydown.enter)=\"enterPressed()\"\r\n    />\r\n  </div>\r\n\r\n  <div class=\"row m-0 p-0 master-container\">\r\n    <div class=\"col-12 m-0 p-0 d-flex\">\r\n      <!-- Sidebar -->\r\n      <div class=\"side__bar d-flex flex-column\">\r\n        @for (item of pdMenus; track item) {\r\n          <div\r\n            class=\"menu-item list-item border-bottom-one\"\r\n            [class.active-menu]=\"item.isSelected\"\r\n            (click)=\"itemSelected(item, true)\"\r\n          >\r\n            <label class=\"menu-header w-100 cursor-pointer\">\r\n              {{ item.processName }}\r\n            </label>\r\n          </div>\r\n        }\r\n        @for (item of menus; track item) {\r\n          <div\r\n            class=\"menu-item list-item border-bottom-one\"\r\n            [class.active-menu]=\"item.isSelected\"\r\n            (click)=\"itemSelected(item)\"\r\n          >\r\n            <label class=\"menu-header w-100 cursor-pointer\">\r\n              {{ item.processName }}\r\n            </label>\r\n          </div>\r\n        }\r\n      </div>\r\n\r\n      <!-- Right content -->\r\n      <div class=\"display-container flex-grow-1 ms-3 p-10\">\r\n        <h4 class=\"text-white-color mb-1 border-bottom-one\">File Details:</h4>\r\n\r\n        @if (!!selectedProcessName) {\r\n          <div class=\"tabs\">\r\n            <button\r\n              class=\"tab-btn\"\r\n              [class.active]=\"selectedTab === 'latest'\"\r\n              (click)=\"selectedTab = 'latest'\"\r\n            >\r\n              Latest\r\n            </button>\r\n\r\n            <button\r\n              class=\"tab-btn\"\r\n              [class.active]=\"selectedTab === 'history'\"\r\n              (click)=\"selectedTab = 'history'\"\r\n            >\r\n              History\r\n            </button>\r\n          </div>\r\n        }\r\n\r\n        <!-- Table -->\r\n\r\n        @if (latestTableData.length || historyTableData.length) {\r\n          <table class=\"custom-table w-100 mt-2\">\r\n            <thead>\r\n              <tr>\r\n                <th class=\"text-white-color\">Version</th>\r\n                <th class=\"text-white-color\">File Name</th>\r\n                <th class=\"text-white-color\">File Type</th>\r\n                <th class=\"text-white-color\">Created Date</th>\r\n              </tr>\r\n            </thead>\r\n\r\n            <tbody>\r\n              @for (\r\n                group of selectedTab === \"latest\"\r\n                  ? latestTableData\r\n                  : historyTableData;\r\n                track group.version\r\n              ) {\r\n                @for (\r\n                  file of group.files;\r\n                  track file.fileName;\r\n                  let i = $index\r\n                ) {\r\n                  <tr>\r\n                    <td class=\"text-white-color\">\r\n                        {{ group.version }}\r\n                    </td>\r\n                    <td>\r\n                      <div class=\"file-cell\">\r\n                        <span class=\"file-name text-white-color\">{{\r\n                          file.fileName\r\n                        }}</span>\r\n\r\n                        <svg\r\n                          class=\"download-icon\"\r\n                          xmlns=\"http://www.w3.org/2000/svg\"\r\n                          viewBox=\"0 0 24 24\"\r\n                          width=\"16\"\r\n                          height=\"16\"\r\n                          (click)=\"downloadFile(file)\"\r\n                          title=\"Download\"\r\n                        >\r\n                          <path\r\n                            fill=\"currentColor\"\r\n                            d=\"M5 20h14v-2H5v2Zm7-18v10.17l3.59-3.58L17 10l-5 5-5-5 1.41-1.41L11 12.17V2h1Z\"\r\n                          />\r\n                        </svg>\r\n                      </div>\r\n                    </td>\r\n                    <td class=\"text-white-color\">\r\n                      {{ file.fileType }}\r\n                    </td>\r\n                    <td class=\"text-white-color\">\r\n                      {{ file.createdDate }}\r\n                    </td>\r\n                  </tr>\r\n                }\r\n              }\r\n            </tbody>\r\n          </table>\r\n        }\r\n      </div>\r\n    </div>\r\n  </div>\r\n</div>\r\n", styles: ["@charset \"UTF-8\";:host{--background-color: rgb(24, 24, 27);--border-color: #d0d5dd80;--gray-dark-3: #3a3a3a;--input-background-color: rgb(40, 40, 40);--text-dark-color: #000;--text-white-color: #fff;--button-color: #ab7340;display:block}.dashboard-component{height:100vh;background-color:var(--input-background-color)}.dashboard-component .h-100{height:100px}.dashboard-component .text-dark-color{color:var(--text-dark-color)}.dashboard-component .text-white-color{color:var(--text-white-color)}.dashboard-component .h-50{height:50px}.dashboard-component .p-10{padding:10px}.dashboard-component .input-background-color{background-color:var(--background-color)!important}.dashboard-component .input-background-color::placeholder{color:var(--text-white-color);opacity:1}.dashboard-component .form-group-label{margin-bottom:6px!important;font-size:12px!important}.dashboard-component input.form-control{height:36px}.dashboard-component .border-bottom-one{border-bottom:1px solid var(--border-color)}.dashboard-component .cursor-pointer{cursor:pointer}.dashboard-component .master-container .side__bar .menu-header{padding:10px 14px;font-size:14px;font-weight:400}.dashboard-component .master-container .side__bar{width:200px;overflow-y:auto;max-height:calc(100vh - 80px);border-right:1px solid #d0d5dd;background-color:var(--background-color);color:var(--text-white-color);flex-shrink:0}.dashboard-component .master-container .menu-item{position:relative}.dashboard-component .master-container .dropdown-indicator{margin-left:auto}.dashboard-component .master-container .list-item.active-menu{background-color:var(--button-color)}.dashboard-component .master-container .child-menu{display:block}.dashboard-component .master-container .child-menu div,.dashboard-component .master-container .child-menu.pl-3{padding-left:20px}.dashboard-component .master-container .sticky-search{position:sticky;top:0;z-index:10;padding:5px}.dashboard-component .master-container .menu-list{flex:1;overflow-y:auto;padding:10px 0}.dashboard-component .master-container .side__bar{display:flex;flex-direction:column;height:91vh;overflow:hidden}.dashboard-component .display-container{background-color:var(--background-color);overflow-y:auto;max-height:91vh}.dashboard-component .custom-table{border-collapse:collapse}.dashboard-component .custom-table th,.dashboard-component .custom-table td{padding:10px 12px;text-align:left;border:none}.dashboard-component .custom-table tbody tr{border-bottom:none}.dashboard-component .version-separator td{height:10px;border-bottom:2px solid var(--text-white-color);opacity:.5}.dashboard-component .download-icon{font-size:16px;color:var(--button-color);cursor:pointer}.dashboard-component .download-icon:hover{transform:scale(1.1)}.dashboard-component .tabs{display:flex;gap:10px;margin-bottom:12px}.dashboard-component .tab-btn{padding:6px 18px;background-color:var(--input-background-color);cursor:pointer;border-radius:6px;color:var(--text-white-color);transition:all .3s ease}.dashboard-component .tab-btn.active,.dashboard-component .tab-btn:hover{background-color:var(--button-color);color:var(--text-white-color)}.profile-main-loader{left:50%!important;position:fixed!important;top:50%!important;margin-top:-100px;width:45px;z-index:90000000!important}.mat-progress-bar{height:2px!important;color:#ab7340!important}.text-yellow{color:#ab7340!important}\n"] }]
        }], propDecorators: { BASE_URL: [{
                type: Input
            }], PD_BASE_URL: [{
                type: Input
            }], loaderType: [{
                type: Input
            }] } });

class FileConfigLibraryModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: FileConfigLibraryModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "17.3.12", ngImport: i0, type: FileConfigLibraryModule, imports: [DashboardUiComponent], exports: [DashboardUiComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: FileConfigLibraryModule, imports: [DashboardUiComponent] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: FileConfigLibraryModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [DashboardUiComponent],
                    exports: [DashboardUiComponent],
                }]
        }] });

/*
 * Public API Surface of file-config-library
 */

/**
 * Generated bundle index. Do not edit.
 */

export { DashboardUiComponent, FileConfigLibraryModule };
//# sourceMappingURL=file-config-library.mjs.map
