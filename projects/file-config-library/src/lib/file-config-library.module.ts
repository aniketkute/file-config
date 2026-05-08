import { NgModule } from '@angular/core';
import { DashboardUiComponent } from './file-config-library.component';
// import { MatLegacyProgressBarModule as MatProgressBarModule } from '@angular/material/legacy-progress-bar';
//  import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [DashboardUiComponent],
  imports: [
    FormsModule,
    // MatProgressBarModule,
    // MatProgressSpinnerModule,
    CommonModule,
    MatDialogModule,
    BrowserAnimationsModule,
    MatIconModule,
  ],
  exports: [DashboardUiComponent, MatDialogModule],
})
export class FileConfigLibraryModule {}
