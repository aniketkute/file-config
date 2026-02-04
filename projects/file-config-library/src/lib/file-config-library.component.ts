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

    if (this.selectedProcessName) {
      const data =
        this.styleDetailsForDownload.filePaths[this.selectedProcessName];
      console.log(data);
      this.prepareTableData(data);
    }
  }

  prepareTableData(data: any) {
    this.tableData = Object.entries(data).map(([version, files]: any) => ({
      version,
      files: Object.entries(files).map(([fileName, details]: any) => ({
        fileName,
        createdDate: details.createdDate,
        url: details.url,
      })),
    }));
    console.log(this.tableData);
  }

  enterPressed() {
    const payload = {
      packetBarCode: this.styleSketchNumber,
      rootFolderName: 'uploads',
      isAllVersionNeeded: 1,
    };

    this.masterService
      .getDetailsWithProcess(payload, this.BASE_URL)
      .subscribe((res: any) => {
        this.styleDetailsForDownload = res;
        if (!!res?.filePaths) {
          const objectKeys = Object.keys(res?.filePaths);
          this.menus = objectKeys.map((item: any) => {
            return { processName: item, isSelected: false };
          });
        }
      });
  }

  downloadFile(file: any) {
    const encodedUrl = encodeURIComponent(file.url);
    const fullUrl = `${this.BASE_URL}/${encodedUrl}`;
    window.open(fullUrl, '_blank');
  }
}
