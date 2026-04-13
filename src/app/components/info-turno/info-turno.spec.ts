import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoTurno } from './info-turno';

describe('InfoTurno', () => {
  let component: InfoTurno;
  let fixture: ComponentFixture<InfoTurno>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoTurno]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfoTurno);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
