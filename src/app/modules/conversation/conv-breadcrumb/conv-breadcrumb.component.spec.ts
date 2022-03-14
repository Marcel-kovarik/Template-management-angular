import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvBreadcrumbComponent } from './conv-breadcrumb.component';

describe('ConvBreadcrumbComponent', () => {
  let component: ConvBreadcrumbComponent;
  let fixture: ComponentFixture<ConvBreadcrumbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConvBreadcrumbComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConvBreadcrumbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
