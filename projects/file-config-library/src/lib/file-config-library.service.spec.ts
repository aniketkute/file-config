import { TestBed } from '@angular/core/testing';

import { DashboardUiService } from './file-config-library.service';

describe('DashboardUiService', () => {
  let service: DashboardUiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DashboardUiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
