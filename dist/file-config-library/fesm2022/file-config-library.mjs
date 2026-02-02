import * as i0 from '@angular/core';
import { Component } from '@angular/core';

class HeaderComponent {
    constructor() {
        this.companyLogo = null;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: HeaderComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.12", type: HeaderComponent, isStandalone: true, selector: "app-header", ngImport: i0, template: "<div class=\"header-container\">\r\n  <div class=\"header-content\">\r\n    <div class=\"left__content w-100\">\r\n      <img height=\"50\" [src]=\"companyLogo\" alt=\"Logo\" class=\"cursor-pointer\" />\r\n\r\n      <!-- <div class=\"svg-image cursor-pointer\" [innerHTML]=\"(userInformation | async)?.ApplicationInfo?.ApplicationHeaderLogoUrl | sanitizer: 'html'\" (click)=\"onClickLogo()\"></div> -->\r\n    </div>\r\n  </div>\r\n</div>\r\n", styles: [".header-container{--background-color: rgb(24, 24, 27);--border-color: #d0d5dd80;height:60px;overflow:hidden;background-color:var(var(--background-color));border-bottom:1px solid var(--border-color)}.header-container .header-content{padding:5px 20px;display:flex;align-items:center;gap:6px;height:100%}.header-container .header-content .left__content{display:flex;align-items:center;justify-content:start}.header-container .header-content .left__content .svg-image{height:60px;min-width:120px;display:flex;align-items:center;justify-content:start}.header-container .header-content .left__content .text-logo{font-weight:bolder;line-height:24.2px;text-align:left}.header-container .header-content .right__content{display:flex;justify-content:end;align-items:center}.header-container .header-content .right__content .profile-container{gap:10px;width:150px}.header-container .header-content .right__content .profile-container img{border-radius:50%}.header-container .header-content .right__content .profile-container p{font-size:14px;font-weight:500;margin:0;width:100px;overflow:hidden;text-wrap:nowrap}.header-container .header-content .right__content .theme-icon-container{border-radius:50%;background-color:#000;color:#000;padding:5px 10px;display:flex;justify-content:center;align-items:center;outline:none;cursor:pointer;border:1px solid var(--border-color);box-shadow:0 4px 8px #0003}.header-container .header-content .right__content .animate{animation:fadeIn .5s ease-out backwards}@keyframes fadeIn{0%{opacity:0}to{opacity:1}}\n"] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: HeaderComponent, decorators: [{
            type: Component,
            args: [{ selector: 'app-header', standalone: true, imports: [], template: "<div class=\"header-container\">\r\n  <div class=\"header-content\">\r\n    <div class=\"left__content w-100\">\r\n      <img height=\"50\" [src]=\"companyLogo\" alt=\"Logo\" class=\"cursor-pointer\" />\r\n\r\n      <!-- <div class=\"svg-image cursor-pointer\" [innerHTML]=\"(userInformation | async)?.ApplicationInfo?.ApplicationHeaderLogoUrl | sanitizer: 'html'\" (click)=\"onClickLogo()\"></div> -->\r\n    </div>\r\n  </div>\r\n</div>\r\n", styles: [".header-container{--background-color: rgb(24, 24, 27);--border-color: #d0d5dd80;height:60px;overflow:hidden;background-color:var(var(--background-color));border-bottom:1px solid var(--border-color)}.header-container .header-content{padding:5px 20px;display:flex;align-items:center;gap:6px;height:100%}.header-container .header-content .left__content{display:flex;align-items:center;justify-content:start}.header-container .header-content .left__content .svg-image{height:60px;min-width:120px;display:flex;align-items:center;justify-content:start}.header-container .header-content .left__content .text-logo{font-weight:bolder;line-height:24.2px;text-align:left}.header-container .header-content .right__content{display:flex;justify-content:end;align-items:center}.header-container .header-content .right__content .profile-container{gap:10px;width:150px}.header-container .header-content .right__content .profile-container img{border-radius:50%}.header-container .header-content .right__content .profile-container p{font-size:14px;font-weight:500;margin:0;width:100px;overflow:hidden;text-wrap:nowrap}.header-container .header-content .right__content .theme-icon-container{border-radius:50%;background-color:#000;color:#000;padding:5px 10px;display:flex;justify-content:center;align-items:center;outline:none;cursor:pointer;border:1px solid var(--border-color);box-shadow:0 4px 8px #0003}.header-container .header-content .right__content .animate{animation:fadeIn .5s ease-out backwards}@keyframes fadeIn{0%{opacity:0}to{opacity:1}}\n"] }]
        }] });

/*
 * Public API Surface of file-config-library
 */
// export * from './lib/file-config-library.service';
// export * from './lib/file-config-library.component';

/**
 * Generated bundle index. Do not edit.
 */

export { HeaderComponent };
//# sourceMappingURL=file-config-library.mjs.map
