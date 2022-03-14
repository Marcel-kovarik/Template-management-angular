import { ComponentFixture, TestBed } from '@angular/core/testing';

import { F1800x1000Component } from './f1800x1000.component';

describe('F1800x1000Component', () => {
  let component: F1800x1000Component;
  let fixture: ComponentFixture<F1800x1000Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ F1800x1000Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(F1800x1000Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
