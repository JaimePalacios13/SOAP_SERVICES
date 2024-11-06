import { TestBed } from '@angular/core/testing';

import { BuscarPersonaService } from './buscar-persona.service';

describe('BuscarPersonaService', () => {
  let service: BuscarPersonaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BuscarPersonaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
