import {
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  NgZone,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { MasterService } from './services/master.service';
import { finalize } from 'rxjs/operators';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

@Component({
  selector: 'lib-file-config-library',
  standalone: false,
  providers: [MasterService],
  templateUrl: `./file-config-library.component.html`,
  styleUrls: [`./file-config-library.component.scss`],
})
export class DashboardUiComponent implements OnInit {
  private masterService = inject(MasterService);
  private cd: ChangeDetectorRef = inject(ChangeDetectorRef);
  private ngZone: NgZone = inject(NgZone);
  private readonly dialogRef = inject(MatDialog);

  ngOnInit() {}

  @Input() BASE_URL: string = 'https://dev-api.file-service.mobioffice.io';
  @Input() PD_BASE_URL: string = 'https://dev-api.jewelnext.mobioffice.io';
  @Input() loaderType: string = 'bar';
  @ViewChild('imagePreview') imagePreviewTemplate!: TemplateRef<any>;
  menus: any = [];
  styleSketchNumber: string | null = null;
  styleSketchNumberVersion: string | null = null;
  selectedProcessName: string | null = null;
  styleDetailsForDownload: any;
  selectedTab: 'latest' | 'history' | 'showAll' = 'latest';
  tableData: any[] = [];
  latestTableData: any[] = [];
  historyTableData: any[] = [];
  showAllTableData: any[] = [];
  pdMenus: any = [];
  pdDataForDownload: any;
  loader: boolean = false;
  bagNo: string | null = null;
  selectedPreviewImage: string | null = null;
  refFromEmrGatiDiaVendor: boolean = false;
  styleVersionArray: any = [];
  afterResultConvertedIntoDisplayFormat: any;
  versionWiseUrl: any = [];

  itemSelected(item: any, isPDData: boolean = false) {
    this.historyTableData = [];
    this.latestTableData = [];
    this.selectedProcessName = item.processName;
    item.isSelected = true;

    if (!isPDData) {
      this.menus.forEach((item: any) => {
        if (item.processName !== this.selectedProcessName)
          item.isSelected = false;
      });
      this.pdMenus.forEach((item: any) => (item.isSelected = false));

      if (this.selectedProcessName) {
        const data =
          this.styleDetailsForDownload.filePaths[this.selectedProcessName];
        this.prepareTableData(data);
      }
    } else {
      this.pdMenus.forEach((item: any) => {
        if (item.processName !== this.selectedProcessName)
          item.isSelected = false;
      });
      this.menus.forEach((item: any) => (item.isSelected = false));
      this.preparePDTableData();
    }
  }

  private prepareTableData(data: any) {
    const allFiles: any[] = [];

    // Flatten all versions into single array
    Object.entries(data).forEach(([fileType, files]: any) => {
      Object.entries(files).forEach(([version, details]: any) => {
        Object.entries(details).forEach(([fileName, fileDetails]: any) => {
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
      const latest = Math.max(
        ...allFiles.map((item) => parseInt(item.version.replace('v', ''), 10)),
      );
      const latestVersion = 'v' + latest;

      this.latestTableData = [
        {
          version: latestVersion,
          files: [],
        },
      ];

      allFiles.forEach((file: any) => {
        if (file.version === latestVersion) {
          this.latestTableData[0].files.push(file);
        } else {
          const index = this.latestTableData.findIndex(
            (item) => item.version === file.version,
          );
          if (index !== -1) {
            this.latestTableData[index].files.push(file);
          } else {
            this.latestTableData.push({
              version: file.version,
              files: [file],
            });
          }
        }
      });
    }

    this.showAllTableData = [...this.latestTableData, ...this.historyTableData];
    console.log('Latest:', this.latestTableData);
    console.log('History:', this.historyTableData);
    console.log('Show All:', this.showAllTableData);
  }

  onTabChange(tab: 'latest' | 'history' | 'showAll') {
    this.selectedTab = tab;
    this.updateTableData();
  }

  updateTableData() {
    switch (this.selectedTab) {
      case 'latest':
        this.tableData = this.latestTableData;
        break;

      case 'history':
        this.tableData = this.historyTableData;
        break;

      case 'showAll':
        this.tableData = this.showAllTableData;
        break;
    }
  }

  private preparePDTableData() {
    switch (this.selectedProcessName) {
      case 'sketch':
        const url = this.pdDataForDownload['sketchImage'];
        const fileArray = url?.split('/') || [];
        const fileType = fileArray?.[4] || '';
        const fileName = fileArray?.[fileArray?.length - 1] || '';
        this.latestTableData.push({
          version: '',
          files: [{ fileName, fileType, url, createdDate: '', version: '' }],
        });
        break;
      case 'Brief Images':
        const briefUrls = this.pdDataForDownload['briefImage'];
        briefUrls.forEach((briefUrl: string) => {
          const briefFileArray = briefUrl?.split('/') || [];
          const briefFileType = briefFileArray?.[4] || '';
          const briefFileName =
            briefFileArray?.[briefFileArray?.length - 1] || '';
          this.latestTableData.push({
            version: '',
            files: [
              {
                fileName: briefFileName,
                fileType: briefFileType,
                url: briefUrl,
                createdDate: '',
                version: '',
              },
            ],
          });
        });
        break;
      case 'Sub Brief Images':
        const subBriefUrls = this.pdDataForDownload['subBriefImage'];
        subBriefUrls.forEach((subBriefUrl: string) => {
          const subBriefFileArray = subBriefUrl?.split('/') || [];
          const subBriefFileType = subBriefFileArray?.[4] || '';
          const subBriefFileName =
            subBriefFileArray?.[subBriefFileArray?.length - 1] || '';
          this.latestTableData.push({
            version: '',
            files: [
              {
                fileName: subBriefFileName,
                fileType: subBriefFileType,
                url: subBriefUrl,
                createdDate: '',
                version: '',
              },
            ],
          });
        });
        break;
      default:
        break;
    }
  }

  enterPressed(sketchNumber: string) {
    if (this.loader) return;

    this.loader = true;

    this.masterService
      .getFullDetails(sketchNumber!, this.BASE_URL, this.PD_BASE_URL)
      .pipe(
        finalize(() => {
          // 🔥 Ensure Angular detects change (Angular 14 safe)
          this.ngZone.run(() => {
            this.loader = false;
            this.cd.detectChanges();
          });
        }),
      )
      .subscribe((res) => {
        console.log(res);
        this.styleDetailsForDownload = res.styleDetails;
        this.menus = res.menus;
        this.pdDataForDownload = res.pdData;
        this.pdMenus = res.pdMenus;

        this.selectedProcessName = null;
        this.latestTableData = [];
        this.historyTableData = [];
      });
  }

  getStyleVersionDetails() {
    this.masterService
      .getVersionDetailsFromPd(
        this.styleSketchNumberVersion,
        this.PD_BASE_URL,
        this.refFromEmrGatiDiaVendor,
      )
      .pipe(
        finalize(() => {
          // 🔥 Ensure Angular detects change (Angular 14 safe)
          this.ngZone.run(() => {
            this.loader = false;
            this.cd.detectChanges();
          });
        }),
      )
      .subscribe((res: any) => {
        console.log(res);
        if (res.data) {
          const styleVersion = res.data.map((item: any) => {
            return item.name;
          });

          this.getStyleVersionDetailsFromVersion(styleVersion);
        }
      });
    // this.getStyleVersionDetailsFromVersion(null);
  }

  private getStyleVersionDetailsFromVersion(data: any) {
    console.log(data);
    const DATA = {
      packetBarcodes: data,
      rootFolderName: 'uploads',
    };
    // packetBarcodes: ['ST-RNG-33213', 'ST-RNG-33313'],
    this.masterService
      .getDetailsFromVersion(DATA, this.BASE_URL)
      .subscribe((res: any) => {
        console.log(res);

        const result = res.reduce((acc: any, item: any) => {
          const barcode = item.barcode;

          Object.entries(item.folders || {}).forEach(
            ([folderName, files]: any) => {
              if (!acc[folderName]) {
                acc[folderName] = {};
              }

              if (!acc[folderName][barcode]) {
                acc[folderName][barcode] = [];
              }

              acc[folderName][barcode].push(...files);
            },
          );

          return acc;
        }, {});

        this.afterResultConvertedIntoDisplayFormat = result;
        this.pdMenus = Object.keys(result).map((key) => ({
          processName: key,
          isSelected: false,
        }));
      });
  }

  onFolderSelect(folderName: any) {
    this.selectedProcessName = folderName.processName;
    this.pdMenus.map((item: any) => (item.isSelected = false));
    folderName.isSelected = true;

    const folderData =
      this.afterResultConvertedIntoDisplayFormat[this.selectedProcessName] ||
      {};

    this.styleVersionArray = Object.keys(folderData).map((item: any) => {
      return {
        processName: item,
        isSelected: false,
        documentDetails: folderData[item],
      };
    });
  }

  getBagWiseDetails() {
    this.masterService
      .getSyleVersionFromBag(this.PD_BASE_URL, this.bagNo)
      .subscribe((res: any) => {
        console.log(res);

        if (res.data) {
          this.enterPressed(res.data);
        }
      });
  }

  styleVersionSelected(folderName: any) {
    const selectedProcessName = folderName.processName;
    this.styleVersionArray.map((item: any) => (item.isSelected = false));
    folderName.isSelected = true;

    console.log(this.styleVersionArray);
    console.log(this.afterResultConvertedIntoDisplayFormat);
    // const folderData = this.styleVersionArray[this.selectedProcessName] || {};

    const folderData = this.styleVersionArray.find(
      (item: any) => item.processName === selectedProcessName,
    );
    console.log(folderData?.documentDetails);
    this.versionWiseUrl = folderData?.documentDetails.map(
      (url: string, index: number) => {
        const name = url.split('/').pop(); // last part

        return {
          index: index + 1,
          name,
          url,
        };
      },
    );
  }

  removeAllFilledDetails() {
    this.tableData = [];
    this.versionWiseUrl = [];
    this.afterResultConvertedIntoDisplayFormat = [];
    this.styleVersionArray = [];
    this.pdMenus = [];
    this.menus = [];
    this.latestTableData = [];
    this.historyTableData = [];
    this.showAllTableData = [];
  }

  mapFile(filePath: string) {
    const fileName = filePath.split('/').pop();

    const extension = fileName.split('.').pop()?.toLowerCase();

    return {
      fileName,
      filePath,
      fileType: extension,
      createdDate: '-', // you don’t have it
    };
  }

  downloadFile(file: any) {
    const encodedUrl = encodeURIComponent(file.url);
    const fullUrl = `${this.BASE_URL}/${encodedUrl}`;
    window.open(fullUrl, '_blank');
  }

  checkImagePreview(file: any): boolean {
    if (
      ['Sub Brief Images', 'Brief Images', 'sketch'].includes(
        this.selectedProcessName,
      )
    )
      return true;

    if (['jpeg', 'png', 'gif', 'jpg'].includes(file.fileType)) return true;

    return false;
  }

  constructImageUrl(file: any): string {
    if (!file?.url) return '';

    const cleanedPath = file.url.startsWith('/')
      ? file.url.substring(1)
      : file.url;

    return `${this.BASE_URL}/${cleanedPath}`;
  }

  openFullScreenPreview(file: any) {
    this.selectedPreviewImage = this.constructImageUrl(file);

    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '100vw';
    dialogConfig.maxWidth = '100vw';
    dialogConfig.height = '100vh';
    dialogConfig.disableClose = true;
    dialogConfig.backdropClass = 'custom-dialog-backdrop';
    this.dialogRef.open(this.imagePreviewTemplate, dialogConfig);
  }

  closePopup() {
    this.dialogRef.closeAll();
  }
}
