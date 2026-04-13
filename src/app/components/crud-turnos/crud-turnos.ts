import { Component, OnInit } from '@angular/core';
import { Ticket } from '../../interfaces/ticket';
import { TicketService } from '../../services/ticket-service';
import { CellValueChangedEvent, ColDef, GridApi, GridReadyEvent, themeQuartz, type Theme } from 'ag-grid-community';
import { AgGridModule } from 'ag-grid-angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AdminService } from '../../services/admin-service';
import { AdminNavbar } from '../admin-navbar/admin-navbar';

@Component({
  selector: 'app-crud-turnos',
  standalone: true,
  imports: [CommonModule, AgGridModule, AdminNavbar],
  templateUrl: './crud-turnos.html',
  styleUrl: './crud-turnos.css',
})
export class CrudTurnos implements OnInit {
  public allTickets: Ticket[] = [];
  public rowData: Ticket[] = [];
  public theme: Theme | 'legacy' | undefined = themeQuartz;
  public searchTerm = '';

  public columnDefs: ColDef[] = [
    { headerName: 'ID', field: 'idTicket', width: 90, editable: false },
    { headerName: 'Turno', field: 'numTurno', editable: true },
    { headerName: 'CURP', field: 'curp', editable: true },
    { headerName: 'Tramitante', field: 'tramitante', editable: true },
    { headerName: 'Nombre', field: 'nombre', editable: true },
    { headerName: 'Apellido Paterno', field: 'apPaterno', editable: true },
    { headerName: 'Apellido Materno', field: 'apMaterno', editable: true },
    { headerName: 'Teléfono', field: 'telefono', editable: true },
    { headerName: 'Celular', field: 'celular', editable: true },
    { headerName: 'Correo', field: 'correo', editable: true },
    { headerName: 'Municipio', field: 'idMunicipio', editable: true },
    { headerName: 'Nivel', field: 'idNivel', editable: true },
    { headerName: 'Asunto', field: 'idAsunto', editable: true },
    {
      headerName: 'Resuelto',
      field: 'resuelto',
      editable: true,
      cellEditor: 'agCheckboxCellEditor',
      cellRenderer: 'agCheckboxCellRenderer',
      valueGetter: (params) => params.data?.resuelto === 1,
      valueSetter: (params) => {
        params.data.resuelto = params.newValue ? 1 : 0;
        return true;
      }
    }
  ];

  public defaultColDef: ColDef = {
    flex: 1,
    minWidth: 100,
    resizable: true,
  };

  public paginationPageSizeSelector = false;
  private hasLoadedInitially = false;
  private gridApi: GridApi<Ticket> | null = null;

  constructor(
    private _ticketService: TicketService,
    public adminService: AdminService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.loadInitialTickets();
  }

  onGridReady(event: GridReadyEvent<Ticket>): void {
    this.gridApi = event.api;
    this.loadInitialTickets();
    this.syncGridData();
  }

  private loadInitialTickets(): void {
    if (this.hasLoadedInitially) {
      return;
    }

    this.hasLoadedInitially = true;
    this.listarTickets();
  }

  listarTickets() {
    this._ticketService.getTickets().subscribe(data => {
      this.allTickets = data;
      this.applySearchFilter();
      console.log(this.rowData)
    });
  }

  onSearchChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTerm = target.value ?? '';
    this.applySearchFilter();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.applySearchFilter();
  }

  private applySearchFilter(): void {
    const query = this.normalizeText(this.searchTerm);

    if (!query) {
      this.rowData = [...this.allTickets];
      this.syncGridData();
      return;
    }

    this.rowData = this.allTickets.filter(ticket => {
      const curp = this.normalizeText(ticket.curp);
      const nombre = this.normalizeText(ticket.nombre);
      const apPaterno = this.normalizeText(ticket.apPaterno);
      const apMaterno = this.normalizeText(ticket.apMaterno);

      const fullName = [nombre, apPaterno, apMaterno].filter(Boolean).join(' ');
      const fullNameAlt = [apPaterno, apMaterno, nombre].filter(Boolean).join(' ');

      return curp.includes(query) || fullName.includes(query) || fullNameAlt.includes(query);
    });

    this.syncGridData();
  }

  private syncGridData(): void {
    if (!this.gridApi) {
      return;
    }

    this.gridApi.setGridOption('rowData', this.rowData);
  }

  private normalizeText(value: string | null | undefined): string {
    return (value ?? '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();
  }

  onCellValueChanged(params: CellValueChangedEvent<Ticket>) {
    const ticketEditado = params.data;

    this._ticketService.updateTicket(ticketEditado).subscribe({
      next: () => {
        console.log('Actualización exitosa en .NET');
        this.applySearchFilter();
      },
      error: (err) => {
        console.error('Error al actualizar', err);
        this.listarTickets();
      }
    });
  }

  logout(): void {
    this.adminService.logout();
    this.router.navigate(['']);
  }
}
