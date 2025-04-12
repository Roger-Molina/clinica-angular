import { ApplicationRef, Component, NgZone, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { SelectModule } from 'primeng/select'; // Reemplazado DropdownModule por SelectModule
import { ColorPickerModule } from 'primeng/colorpicker';
import { CheckboxModule } from 'primeng/checkbox';
import { FormBuilder } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Evento, TipoEvento } from '../../interfaces/calendario.interface';
import { TextareaModule } from 'primeng/textarea';
import { TooltipModule } from 'primeng/tooltip';
import { EventoFormComponent } from '../evento-form/evento-form.component';

@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    ToastModule,
    SelectModule, // Actualizado de DropdownModule a SelectModule
    ColorPickerModule,
    CheckboxModule,
    TextareaModule,
    TooltipModule,
    EventoFormComponent
  ],
  templateUrl: './calendario.component.html',
  styleUrl: './calendario.component.scss',
  providers: [MessageService]
})
export class CalendarioComponent implements OnInit {

  // Estado del calendario
  fechaActual: Date = new Date();
  fechaSeleccionada: Date = new Date();
  
  // Datos para el calendario semanal
  diasSemana: Date[] = [];
  horasDia: number[] = [];
  eventosTodoDia: Evento[] = [];
  
  // Opciones del calendario  
  // Fechas deshabilitadas (ejemplo: fines de semana pasados)
  fechasDeshabilitadas: Date[] = [];
  diasDeshabilitados: number[] = []; // 0=Domingo, 1=Lunes, ... 6=Sábado
  
  // Eventos
  eventos: Evento[] = [];
  eventosEnFechaSeleccionada: Evento[] = [];
  eventoEnEdicion: Evento | null = null;
  
  // Diálogo de evento
  dialogoEventoVisible: boolean = false;
  submitted: boolean = false;
  guardando: boolean = false;
  
  // Tipos de eventos
  tiposEventos: TipoEvento[] = [
    { nombre: 'Reunión', valor: 'reunion' },
    { nombre: 'Cita', valor: 'cita' },
    { nombre: 'Recordatorio', valor: 'recordatorio' },
    { nombre: 'Festivo', valor: 'festivo' }
  ];
  
  // Filtros
  filtroTipoEvento: string | null = null;
  
