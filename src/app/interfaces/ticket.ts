export class Ticket {
    idTicket: number = 0;
    curp: string = '';
    numTurno: number = 0;
    idMunicipio: number = 0;
    tramitante: string = '';
    nombre: string = '';
    apPaterno: string = '';
    apMaterno: string = '';
    telefono: string = '';
    celular: string = '';
    correo: string = '';
    idNivel: number = 0;
    idAsunto?: number = 0;
    municipio?: string;
    nivel?: string;
    resuelto?: number = 0;
}