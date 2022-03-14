import { ComponentFixture, TestBed } from '@angular/core/testing';

import { F300x250Component } from './f300x250.component';

describe('F300x250Component', () => {
  let component: F300x250Component;
  let fixture: ComponentFixture<F300x250Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ F300x250Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(F300x250Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
