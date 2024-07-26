import { TestBed } from '@angular/core/testing';

import { PredictionTrackerService } from './prediction-tracker.service';

describe('PredictionTrackerService', () => {
  let service: PredictionTrackerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PredictionTrackerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
