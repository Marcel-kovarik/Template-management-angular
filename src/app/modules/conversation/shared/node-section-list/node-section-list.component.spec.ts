import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeSectionListComponent } from './node-section-list.component';

describe('NodeSectionListComponent', () => {
  let component: NodeSectionListComponent;
  let fixture: ComponentFixture<NodeSectionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NodeSectionListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NodeSectionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
