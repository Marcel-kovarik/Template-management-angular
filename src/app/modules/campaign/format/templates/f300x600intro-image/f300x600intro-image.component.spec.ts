import { ComponentFixture, TestBed } from '@angular/core/testing';

import { F300x600introImageComponent } from './f300x600intro-image.component';

describe('F300x600introImageComponent', () => {
  let component: F300x600introImageComponent;
  let fixture: ComponentFixture<F300x600introImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ F300x600introImageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(F300x600introImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
