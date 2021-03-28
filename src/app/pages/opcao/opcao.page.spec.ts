import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OpcaoPage } from './opcao.page';

describe('OpcaoPage', () => {
  let component: OpcaoPage;
  let fixture: ComponentFixture<OpcaoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpcaoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OpcaoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
