import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklyGamesDisplayComponent } from './weekly-games-display.component';

describe('WeeklyGamesDisplayComponent', () => {
  let component: WeeklyGamesDisplayComponent;
  let fixture: ComponentFixture<WeeklyGamesDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeeklyGamesDisplayComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WeeklyGamesDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
