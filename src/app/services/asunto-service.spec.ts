import { TestBed } from '@angular/core/testing';

import { AsuntoService } from './asunto-service';

describe('AsuntoService', () => {
  let service: AsuntoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AsuntoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
