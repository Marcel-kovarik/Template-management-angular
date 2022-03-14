import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewBuilderComponent } from './new-builder.component';

describe('NewBuilderComponent', () => {
  let component: NewBuilderComponent;
  let fixture: ComponentFixture<NewBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewBuilderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
