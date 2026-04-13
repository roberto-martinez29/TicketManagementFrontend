export interface Ticket {
    idTicket?: number;
    curp: string;
    numTurno: number;
    idMunicipio: number;
    tramitante: string;
    nombre: string;
    apPaterno: string;
    apMaterno: string;
    telefono: string;
    celular: string;
    correo: string;
    idNivel: number;
    idAsunto?: number;
    municipio?: string;
    nivel?: string;
}