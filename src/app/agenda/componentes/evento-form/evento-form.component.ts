import { Component, EventEmitter, Input, OnInit, Output, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ColorPickerModule } from 'primeng/colorpicker';
import { CheckboxModule } from 'primeng/checkbox';
import { TextareaModule } from 'primeng/textarea';
import { Evento, TipoEvento } from '../../interfaces/calendario.interface';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  selector: 'app-evento-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DatePickerModule, // Reemplazado CalendarModule por DatePickerModule
    ButtonModule,
    DialogModule,
    InputTextModule,
    SelectButtonModule, // Cambiado DropdownModule por SelectButtonModule
    ColorPickerModule,
    CheckboxModule,
    TextareaModule
  ],
  templateUrl: './evento-form.component.html',
  styleUrl: './evento-form.component.scss'
})
export class EventoFormComponent implements OnInit, OnChanges {
  @Input() visible: boolean = false;
  @Input() evento: Evento | null = null;
  @Input() tiposEventos: TipoEvento[] = [];
  @Input() guardando: boolean = false;
  
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() guardar = new EventEmitter<any>();
  @Output() cancelar = new EventEmitter<void>();
  
  formularioEvento!: FormGroup;
  submitted: boolean = false;
  
  // Opciones para el selector de tipo de evento
  tipoEventoOptions: any[] = [];
  
  constructor(private fb: FormBuilder) {}
  
  ngOnInit(): void {
    this.inicializarFormulario();
    this.formatearOpcionesTipoEvento();
  }
  
  formatearOpcionesTipoEvento() {
    this.tipoEventoOptions = this.tiposEventos.map(tipo => ({
      label: tipo.nombre,
      value: tipo.valor
    }));
  }
  
  ngOnChanges(): void {
    if (this.evento && this.formularioEvento) {
      // Si tenemos un evento para editar, establecemos sus valores en el formulario
      this.formularioEvento.patchValue({
        id: this.evento.id,
        titulo: this.evento.titulo,
        fechaInicio: new Date(this.evento.fechaInicio),
        fechaFin: this.evento.fechaFin ? new Date(this.evento.fechaFin) : null,
        todoElDia: this.evento.todoElDia,
        descripcion: this.evento.descripcion || '',
        color: this.evento.color,
        tipo: this.evento.tipo
      });
    } else if (this.formularioEvento) {
      // Si es un nuevo evento, reiniciamos el formulario
      this.formularioEvento.reset({
        id: null,
        fechaInicio: new Date(),
        todoElDia: false,
        color: '#1976D2',
        tipo: 'cita'
      });
    }
  }
  
  inicializarFormulario(): void {
    this.formularioEvento = this.fb.group({
      id: [null],
      titulo: ['', Validators.required],
      fechaInicio: [new Date(), Validators.required],
      fechaFin: [null],
      todoElDia: [false],
      descripcion: [''],
      color: ['#1976D2'],
      tipo: ['cita', Validators.required]
    });
  }
  
  onSubmit(): void {
    this.submitted = true;
    
    if (this.formularioEvento.invalid) {
      return;
    }
    
    // Emitir los valores del formulario al componente padre
    this.guardar.emit(this.formularioEvento.value);
  }
  
  onHide(): void {
    this.visibleChange.emit(false);
    this.cancelar.emit();
    this.submitted = false;
  }
}