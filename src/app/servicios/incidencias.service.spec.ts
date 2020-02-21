import { TestBed } from '@angular/core/testing';

import { IncidenciasService } from './incidencias.service';

describe('IncidenciasService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IncidenciasService = TestBed.get(IncidenciasService);
    expect(service).toBeTruthy();
  });
});
