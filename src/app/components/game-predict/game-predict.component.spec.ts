import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GamePredictComponent } from './game-predict.component';

describe('GamePredictComponent', () => {
  let component: GamePredictComponent;
  let fixture: ComponentFixture<GamePredictComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GamePredictComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GamePredictComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
