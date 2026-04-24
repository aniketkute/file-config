import { NgModule } from "@angular/core";
import { DashboardUiComponent } from "./file-config-library.component";


@NgModule({
    imports: [DashboardUiComponent],
    exports: [DashboardUiComponent],
})
export class FileConfigLibraryModule {}