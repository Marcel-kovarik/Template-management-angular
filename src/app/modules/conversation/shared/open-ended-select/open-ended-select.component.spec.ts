import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenEndedSelectComponent } from './open-ended-select.component';

describe('OpenEndedSelectComponent', () => {
  let component: OpenEndedSelectComponent;
  let fixture: ComponentFixture<OpenEndedSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpenEndedSelectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenEndedSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
