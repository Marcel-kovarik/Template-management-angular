import { ComponentFixture, TestBed } from '@angular/core/testing';

import { F300x600splitVideoComponent } from './f300x600split-video.component';

describe('F300x600splitVideoComponent', () => {
  let component: F300x600splitVideoComponent;
  let fixture: ComponentFixture<F300x600splitVideoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ F300x600splitVideoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(F300x600splitVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
