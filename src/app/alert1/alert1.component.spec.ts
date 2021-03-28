import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { Alert1Component } from './alert1.component';

describe('Alert1Component', () => {
  let component: Alert1Component;
  let fixture: ComponentFixture<Alert1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Alert1Component ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(Alert1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
