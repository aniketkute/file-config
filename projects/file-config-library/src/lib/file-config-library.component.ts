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
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import {
  MatDialogModule,
  MatDialog,
  MatDialogConfig,
} from '@angular/material/dialog';
import { MasterService } from './services/master.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'lib-file-config-library',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatDialogModule],
  providers: [MasterService],
  templateUrl: `./file-config-library.component.html`,
  styleUrls: [`./file-config-library.component.scss`],
})
export class DashboardUiComponent implements OnInit {
  private masterService = inject(MasterService);
  private cd: ChangeDetectorRef = inject(ChangeDetectorRef);
  private ngZone: NgZone = inject(NgZone);
  private readonly dialogRef = inject(MatDialog);

  ngOnInit() {
    this.onInit();
  }

  @Input() BASE_URL: string = 'https://dev-api.file-service.mobioffice.io';
  @Input() PD_BASE_URL: string = 'https://dev-api.jewelnext.mobioffice.io';
  @Input() loaderType: string = 'bar';
  @Input() USER_ROLES_ARRAY: string[] = ['Grainding', 'SKETCH'];
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
  selectedVersionFilter: string = 'all';
  versionDropdownOpen: boolean = false;
  versionSearchQuery: string = '';
  rolesAndFileConfigMaster: any = [];

  private onInit() {
    this.masterService
      .getFileConfigRoleMapping(this.PD_BASE_URL)
      .subscribe((res: any) => {
        this.rolesAndFileConfigMaster = res.data;
      });
  }

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
    this.onTabChange('latest');
  }

  onTabChange(tab: 'latest' | 'history' | 'showAll') {
    this.selectedTab = tab;
    this.selectedVersionFilter = 'all';
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
        this.styleDetailsForDownload = res.styleDetails;
        this.pdDataForDownload = res.pdData;

        this.validatePdMenus(res.pdMenus, 'pdMenu');
        this.validatePdMenus(res.menus, 'menus');

        this.selectedProcessName = null;
        this.latestTableData = [];
        this.historyTableData = [];
      });
  }

  private validatePdMenus(menus: any, tableName: string = 'pdMenu') {
    // Step 1: Convert user roles to lowercase for case-insensitive matching
    const userRolesLower = this.USER_ROLES_ARRAY.map((role) =>
      role.toLowerCase(),
    );

    // Step 2: Find matching folderShortCode values and make them unique
    const allowedProcesses = [
      ...new Set(
        this.rolesAndFileConfigMaster
          .filter((item) => userRolesLower.includes(item.role.toLowerCase()))
          .map((item) => item.folderShortCode.toLowerCase()),
      ),
    ];

    // Step 3: Filter menus based on allowed process names
    const filteredMenus = menus.filter((menu) =>
      allowedProcesses.includes(menu.processName.toLowerCase()),
    );

    if (tableName === 'pdMenu') this.pdMenus = filteredMenus;
    else if (tableName === 'menus') this.menus = filteredMenus;
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
    const DATA = {
      packetBarcodes: data,
      rootFolderName: 'uploads',
    };
    // packetBarcodes: ['ST-RNG-33213', 'ST-RNG-33313'],
    this.masterService
      .getDetailsFromVersion(DATA, this.BASE_URL)
      .subscribe((res: any) => {
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
        const pdMenus = Object.keys(result).map((key) => ({
          processName: key,
          isSelected: false,
        }));

        this.validatePdMenus(pdMenus);
      });
  }

  onFolderSelect(folderName: any) {
    this.selectedProcessName = folderName.processName;
    this.pdMenus.map((item: any) => (item.isSelected = false));
    folderName.isSelected = true;
    this.versionSearchQuery = ''; // reset search on folder change

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
        if (res.data) {
          this.enterPressed(res.data);
        }
      });
  }

  styleVersionSelected(folderName: any) {
    const selectedProcessName = folderName.processName;
    this.styleVersionArray.map((item: any) => (item.isSelected = false));
    folderName.isSelected = true;

    const folderData = this.styleVersionArray.find(
      (item: any) => item.processName === selectedProcessName,
    );
    // this.versionWiseUrl = folderData?.documentDetails.map(
    //   (url: string, index: number) => {
    //     const name = url.split('/').pop(); // last part

    //     return {
    //       index: index + 1,
    //       name,
    //       url,
    //     };
    //   },
    // );

    // Sort by createdDate in descending order (latest first)
    const sortedFiles = [...folderData?.documentDetails].sort(
      (a, b) =>
        new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime(),
    );

    // Common mapper
    const mapFiles = (files: any[]) =>
      files.map((file, index) => {
        const name = file.url.split('/').pop();
        return {
          index: index + 1,
          name,
          fileName: name,
          fileType: name?.split('.').pop()?.toLowerCase() || '',
          version: `V${file.version}`,
          url: file.url,
          preview: file.url,
        };
      });

    // 1. Latest section (only most recently uploaded file)
    this.latestTableData = sortedFiles.length ? mapFiles([sortedFiles[0]]) : [];

    // 2. History section (all files except latest)
    this.historyTableData =
      sortedFiles.length > 1 ? mapFiles(sortedFiles.slice(1)) : [];

    // 3. All section (all files)
    this.showAllTableData = mapFiles(sortedFiles);

    console.log(this.latestTableData);
    console.log(this.historyTableData);
    console.log(this.showAllTableData);
    this.onTabChange('latest');
  }

  /** Unique version list derived from current tableData for the filter dropdown */
  get availableVersions(): string[] {
    const versions = this.tableData.map((g) => g.version).filter((v) => !!v);
    return [...new Set(versions)];
  }

  /** tableData filtered by the selected version (or all) */
  get filteredTableData(): any[] {
    if (this.selectedVersionFilter === 'all') return this.tableData;
    return this.tableData.filter(
      (g) => g.version === this.selectedVersionFilter,
    );
  }

  /** styleVersionArray filtered by the search query */
  get filteredStyleVersionArray(): any[] {
    const q = this.versionSearchQuery.trim().toLowerCase();
    if (!q) return this.styleVersionArray;
    return this.styleVersionArray.filter((item: any) =>
      item.processName?.toLowerCase().includes(q),
    );
  }

  setVersionFilter(version: string) {
    this.selectedVersionFilter = version;
  }

  /** Highlight matched text in search results */
  highlightMatch(text: string, query: string): string {
    if (!query || !text) return text;
    const q = query.trim();
    if (!q) return text;
    const regex = new RegExp(`(${q})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
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
    this.selectedVersionFilter = 'all';
    this.versionSearchQuery = '';
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

  private getFileExtension(file: any): string {
    if (file?.fileType) return String(file.fileType).toLowerCase();
    const name = file?.fileName || file?.name || file?.url || '';
    return String(name).split('.').pop()?.toLowerCase() || '';
  }

  checkImagePreview(file: any): boolean {
    if (
      ['Sub Brief Images', 'Brief Images', 'sketch'].includes(
        this.selectedProcessName,
      )
    )
      return true;

    return ['jpeg', 'png', 'gif', 'jpg', 'webp', 'bmp', 'svg'].includes(
      this.getFileExtension(file),
    );
  }

  isDocPreview(file: any): boolean {
    return ['doc', 'docx'].includes(this.getFileExtension(file));
  }

  isTxtPreview(file: any): boolean {
    return this.getFileExtension(file) === 'txt';
  }

  onImageLoadError(file: any) {
    file._imageLoadFailed = true;
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
