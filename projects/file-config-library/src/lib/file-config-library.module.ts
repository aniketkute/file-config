import { NgModule } from '@angular/core';
import { DashboardUiComponent } from './file-config-library.component';

// This module exists purely for backwards compatibility with NgModule-based apps.
// The component is standalone — it carries all its own dependencies.
// NgModule apps: import FileConfigLibraryModule
// Standalone apps: import DashboardUiComponent directly
@NgModule({
  imports: [DashboardUiComponent],
  exports: [DashboardUiComponent],
})
export class FileConfigLibraryModule {}