  // Opciones de filtro para el componente Select
  opcionesFiltro: any[] = [];

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private zone: NgZone,
    private appRef: ApplicationRef
  ) {}
  ngOnInit() {
    this.inicializarHorasDia();
    this.actualizarDiasSemana();
    this.cargarEventosDePrueba();
    this.actualizarEventosEnFechaSeleccionada();
    this.actualizarEventosTodoDia();
    this.inicializarOpcionesFiltro();
  }
  
  // Inicializar opciones para el filtro Select
  inicializarOpcionesFiltro() {
    this.opcionesFiltro = [
      { label: 'Todos', value: null },
      ...this.tiposEventos.map(tipo => ({
        label: tipo.nombre,
        value: tipo.valor
      }))
    ];
  }
  
  // Inicializar las horas para mostrar en el calendario
  inicializarHorasDia() {
    this.horasDia = [];
    for(let i = 0; i < 24; i++) {
      this.horasDia.push(i);
    }
  }
  
  cargarEventosDePrueba() {
    const hoy = new Date();
    const manana = new Date(hoy);
    manana.setDate(hoy.getDate() + 1);
    
    const inicioHoy = new Date(hoy);
    inicioHoy.setHours(9, 0, 0, 0);
    
    const finHoy = new Date(hoy);
    finHoy.setHours(11, 0, 0, 0);
    
    const inicioManana = new Date(manana);
    inicioManana.setHours(14, 0, 0, 0);
    
    const finManana = new Date(manana);
    finManana.setHours(16, 0, 0, 0);
    
    const diaPlus3 = new Date(hoy);
    diaPlus3.setDate(hoy.getDate() + 3);
    
    const diaPlus5 = new Date(hoy);
    diaPlus5.setDate(hoy.getDate() + 5);
    
    const inicioDiaPlus5 = new Date(diaPlus5);
    inicioDiaPlus5.setHours(18, 0, 0, 0);
    
    const finDiaPlus5 = new Date(diaPlus5);
    finDiaPlus5.setHours(20, 0, 0, 0);
    
    this.eventos = [
      {
        id: 1,
        titulo: 'Reunión de equipo',
        fechaInicio: inicioHoy,
        fechaFin: finHoy,
        todoElDia: false,
        descripcion: 'Revisar avances del proyecto',
        color: '#1976D2',
        tipo: 'reunion'
      },
      {
        id: 2,
        titulo: 'Cita con cliente',
        fechaInicio: inicioManana,
        fechaFin: finManana,
        todoElDia: false,
        descripcion: 'Presentación de prototipo',
        color: '#689F38',
        tipo: 'cita'
      },
      {
        id: 3,
        titulo: 'Entrega de informe',
        fechaInicio: diaPlus3,
        todoElDia: true,
        color: '#D32F2F',
        tipo: 'recordatorio'
      },
      {
        id: 4,
        titulo: 'Taller de desarrollo',
        fechaInicio: inicioDiaPlus5,
        fechaFin: finDiaPlus5,
        todoElDia: false,
        descripcion: 'Taller de desarrollo de nuevas características',
        color: '#7B1FA2',
        tipo: 'reunion'
      }
    ];
  }
  
  // Actualizar los días de la semana actual
  actualizarDiasSemana() {
    const primerDia = this.obtenerPrimerDiaSemana(this.fechaActual);
    this.diasSemana = [];
    
    for (let i = 0; i < 7; i++) {
      const dia = new Date(primerDia);
      dia.setDate(primerDia.getDate() + i);
      this.diasSemana.push(dia);
    }
  }
  
  // Obtener el primer día de la semana (lunes para ES)
  obtenerPrimerDiaSemana(fecha: Date): Date {
    const fechaCopia = new Date(fecha);
    const diaSemana = fechaCopia.getDay(); // 0=domingo, 1=lunes, etc.
    const diff = fechaCopia.getDate() - diaSemana + (diaSemana === 0 ? -6 : 1); // Ajustar para comenzar el lunes
    return new Date(fechaCopia.setDate(diff));
  }
  
  // Obtener eventos para un día y hora específicos
  getEventosParaHora(dia: Date, hora: number): Evento[] {
    return this.eventos.filter(evento => {
      if (evento.todoElDia) return false;
      
      const fechaInicio = new Date(evento.fechaInicio);
      const fechaFin = evento.fechaFin ? new Date(evento.fechaFin) : new Date(fechaInicio);
      
      // Verificar si el evento es del mismo día
      const esMismoDia = fechaInicio.getDate() === dia.getDate() &&
                          fechaInicio.getMonth() === dia.getMonth() &&
                          fechaInicio.getFullYear() === dia.getFullYear();
      
      if (!esMismoDia) return false;
      
      // Verificar si el evento está en esa hora
      const horaInicio = fechaInicio.getHours();
      const horaFin = fechaFin.getHours() + (fechaFin.getMinutes() > 0 ? 1 : 0);
      
      return horaInicio <= hora && hora < horaFin;
    });
  }
  
  // Calcular la altura del evento basado en su duración
  getEventoAlto(evento: Evento): number {
    if (!evento.fechaFin) return 56; // altura por defecto para eventos sin hora de fin
    
    const fechaInicio = new Date(evento.fechaInicio);
    const fechaFin = new Date(evento.fechaFin);
    
    // Calcular la duración en minutos
    const duracionMs = fechaFin.getTime() - fechaInicio.getTime();
    const duracionMinutos = duracionMs / (1000 * 60);
    
    // Calcular la altura (60px por hora, 1px por minuto)
    return Math.max(25, duracionMinutos);
  }
  
  // Calcular la posición vertical del evento basado en los minutos
  getEventoPosicionTop(evento: Evento, hora: number): number {
    const fechaInicio = new Date(evento.fechaInicio);
    const horaInicio = fechaInicio.getHours();
    
    // Si el evento comienza en una hora diferente, no desplazar
    if (horaInicio !== hora) return 0;
    
    // Calcular desplazamiento basado en minutos
    return fechaInicio.getMinutes();
  }
  
  // Actualizar eventos de todo el día para la semana actual
  actualizarEventosTodoDia() {
    this.eventosTodoDia = this.eventos.filter(evento => {
      if (!evento.todoElDia) return false;
      
      const fechaEvento = new Date(evento.fechaInicio);
      
      // Verificar si el evento está en la semana actual
      return this.diasSemana.some(dia => 
        fechaEvento.getDate() === dia.getDate() &&
        fechaEvento.getMonth() === dia.getMonth() &&
        fechaEvento.getFullYear() === dia.getFullYear()
      );
    });
    
    // Aplicar filtro de tipo si existe
    if (this.filtroTipoEvento) {
      this.eventosTodoDia = this.eventosTodoDia.filter(
        evento => evento.tipo === this.filtroTipoEvento
      );
    }
  }
  
  // Obtener el código abreviado para el tipo de evento
  getCodigoEvento(evento: Evento): string {
    switch(evento.tipo) {
      case 'reunion': return 'Re';
      case 'cita': return 'Ci';
      case 'recordatorio': return 'Rc';
      case 'festivo': return 'Fe';
      default: return evento.tipo.substring(0, 2);
    }
  }
  
  // Formatear las horas de inicio y fin de un evento
  formatearHorasEvento(evento: Evento): string {
    if (evento.todoElDia) {
      return 'Todo el día';
    }
    
    const horaInicio = this.formatearFechaHora(evento.fechaInicio);
    if (!evento.fechaFin) {
      return horaInicio;
    }
    
    const horaFin = this.formatearFechaHora(evento.fechaFin);
    return `${horaInicio} - ${horaFin}`;
  }
  
  // Comprobar si una fecha es fin de semana
  esFinDeSemana(fecha: Date): boolean {
    const dia = fecha.getDay();
    return dia === 0 || dia === 6; // 0 = Domingo, 6 = Sábado
  }
  
  // Comprobar si una fecha es hoy
  esHoy(fecha: Date): boolean {
    const hoy = new Date();
    return fecha.getDate() === hoy.getDate() &&
           fecha.getMonth() === hoy.getMonth() &&
           fecha.getFullYear() === hoy.getFullYear();
  }
  
  // Obtener nombre del día de la semana
  getDayName(fecha: Date): string {
    const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    return dayNames[fecha.getDay()];
  }
  
  // Obtener rango de fechas de la semana actual (para mostrar en la cabecera)
  obtenerRangoSemanaActual(): string {
    if (this.diasSemana.length === 0) return '';
    
    const primerDia = this.diasSemana[0];
    const ultimoDia = this.diasSemana[6];
    
    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const monthNamesShort = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    
    // Si es el mismo mes
    if (primerDia.getMonth() === ultimoDia.getMonth()) {
      return `${primerDia.getDate()} - ${ultimoDia.getDate()} de ${monthNames[primerDia.getMonth()]} ${primerDia.getFullYear()}`;
    }
    
    // Si son meses diferentes
    return `${primerDia.getDate() } ${monthNamesShort[primerDia.getMonth()]} - ${ultimoDia.getDate()} ${monthNamesShort[ultimoDia.getMonth()]} ${ultimoDia.getFullYear()}`;
  }
  
  semanaAnterior() {
    const nuevaFecha = new Date(this.fechaActual);
    nuevaFecha.setDate(nuevaFecha.getDate() - 7);
    this.fechaActual = nuevaFecha;
    this.actualizarDiasSemana();
    this.actualizarEventosTodoDia();
  }
  
  semanaSiguiente() {
    const nuevaFecha = new Date(this.fechaActual);
    nuevaFecha.setDate(nuevaFecha.getDate() + 7);
    this.fechaActual = nuevaFecha;
    this.actualizarDiasSemana();
    this.actualizarEventosTodoDia();
  }
  
  irAHoy() {
    this.fechaActual = new Date();
    this.fechaSeleccionada = new Date();
    this.actualizarDiasSemana();
    this.actualizarEventosEnFechaSeleccionada();
    this.actualizarEventosTodoDia();
  }
  
  onFechaSeleccionada(fecha: Date) {
    this.fechaSeleccionada = fecha;
    this.actualizarEventosEnFechaSeleccionada();
  }
  
  actualizarEventosEnFechaSeleccionada() {
    if (!this.fechaSeleccionada) {
      this.eventosEnFechaSeleccionada = [];
      return;
    }
    
    const fechaInicio = new Date(
      this.fechaSeleccionada.getFullYear(),
      this.fechaSeleccionada.getMonth(),
      this.fechaSeleccionada.getDate()
    );
    
    const fechaFin = new Date(
      this.fechaSeleccionada.getFullYear(),
      this.fechaSeleccionada.getMonth(),
      this.fechaSeleccionada.getDate(),
      23, 59, 59
    );
    
    this.eventosEnFechaSeleccionada = this.eventos.filter(evento => {
      // Eventos de todo el día
      if (evento.todoElDia) {
        const eventDate = new Date(evento.fechaInicio);
        return eventDate.getFullYear() === fechaInicio.getFullYear() &&
               eventDate.getMonth() === fechaInicio.getMonth() &&
               eventDate.getDate() === fechaInicio.getDate();
      }
      
      // Eventos con fecha y hora
      return evento.fechaInicio >= fechaInicio && evento.fechaInicio <= fechaFin;
    });
    
    // Aplicar filtro de tipo si existe
    if (this.filtroTipoEvento) {
      this.eventosEnFechaSeleccionada = this.eventosEnFechaSeleccionada.filter(
        evento => evento.tipo === this.filtroTipoEvento
      );
    }
  }
  
  mostrarDialogoEvento() {
    this.eventoEnEdicion = null;
    this.dialogoEventoVisible = true;
  }
  
  crearEventoEnHora(dia: Date, hora: number) {
    // Crear una nueva fecha con la fecha del día seleccionado y la hora indicada
    const fechaInicio = new Date(dia);
    fechaInicio.setHours(hora, 0, 0, 0);
    
    // Crear fecha fin por defecto (1 hora después)
    const fechaFin = new Date(fechaInicio);
    fechaFin.setHours(fechaInicio.getHours() + 1);
    
    // Establecer valores iniciales y mostrar modal
    this.eventoEnEdicion = {
      id: 0,
      titulo: '',
      fechaInicio: fechaInicio,
      fechaFin: fechaFin,
      todoElDia: false,
      color: '#1976D2',
      tipo: 'cita'
    };
    this.dialogoEventoVisible = true;
  }
  
  editarEvento(evento: Evento) {
    this.eventoEnEdicion = { ...evento };
    this.dialogoEventoVisible = true;
  }
  
  eliminarEvento(evento: Evento) {
    this.eventos = this.eventos.filter(e => e.id !== evento.id);
    this.actualizarEventosEnFechaSeleccionada();
    this.actualizarEventosTodoDia();
    
    this.messageService.add({
      severity: 'success',
      summary: 'Evento eliminado',
      detail: `Se ha eliminado "${evento.titulo}"`
    });
  }
  
  onGuardarEvento(formValues: any) {
    this.guardando = true;
    
    // Envolver en NgZone para garantizar la detección de cambios adecuada
    this.zone.run(() => {
      setTimeout(() => {
        // Tu código existente...
        
        this.guardando = false;
        this.dialogoEventoVisible = false;
        this.eventoEnEdicion = null;
        this.actualizarEventosEnFechaSeleccionada();
        this.actualizarEventosTodoDia();
        
        // Forzar detección de cambios
        this.appRef.tick();
      }, 500);
    });
  }
  
  onCancelarEvento() {
    this.dialogoEventoVisible = false;
    this.eventoEnEdicion = null;
  }
  
  filtrarEventos() {
    this.actualizarEventosEnFechaSeleccionada();
    this.actualizarEventosTodoDia();
  }
  
  formatearFecha(fecha: Date): string {
    if (!fecha) return '';
    
    return fecha.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  
  formatearFechaHora(fecha: Date): string {
    if (!fecha) return '';
    
    return fecha.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
  // Método para obtener el nombre del tipo de evento a partir de su valor
  getTipoEventoNombre(valor: string): string {
    const tipoEvento = this.tiposEventos.find(tipo => tipo.valor === valor);
    return tipoEvento ? tipoEvento.nombre : valor;
  }
}