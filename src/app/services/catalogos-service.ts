import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Municipio } from '../interfaces/municipio';
import { Nivel } from '../interfaces/nivel';
import { Asunto } from '../interfaces/asunto';

@Injectable({
  providedIn: 'root',
})
export class CatalogosService {
  private myApiUrl: string = 'https://localhost:7202/api/catalogos/';

  constructor(private http: HttpClient) { }

  getMunicipios(): Observable<Municipio[]> {
    return this.http.get<Municipio[]>(this.myApiUrl + 'municipios');
  }

  saveMunicipio(municipio: Municipio): Observable<any> {
    return this.http.post<any>(this.myApiUrl + 'municipios', municipio);
  }

  deleteMunicipio(id: number): Observable<any> {
    return this.http.delete<any>(this.myApiUrl + 'municipios/' + id);
  }

  getNiveles(): Observable<Nivel[]> {
    return this.http.get<Nivel[]>(this.myApiUrl + 'niveles');
  }

  saveNivel(nivel: Nivel): Observable<any> {
    return this.http.post<any>(this.myApiUrl + 'niveles', nivel);
  }

  updateNivel(nivel: Nivel): Observable<any> {
    return this.http.put<any>(this.myApiUrl + 'niveles', nivel);
  }

  deleteNivel(id: number): Observable<any> {
    return this.http.delete<any>(this.myApiUrl + 'niveles/' + id);
  }

  getAsuntos(): Observable<Asunto[]> {
    return this.http.get<Asunto[]>(this.myApiUrl + 'asuntos');
  }

  saveAsunto(asunto: Asunto): Observable<any> {
    return this.http.post<any>(this.myApiUrl + 'asuntos', asunto);
  }

  updateAsunto(asunto: Asunto): Observable<any> {
    return this.http.put<any>(this.myApiUrl + 'asuntos', asunto);
  }

  deleteAsunto(id: number): Observable<any> {
    return this.http.delete<any>(this.myApiUrl + 'asuntos/' + id);
  }
}
