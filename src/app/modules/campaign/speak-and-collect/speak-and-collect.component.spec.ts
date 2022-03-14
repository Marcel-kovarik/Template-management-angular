import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeakAndCollectComponent } from './speak-and-collect.component';

describe('SpeakAndCollectComponent', () => {
  let component: SpeakAndCollectComponent;
  let fixture: ComponentFixture<SpeakAndCollectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpeakAndCollectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpeakAndCollectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
