import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TicketService } from '../../services/ticket-service';
import { Ticket } from '../../interfaces/ticket';
import { FormsModule } from '@angular/forms';
import { CatalogosService } from '../../services/catalogos-service';
import { Municipio } from '../../interfaces/municipio';
import { Asunto } from '../../interfaces/asunto';
import { Nivel } from '../../interfaces/nivel';
import { ChangeDetectorRef } from '@angular/core';
import { QRCodeComponent } from 'angularx-qrcode';
import { Location } from '@angular/common';
import { UserNavbar } from '../user-navbar/user-navbar';

@Component({
  selector: 'app-registro',
  imports: [FormsModule, QRCodeComponent, UserNavbar],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class Registro {
  constructor(private ticketService: TicketService, private router: Router, private route: ActivatedRoute, private catService: CatalogosService, private cdr: ChangeDetectorRef, private location: Location) { }
  ticketFilter: Ticket = new Ticket();
  municipios: Municipio[] = [];
  asuntos: Asunto[] = [];
  niveles: Nivel[] = [];
  idMunicipioOg = 0;
  impresion = 0;

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.impresion = params['impresion'];
      console.log(this.impresion)
      if (id > 0) {
        this.ticketService.getTicket(id).subscribe({
          next: (data) => {
            console.log('Ticket encontrado:', data);
            this.ticketFilter = data;
            this.idMunicipioOg = this.ticketFilter.idMunicipio;
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error('Error o no encontrado', err);
            alert('Verifique sus datos, no se encontró el ticket.');
          }
        });
      }
      this.catService.getMunicipios().subscribe({
        next: (data) => {
          this.municipios = data;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error o no encontrado', err);
        }
      });
      this.catService.getAsuntos().subscribe({
        next: (data) => {
          this.asuntos = data;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error o no encontrado', err);
        }
      });
      this.catService.getNiveles().subscribe({
        next: (data) => {
          this.niveles = data;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error o no encontrado', err);
        }
      });
    });
  }

  btnSave() {
    if (this.ticketFilter.idTicket <= 0) {
      this.ticketService.saveTicket(this.ticketFilter).subscribe({
        next: () => {
          console.log('registrado');
          alert('Ticket registrado con éxito.');
          this.router.navigate(['info', this.ticketFilter.idTicket]);
        },
        error: (err) => {
          console.error('Error o no encontrado', err);
        }
      });
      console.log('nuevo')
    }
    else {
      if (this.ticketFilter.idMunicipio != this.idMunicipioOg) {
        this.ticketFilter.idTicket = 0;
        this.ticketService.saveTicket(this.ticketFilter).subscribe({
          next: () => {
            console.log('actualizado');
            alert('Ticket actualizado con éxito.');
            this.router.navigate(['info', this.ticketFilter.idTicket]);
          },
          error: (err) => {
            console.error('Error o no encontrado', err);
          }
        });
        console.log('modificacion mun')
      }
      else {
        console.log('modificacion')
        this.ticketService.updateTicket(this.ticketFilter).subscribe({
          next: () => {
            console.log('actualizado');
            alert('Ticket actualizado con éxito.');
            this.router.navigate(['info', this.ticketFilter.idTicket]);
          },
          error: (err) => {
            console.error('Error o no encontrado', err);
          }
        });
      }
    }
    console.log(this.ticketFilter)
  }
  goBack() {
    this.location.back();
  }
}
