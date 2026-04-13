import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudGral } from './crud-gral';

describe('CrudGral', () => {
  let component: CrudGral;
  let fixture: ComponentFixture<CrudGral>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrudGral]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrudGral);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
