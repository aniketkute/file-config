# file-config-library

An Angular library for browsing and downloading files by ID, style number, or bag number.

## Installation

```bash
npm install file-config-library
```

## Required peer dependencies

Your app must have these installed:

```bash
npm install @angular/material @angular/cdk @angular/animations
```

## Consumer app setup (REQUIRED)

The library does **not** import `BrowserAnimationsModule` — you must add it in your root `AppModule`. Skipping this will break Angular Material components (dialogs, icons) and cause routing issues.

### NgModule-based app

```ts
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { FileConfigLibraryModule } from 'file-config-library';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule, // ✅ required
    FileConfigLibraryModule,
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi()), // ✅ required for HTTP calls
  ],
})
export class AppModule {}
```

### Standalone app (bootstrapApplication)

```ts
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';

bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations(), // ✅ required
    provideHttpClient(),
  ],
});
```

## Usage

Add the component in your template:

```html
<lib-file-config-library
  [BASE_URL]="'https://your-file-api.example.com'"
  [PD_BASE_URL]="'https://your-pd-api.example.com'"
  [loaderType]="'bar'"
>
</lib-file-config-library>
```

### Inputs

| Input | Type | Default | Description |
|---|---|---|---|
| `BASE_URL` | `string` | `https://dev-api.file-service.mobioffice.io` | File service API base URL |
| `PD_BASE_URL` | `string` | `https://dev-api.jewelnext.mobioffice.io` | PD service API base URL |
| `loaderType` | `'bar' \| 'circle'` | `'bar'` | Loader style while fetching |

## Build

```bash
ng build file-config-library
```

## Publishing

```bash
cd dist/file-config-library
npm publish
```
