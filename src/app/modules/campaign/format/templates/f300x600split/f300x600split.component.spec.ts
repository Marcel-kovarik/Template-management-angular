import { ComponentFixture, TestBed } from '@angular/core/testing';

import { F300x600splitComponent } from './f300x600split.component';

describe('F300x600splitComponent', () => {
  let component: F300x600splitComponent;
  let fixture: ComponentFixture<F300x600splitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ F300x600splitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(F300x600splitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
