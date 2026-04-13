import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TicketService } from '../../services/ticket-service';
import { Ticket } from '../../interfaces/ticket';
import { Municipio } from '../../interfaces/municipio';
import { CatalogosService } from '../../services/catalogos-service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { UserNavbar } from '../user-navbar/user-navbar';

@Component({
  selector: 'app-login-usuario',
  standalone: true,
  imports: [FormsModule, UserNavbar],
  templateUrl: './login-usuario.html',
  styleUrl: './login-usuario.css',
})
export class LoginUsuario {
  constructor(private ticketService: TicketService, private catService: CatalogosService, private router: Router, private location: Location) { }

  ticketFilter: Ticket = new Ticket();
  municipios: Municipio[] = [];

  ngOnInit() {
    this.catService.getMunicipios().subscribe({
      next: (data) => {
        console.log('Municipios:', data);
        this.municipios = data;
      },
      error: (err) => {
        console.error('Error o no encontrado', err);
      }
    });
  }

  btnLogin() {
    this.ticketService.buscarTicket(this.ticketFilter.numTurno, this.ticketFilter.curp, this.ticketFilter.idMunicipio).subscribe({
      next: (data) => {
        console.log('Ticket encontrado:', data);
        this.ticketFilter = data;
        this.router.navigate(['registro', this.ticketFilter.idTicket]);
      },
      error: (err) => {
        console.error('Error o no encontrado', err);
        alert('Verifique sus datos, no se encontró el ticket.');
      }
    });
  }
  goBack() {
    this.location.back();
  }
}
