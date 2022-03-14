import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TriggerActionComponent} from './trigger-action.component';

describe('TriggerActionComponent', () => {
  let component: TriggerActionComponent;
  let fixture: ComponentFixture<TriggerActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TriggerActionComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TriggerActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
