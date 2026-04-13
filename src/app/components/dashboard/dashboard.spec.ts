import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { provideRouter } from '@angular/router';

import { Dashboard } from './dashboard';
import { TicketService } from '../../services/ticket-service';
import { CatalogosService } from '../../services/catalogos-service';
import { AdminService } from '../../services/admin-service';

const ticketServiceMock = {
  getTickets: jasmine.createSpy('getTickets').and.returnValue(of([])),
};

const catalogosServiceMock = {
  getMunicipios: jasmine.createSpy('getMunicipios').and.returnValue(of([])),
};

const adminServiceMock = {
  isSessionActive: jasmine.createSpy('isSessionActive').and.returnValue(true),
  logout: jasmine.createSpy('logout'),
};

describe('Dashboard', () => {
  let component: Dashboard;
  let fixture: ComponentFixture<Dashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dashboard],
      providers: [
        provideRouter([]),
        { provide: TicketService, useValue: ticketServiceMock },
        { provide: CatalogosService, useValue: catalogosServiceMock },
        { provide: AdminService, useValue: adminServiceMock },
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(Dashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
