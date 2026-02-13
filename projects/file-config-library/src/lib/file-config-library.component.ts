import { Component, inject, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MasterService } from './services/master.service';
@Component({
  selector: 'lib-file-config-library',
  standalone: true,
  imports: [FormsModule],
  providers: [MasterService],
  templateUrl: `./file-config-library.component.html`,
  styleUrl: `./file-config-library.component.scss`,
})
export class DashboardUiComponent implements OnInit {
  private masterService = inject(MasterService);

  ngOnInit() {
    console.log('we are in dashboard library component');
    this.onInit();
  }

  @Input() BASE_URL: string = 'https://dev-api.file-service.mobioffice.io';
  menus: any = [];
  styleSketchNumber: string | null = null;
  selectedProcessName: string | null = null;
  tableData: any[] = [];
  styleDetailsForDownload: any;
  selectedTab: 'latest' | 'history' = 'latest';
  latestTableData: any[] = [];
  historyTableData: any[] = [];

  onInit() {
    this.getAllMaster();
  }

  private getAllMaster() {
    // this.masterService.getProcessList().subscribe((res: any) => {
    //   console.log(res);
    //   this.menus = res.data.map((item: any) => {
    //     return { ...item, isSelected: false };
    //   });
    // });
  }

  itemSelected(item: any) {
    console.log(item);
    this.selectedProcessName = item.processName;
    item.isSelected = true;
    this.menus.map((item: any) => {
      if (item.processName !== this.selectedProcessName)
        item.isSelected = false;
    });

    console.log(this.styleDetailsForDownload);
    if (this.selectedProcessName) {
      const data =
        this.styleDetailsForDownload.filePaths[this.selectedProcessName];
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

  prepareTableData(data: any) {
    const allFiles: any[] = [];

    // Flatten all versions into single array
    Object.entries(data).forEach(([version, files]: any) => {
      Object.entries(files).forEach(([fileName, details]: any) => {
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
      const d1: any = this.parseDate(a.createdDate);
      const d2: any = this.parseDate(b.createdDate);
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

      const groupedHistory: any = {};

      remaining.forEach((file) => {
        if (!groupedHistory[file.version]) {
          groupedHistory[file.version] = [];
        }
        groupedHistory[file.version].push(file);
      });

      this.historyTableData = Object.entries(groupedHistory).map(
        ([version, files]) => ({
          version,
          files,
        }),
      );
    }

    console.log('Latest:', this.latestTableData);
    console.log('History:', this.historyTableData);
  }

  parseDate(dateStr: string): Date {
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
      next: (res: any) => {
        this.styleDetailsForDownload = res;

        if (res?.filePaths) {
          const objectKeys = Object.keys(res.filePaths);
          this.menus = objectKeys.map((item) => ({
            processName: item,
            isSelected: false,
          }));
        } else {
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

  downloadFile(file: any) {
    const encodedUrl = encodeURIComponent(file.url);
    const fullUrl = `${this.BASE_URL}/${encodedUrl}`;
    window.open(fullUrl, '_blank');
  }
}
