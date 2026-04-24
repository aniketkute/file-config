import { NgModule } from "@angular/core";
import { DashboardUiComponent } from "./file-config-library.component";
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@NgModule({
    declarations: [DashboardUiComponent],
    imports: [FormsModule, MatProgressBarModule, MatProgressSpinnerModule, CommonModule],
    exports: [DashboardUiComponent],
})
export class FileConfigLibraryModule {}