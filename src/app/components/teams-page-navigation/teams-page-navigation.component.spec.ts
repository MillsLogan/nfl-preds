import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamsPageNavigationComponent } from './teams-page-navigation.component';

describe('TeamsPageNavigationComponent', () => {
  let component: TeamsPageNavigationComponent;
  let fixture: ComponentFixture<TeamsPageNavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamsPageNavigationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TeamsPageNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
