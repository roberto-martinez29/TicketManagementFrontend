import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import {
  Chart,
  ChartConfiguration,
  ChartData,
  ArcElement,
  DoughnutController,
  Legend,
  Tooltip,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';
import { Ticket } from '../../interfaces/ticket';
import { TicketService } from '../../services/ticket-service';
import { Router } from '@angular/router';
import { AdminService } from '../../services/admin-service';
import { AdminNavbar } from '../admin-navbar/admin-navbar';
import { CatalogosService } from '../../services/catalogos-service';
import { Municipio } from '../../interfaces/municipio';
import { forkJoin } from 'rxjs';

Chart.register(DoughnutController, ArcElement, Tooltip, Legend, BarController, BarElement, CategoryScale, LinearScale);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [AdminNavbar],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard implements AfterViewInit, OnDestroy {
  @ViewChild('ticketChart') ticketChart?: ElementRef<HTMLCanvasElement>;
  @ViewChild('ticketsPorMunicipioChart') ticketsPorMunicipioChart?: ElementRef<HTMLCanvasElement>;

  tickets: Ticket[] = [];
  ticketsFiltrados: Ticket[] = [];
  municipios: Municipio[] = [];
  selectedMunicipioIds: number[] = [];
  resueltos = 0;
  pendientes = 0;
  private estadoChart?: Chart<'doughnut'>;
  private municipioChart?: Chart<'bar'>;

  constructor(
    private _ticketService: TicketService,
    private _catalogosService: CatalogosService,
    private cdr: ChangeDetectorRef,
    public adminService: AdminService,
    private router: Router,
  ) { }

  ngAfterViewInit(): void {
    this.cargarDashboard();
  }

  cargarDashboard() {
    forkJoin({
      tickets: this._ticketService.getTickets(),
      municipios: this._catalogosService.getMunicipios(),
    }).subscribe(({ tickets, municipios }) => {
      this.tickets = tickets;
      this.municipios = municipios;
      this.actualizarFiltroYGraficas();
    });
  }

  onMunicipiosChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedMunicipioIds = Array.from(select.selectedOptions).map(option => Number(option.value));
    this.actualizarFiltroYGraficas();
  }

  limpiarFiltroMunicipios(): void {
    this.selectedMunicipioIds = [];
    this.actualizarFiltroYGraficas();
  }

  private actualizarFiltroYGraficas(): void {
    const hayFiltro = this.selectedMunicipioIds.length > 0;
    const municipiosSeleccionados = new Set(this.selectedMunicipioIds);

    this.ticketsFiltrados = hayFiltro
      ? this.tickets.filter(ticket => municipiosSeleccionados.has(ticket.idMunicipio))
      : [...this.tickets];

    this.resueltos = this.ticketsFiltrados.filter(ticket => Boolean(ticket.resuelto)).length;
    this.pendientes = this.ticketsFiltrados.length - this.resueltos;

    this.renderEstadoChart();
    this.renderTicketsPorMunicipioChart();
    this.cdr.markForCheck();
  }

  private renderEstadoChart(): void {
    if (!this.ticketChart) {
      return;
    }

    this.estadoChart?.destroy();

    const chartData: ChartData<'doughnut'> = {
      labels: ['Resueltos', 'Pendientes'],
      datasets: [{
        data: [this.resueltos, this.pendientes],
        backgroundColor: ['#22c55e', '#ef4444'],
        borderColor: '#ffffff',
        borderWidth: 3,
        hoverOffset: 8,
      }]
    };

    const chartConfig: ChartConfiguration<'doughnut'> = {
      type: 'doughnut',
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '68%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              usePointStyle: true,
              boxWidth: 10,
              boxHeight: 10,
              color: '#0f172a',
            }
          },
          tooltip: {
            enabled: true,
          }
        }
      }
    };

    this.estadoChart = new Chart(this.ticketChart.nativeElement, chartConfig);
  }

  private renderTicketsPorMunicipioChart(): void {
    if (!this.ticketsPorMunicipioChart) {
      return;
    }

    this.municipioChart?.destroy();

    const mapTicketsPorMunicipio = new Map<number, number>();
    for (const ticket of this.ticketsFiltrados) {
      const totalActual = mapTicketsPorMunicipio.get(ticket.idMunicipio) ?? 0;
      mapTicketsPorMunicipio.set(ticket.idMunicipio, totalActual + 1);
    }

    const labels = this.municipios
      .filter(municipio => mapTicketsPorMunicipio.has(municipio.idMunicipio))
      .map(municipio => municipio.nombre);

    const data = this.municipios
      .filter(municipio => mapTicketsPorMunicipio.has(municipio.idMunicipio))
      .map(municipio => mapTicketsPorMunicipio.get(municipio.idMunicipio) ?? 0);

    const tieneDatos = labels.length > 0;

    const chartData: ChartData<'bar'> = {
      labels: tieneDatos ? labels : ['Sin datos'],
      datasets: [
        {
          label: 'Tickets por municipio',
          data: tieneDatos ? data : [0],
          backgroundColor: '#3b82f6',
          borderRadius: 8,
          maxBarThickness: 42,
        },
      ],
    };

    const chartConfig: ChartConfiguration<'bar'> = {
      type: 'bar',
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: true,
          },
        },
        scales: {
          x: {
            ticks: {
              color: '#0f172a',
            },
            grid: {
              display: false,
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0,
              color: '#0f172a',
            },
            grid: {
              color: 'rgba(15, 23, 42, 0.08)',
            },
          },
        },
      },
    };

    this.municipioChart = new Chart(this.ticketsPorMunicipioChart.nativeElement, chartConfig);
  }

  ngOnDestroy(): void {
    this.estadoChart?.destroy();
    this.municipioChart?.destroy();
  }

  logout(): void {
    this.adminService.logout();
    this.router.navigate(['']);
  }
}
