import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { FileConfigLibraryModule } from '../../projects/file-config-library/src/public-api';
import { routes } from './app.routes';

@NgModule({
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FileConfigLibraryModule, // wraps the standalone component for NgModule compat
    RouterModule.forRoot(routes),
  ],
  providers: [provideHttpClient(withInterceptorsFromDi())],
})
export class AppModule {}