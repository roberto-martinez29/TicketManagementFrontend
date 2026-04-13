import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudTurnos } from './crud-turnos';

describe('CrudTurnos', () => {
  let component: CrudTurnos;
  let fixture: ComponentFixture<CrudTurnos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrudTurnos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrudTurnos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
