import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { FileConfigLibraryModule } from '../../projects/file-config-library/src/public-api';
import { routes } from './app.routes';

@NgModule({ declarations: [AppComponent],
    bootstrap: [AppComponent], imports: [BrowserModule, // ✅ REQUIRED
        CommonModule,
        RouterOutlet,
        FileConfigLibraryModule,
        RouterModule.forRoot(routes)], providers: [provideHttpClient(withInterceptorsFromDi())] })
export class AppModule {}