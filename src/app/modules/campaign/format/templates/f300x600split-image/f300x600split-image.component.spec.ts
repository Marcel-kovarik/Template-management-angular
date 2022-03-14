import { ComponentFixture, TestBed } from '@angular/core/testing';

import { F300x600splitImageComponent } from './f300x600split-image.component';

describe('F300x600splitImageComponent', () => {
  let component: F300x600splitImageComponent;
  let fixture: ComponentFixture<F300x600splitImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ F300x600splitImageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(F300x600splitImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
