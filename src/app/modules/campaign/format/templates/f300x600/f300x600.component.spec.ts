import { ComponentFixture, TestBed } from '@angular/core/testing';

import { F300x600Component } from './f300x600.component';

describe('F300x600Component', () => {
  let component: F300x600Component;
  let fixture: ComponentFixture<F300x600Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ F300x600Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(F300x600Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
