import { TestBed } from '@angular/core/testing';

import { PropertyManagemnetService } from './property-managemnet-service';

describe('PropertyManagemnetService', () => {
  let service: PropertyManagemnetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PropertyManagemnetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
