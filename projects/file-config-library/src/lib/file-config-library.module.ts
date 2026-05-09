import { NgModule } from '@angular/core';
import { DashboardUiComponent } from './file-config-library.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';

// NOTE: BrowserAnimationsModule is intentionally NOT imported here.
// Libraries must never import BrowserAnimationsModule or BrowserModule —
// those are app-level singletons. The consumer app is responsible for
// providing animations (BrowserAnimationsModule or provideAnimations()).

@NgModule({
  declarations: [DashboardUiComponent],
  imports: [
    FormsModule,
    CommonModule,
    MatDialogModule,
    MatIconModule,
  ],
  exports: [DashboardUiComponent, MatDialogModule],
})
export class FileConfigLibraryModule {}
