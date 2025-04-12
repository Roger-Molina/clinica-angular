import { TestBed } from '@angular/core/testing';

import { ValidacionFormulariosService } from './validacion-formularios.service';

describe('ValidacionFormulariosService', () => {
  let service: ValidacionFormulariosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValidacionFormulariosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
