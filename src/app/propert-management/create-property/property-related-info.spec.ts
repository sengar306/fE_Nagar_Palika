import { TestBed } from '@angular/core/testing';

import { PropertyRelatedInfo } from './property-related-info';

describe('PropertyRelatedInfo', () => {
  let service: PropertyRelatedInfo;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PropertyRelatedInfo);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
