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
      const id = Number(params['id']) || 0;
      const numTurno = Number(params['numTurno']) || 0;
      const idMunicipio = Number(params['idMunicipio']) || 0;
      const curp = String(params['curp'] ?? '').trim();
      this.impresion = Number(params['impresion']) || 0;
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
      } else if (numTurno > 0 && idMunicipio > 0 && curp.length > 0) {
        this.ticketService.buscarTicket(numTurno, curp, idMunicipio).subscribe({
          next: (data) => {
            console.log('Ticket encontrado por parametros:', data);
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

  private tieneTexto(valor?: string): boolean {
    return !!valor && valor.trim().length > 0;
  }

  private esTelefonoValido(valor?: string): boolean {
    return /^\d{10}$/.test((valor ?? '').trim());
  }

  private esCorreoValido(valor?: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((valor ?? '').trim());
  }

  private formularioCompleto(): boolean {
    return this.tieneTexto(this.ticketFilter.tramitante)
      && this.tieneTexto(this.ticketFilter.curp)
      && this.tieneTexto(this.ticketFilter.nombre)
      && this.tieneTexto(this.ticketFilter.apPaterno)
      && this.tieneTexto(this.ticketFilter.apMaterno)
      && this.tieneTexto(this.ticketFilter.telefono)
      && this.tieneTexto(this.ticketFilter.celular)
      && this.tieneTexto(this.ticketFilter.correo)
      && Number(this.ticketFilter.idNivel) > 0
      && Number(this.ticketFilter.idMunicipio) > 0
      && Number(this.ticketFilter.idAsunto) > 0;
  }

  btnSave() {
    this.ticketFilter.idNivel = Number(this.ticketFilter.idNivel) || 0;
    this.ticketFilter.idMunicipio = Number(this.ticketFilter.idMunicipio) || 0;
    this.ticketFilter.idAsunto = Number(this.ticketFilter.idAsunto) || 0;

    if (!this.formularioCompleto()) {
      alert('Debes completar todos los campos antes de registrar o modificar el ticket.');
      return;
    }

    const curp = (this.ticketFilter.curp ?? '').trim();
    const telefono = (this.ticketFilter.telefono ?? '').trim();
    const celular = (this.ticketFilter.celular ?? '').trim();
    const correo = (this.ticketFilter.correo ?? '').trim();

    if (curp.length !== 18) {
      alert('La CURP debe tener exactamente 18 caracteres.');
      return;
    }

    if (!this.esTelefonoValido(telefono)) {
      alert('El teléfono debe tener exactamente 10 dígitos.');
      return;
    }

    if (!this.esTelefonoValido(celular)) {
      alert('El celular debe tener exactamente 10 dígitos.');
      return;
    }

    if (!this.esCorreoValido(correo)) {
      alert('El correo no tiene un formato válido.');
      return;
    }

    this.ticketFilter.curp = curp;
    this.ticketFilter.telefono = telefono;
    this.ticketFilter.celular = celular;
    this.ticketFilter.correo = correo;
    console.log('paso los filtros')
    if (this.ticketFilter.idTicket <= 0) {
      this.ticketService.saveTicket(this.ticketFilter).subscribe({
        next: (response) => {
          console.log('registrado');

          const numTurnoCreado = Number(response?.numTurno ?? this.ticketFilter.numTurno);
          const idMunicipioCreado = Number(response?.idMunicipio ?? this.ticketFilter.idMunicipio);
          const curpCreada = String(response?.curp ?? this.ticketFilter.curp ?? '').trim();
          const idCreado = Number(response?.idTicket ?? this.ticketFilter.idTicket);

          alert('Ticket registrado con éxito.');
          if (numTurnoCreado > 0 && idMunicipioCreado > 0 && curpCreada.length > 0) {
            this.router.navigate(['info-turno', numTurnoCreado, idMunicipioCreado, curpCreada]);
            return;
          }

          this.router.navigate(['info', idCreado]);
        },
        error: (err) => {
          console.error('Error o no encontrado', err);
        }
      });
      console.log('nuevo')
    }
    else {
      if (this.ticketFilter.idMunicipio !== this.idMunicipioOg) {
        const ticketNuevo: Ticket = {
          ...this.ticketFilter,
          idTicket: 0,
          numTurno: 0,
        };

        this.ticketService.saveTicket(ticketNuevo).subscribe({
          next: (response) => {
            const numTurnoCreado = Number(response?.numTurno ?? ticketNuevo.numTurno);
            const idMunicipioCreado = Number(response?.idMunicipio ?? ticketNuevo.idMunicipio);
            const curpCreada = String(response?.curp ?? ticketNuevo.curp ?? '').trim();
            const idCreado = Number(response?.idTicket ?? ticketNuevo.idTicket);

            console.log('actualizado');
            alert('Ticket actualizado con éxito.');
            if (numTurnoCreado > 0 && idMunicipioCreado > 0 && curpCreada.length > 0) {
              this.router.navigate(['info-turno', numTurnoCreado, idMunicipioCreado, curpCreada]);
              return;
            }

            this.router.navigate(['info', idCreado]);
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
