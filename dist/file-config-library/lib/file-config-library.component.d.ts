import { OnInit } from '@angular/core';
import * as i0 from "@angular/core";
export declare class DashboardUiComponent implements OnInit {
    private masterService;
    ngOnInit(): void;
    BASE_URL: string;
    PD_BASE_URL: string;
    loaderType: string;
    menus: any;
    styleSketchNumber: string | null;
    selectedProcessName: string | null;
    styleDetailsForDownload: any;
    selectedTab: 'latest' | 'history';
    latestTableData: any[];
    historyTableData: any[];
    pdMenus: any;
    pdDataForDownload: any;
    loader: boolean;
    itemSelected(item: any, isPDData?: boolean): void;
    private prepareTableData;
    private preparePDTableData;
    enterPressed(): void;
    downloadFile(file: any): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<DashboardUiComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<DashboardUiComponent, "lib-file-config-library", never, { "BASE_URL": { "alias": "BASE_URL"; "required": false; }; "PD_BASE_URL": { "alias": "PD_BASE_URL"; "required": false; }; "loaderType": { "alias": "loaderType"; "required": false; }; }, {}, never, never, true, never>;
}
