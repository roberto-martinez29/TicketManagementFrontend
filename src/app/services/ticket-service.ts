import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ticket } from '../interfaces/ticket';

@Injectable({
  providedIn: 'root',
})
export class TicketService {
  private myApiUrl: string = 'https://localhost:7202/api/tickets/';

  constructor(private http: HttpClient) { }

  getTickets(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(this.myApiUrl);
  }

  getTicket(id: number): Observable<Ticket> {
    return this.http.get<Ticket>(this.myApiUrl + id);
  }

  saveTicket(ticket: Ticket): Observable<any> {
    return this.http.post<any>(this.myApiUrl, ticket);
  }

  updateTicket(ticket: Ticket): Observable<any> {
    return this.http.put<any>(this.myApiUrl, ticket);
  }

  deleteTicket(id: number): Observable<any> {
    return this.http.delete<any>(this.myApiUrl + id);
  }

  buscarTicket(numTurno: number, curp: string, idMunicipio: number): Observable<Ticket> {
    const params = new HttpParams()
      .set('numTurno', numTurno.toString())
      .set('curp', curp)
      .set('idMunicipio', idMunicipio.toString());

    return this.http.get<Ticket>(this.myApiUrl + 'buscar', { params });
  }
}
