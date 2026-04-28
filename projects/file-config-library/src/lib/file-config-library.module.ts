import { NgModule } from "@angular/core";
import { DashboardUiComponent } from "./file-config-library.component";
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from "@angular/material/dialog";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from "@angular/material/icon";


@NgModule({
    declarations: [DashboardUiComponent],
    imports: [FormsModule, MatProgressBarModule, MatProgressSpinnerModule, CommonModule, MatDialogModule, BrowserAnimationsModule, MatIconModule],
    exports: [DashboardUiComponent, MatDialogModule],
})
export class FileConfigLibraryModule {}