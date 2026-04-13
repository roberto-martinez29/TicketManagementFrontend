import { ChangeDetectorRef, Component } from '@angular/core';
import { TicketService } from '../../services/ticket-service';
import { Ticket } from '../../interfaces/ticket';
import { ActivatedRoute, Router } from '@angular/router';
import { CatalogosService } from '../../services/catalogos-service';
import { Municipio } from '../../interfaces/municipio';
import { Location } from '@angular/common';
import { forkJoin } from 'rxjs';
import { UserNavbar } from '../user-navbar/user-navbar';

@Component({
  selector: 'app-info-turno',
  standalone: true,
  imports: [UserNavbar],
  templateUrl: './info-turno.html',
  styleUrl: './info-turno.css',
})
export class InfoTurno {
  constructor(private ticketService: TicketService, private route: ActivatedRoute, private cdr: ChangeDetectorRef, private catService: CatalogosService, private router: Router, private location: Location) { }

  ticketFilter: Ticket = new Ticket();
  municipios: Municipio[] = [];
  nombreMunicipio = '';

  private setTicketData(ticket: Ticket, municipios: Municipio[]): void {
    this.ticketFilter = ticket;
    this.municipios = municipios;

    const municipio = this.municipios.find(u => u.idMunicipio === this.ticketFilter.idMunicipio);
    this.nombreMunicipio = municipio ? municipio.nombre : 'No encontrado';
    this.cdr.detectChanges();
  }

  private actualizarTicketSiTurnoPendiente(ticket: Ticket, municipios: Municipio[]): void {
    if (Number(ticket.idTicket) <= 0 || Number(ticket.numTurno) > 0) {
      this.setTicketData(ticket, municipios);
      return;
    }

    this.ticketService.updateTicket(ticket).subscribe({
      next: (response) => {
        const idTicketActualizado = Number(response?.idTicket ?? ticket.idTicket);

        if (idTicketActualizado <= 0) {
          this.setTicketData(ticket, municipios);
          return;
        }

        this.ticketService.getTicket(idTicketActualizado).subscribe({
          next: (ticketActualizado) => {
            this.setTicketData(ticketActualizado, municipios);
          },
          error: () => {
            this.setTicketData(ticket, municipios);
          }
        });
      },
      error: () => {
        this.setTicketData(ticket, municipios);
      }
    });
  }

  ngOnInit() {
    const numTurno = Number(this.route.snapshot.paramMap.get('numTurno')) || 0;
    const idMunicipio = Number(this.route.snapshot.paramMap.get('idMunicipio')) || 0;
    const curp = (this.route.snapshot.paramMap.get('curp') ?? '').trim();

    if (numTurno > 0 && idMunicipio > 0 && curp.length > 0) {
      forkJoin({
        ticket: this.ticketService.buscarTicket(numTurno, curp, idMunicipio),
        municipios: this.catService.getMunicipios()
      }).subscribe({
        next: ({ ticket, municipios }) => {
          console.log('Ticket encontrado por parametros:', ticket);
          this.actualizarTicketSiTurnoPendiente(ticket, municipios);
        },
        error: (err) => {
          console.error('Error al buscar ticket por parametros', err);
          alert('No se pudo recuperar el ticket con los datos proporcionados.');
        }
      });
      return;
    }

    const id = Number(this.route.snapshot.paramMap.get('id')) || 0;
    if (id > 0) {
      forkJoin({
        ticket: this.ticketService.getTicket(id),
        municipios: this.catService.getMunicipios()
      }).subscribe({
        next: ({ ticket, municipios }) => {
          console.log('Ticket encontrado:', ticket);
          this.actualizarTicketSiTurnoPendiente(ticket, municipios);
        },
        error: (err) => {
          console.error('Error al cargar ticket o municipios', err);
          alert('No se pudieron cargar correctamente los datos del ticket.');
        }
      });
    }
  }

  imprimir() {
    const idTicket = Number(this.ticketFilter.idTicket) || 0;
    const numTurno = Number(this.ticketFilter.numTurno) || 0;
    const idMunicipio = Number(this.ticketFilter.idMunicipio) || 0;
    const curp = (this.ticketFilter.curp ?? '').trim();

    const rutaImpresion = idTicket > 0
      ? ['imprimir-ticket', idTicket, 1]
      : ['imprimir-ticket-busqueda', numTurno, idMunicipio, curp, 1];

    this.router.navigate([{ outlets: { print: rutaImpresion } }]).then(() => {
      setTimeout(() => {
        window.print();
        this.router.navigate([{ outlets: { print: null } }]);
      }, 1500);
    });
  }
  goBack() {
    this.location.back();
  }
}
