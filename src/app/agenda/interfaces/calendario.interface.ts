export interface Evento {
    id: number;
    titulo: string;
    fechaInicio: Date;
    fechaFin?: Date;
    todoElDia: boolean;
    descripcion?: string;
    color: string;
    tipo: string;
  }
  
  export interface TipoEvento {
    nombre: string;
    valor: string;
  }