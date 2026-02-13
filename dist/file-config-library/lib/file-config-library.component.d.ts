import { OnInit } from '@angular/core';
import * as i0 from "@angular/core";
export declare class DashboardUiComponent implements OnInit {
    private masterService;
    ngOnInit(): void;
    BASE_URL: string;
    menus: any;
    styleSketchNumber: string | null;
    selectedProcessName: string | null;
    tableData: any[];
    styleDetailsForDownload: any;
    selectedTab: 'latest' | 'history';
    latestTableData: any[];
    historyTableData: any[];
    onInit(): void;
    private getAllMaster;
    itemSelected(item: any): void;
    prepareTableData(data: any): void;
    parseDate(dateStr: string): Date;
    enterPressed(): void;
    downloadFile(file: any): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<DashboardUiComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<DashboardUiComponent, "lib-file-config-library", never, { "BASE_URL": { "alias": "BASE_URL"; "required": false; }; }, {}, never, never, true, never>;
}
