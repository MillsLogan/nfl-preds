import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitPredictionsModalComponent } from './submit-predictions-modal.component';

describe('SubmitPredictionsModalComponent', () => {
  let component: SubmitPredictionsModalComponent;
  let fixture: ComponentFixture<SubmitPredictionsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubmitPredictionsModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubmitPredictionsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
