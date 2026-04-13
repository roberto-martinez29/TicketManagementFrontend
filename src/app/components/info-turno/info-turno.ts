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

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id')) ?? 0;
    if (id > 0) {
      forkJoin({
        ticket: this.ticketService.getTicket(id),
        municipios: this.catService.getMunicipios()
      }).subscribe({
        next: ({ ticket, municipios }) => {
          console.log('Ticket encontrado:', ticket);
          this.ticketFilter = ticket;
          this.municipios = municipios;

          const municipio = this.municipios.find(u => u.idMunicipio === this.ticketFilter.idMunicipio);
          this.nombreMunicipio = municipio ? municipio.nombre : 'No encontrado';
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error al cargar ticket o municipios', err);
          alert('No se pudieron cargar correctamente los datos del ticket.');
        }
      });
    }
  }

  imprimir() {
    this.router.navigate([{ outlets: { print: ['imprimir-ticket', this.ticketFilter.idTicket, 1] } }]).then(() => {
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
