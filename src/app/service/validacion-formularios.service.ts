import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidacionFormulariosService {

  constructor() { }

  /**
   * Obtiene el mensaje de error basado en el error de validación
   * @param error Tipo de error de validación
   * @param validationValue Valores adicionales del error (ej. minlength)
   * @returns Mensaje de error formateado
   */
  getMensajeError(error: string, validationValue?: any): string {
    const mensajes: { [key: string]: string } = {
      required: 'Este campo es obligatorio',
      email: 'El formato de correo electrónico no es válido',
      minlength: `La longitud mínima es de ${validationValue?.requiredLength} caracteres`,
      maxlength: `La longitud máxima es de ${validationValue?.requiredLength} caracteres`,
      pattern: 'El formato ingresado no es válido',
      min: `El valor mínimo permitido es ${validationValue?.min}`,
      max: `El valor máximo permitido es ${validationValue?.max}`,
      invalidRut: 'El RUT ingresado no es válido',
      passwordMismatch: 'Las contraseñas no coinciden',
      matDatepickerMin: 'La fecha debe ser posterior a la fecha mínima',
      matDatepickerMax: 'La fecha debe ser anterior a la fecha máxima',
      whitespace: 'Este campo no puede contener solo espacios en blanco'
    };

    return mensajes[error] || 'Campo con formato incorrecto';
  }

  /**
   * Obtiene el mensaje de error para un control específico
   * @param control Control del formulario
   * @returns Mensaje de error o null si no hay errores
   */
  obtenerErrorFormControl(control: AbstractControl | null): string | null {
    if (!control || !control.errors || !control.touched) {
      return null;
    }

    const errores = Object.keys(control.errors);
    if (errores.length === 0) {
      return null;
    }

    const tipoError = errores[0];
    const valorError = control.errors[tipoError];
    
    return this.getMensajeError(tipoError, valorError);
  }

  /**
   * Valida si un campo es requerido y formatea un mensaje personalizado
   * @param control Control del formulario
   * @param nombreCampo Nombre del campo para personalizar el mensaje
   * @returns Mensaje de error personalizado o null
   */
  campoRequerido(control: AbstractControl | null, nombreCampo: string): string | null {
    if (!control || !control.errors || !control.touched) {
      return null;
    }

    if (control.errors['required']) {
      return `El campo ${nombreCampo} es obligatorio`;
    }

    return null;
  }

  /**
   * Valida longitud mínima para un campo
   * @param control Control del formulario
   * @param nombreCampo Nombre del campo para personalizar el mensaje
   * @returns Mensaje de error personalizado o null
   */
  longitudMinima(control: AbstractControl | null, nombreCampo: string): string | null {
    if (!control || !control.errors || !control.touched) {
      return null;
    }

    if (control.errors['minlength']) {
      const longitudRequerida = control.errors['minlength'].requiredLength;
      return `El campo ${nombreCampo} debe tener al menos ${longitudRequerida} caracteres`;
    }

    return null;
  }

  /**
   * Valida longitud máxima para un campo
   * @param control Control del formulario
   * @param nombreCampo Nombre del campo para personalizar el mensaje
   * @returns Mensaje de error personalizado o null
   */
  longitudMaxima(control: AbstractControl | null, nombreCampo: string): string | null {
    if (!control || !control.errors || !control.touched) {
      return null;
    }

    if (control.errors['maxlength']) {
      const longitudRequerida = control.errors['maxlength'].requiredLength;
      return `El campo ${nombreCampo} debe tener como máximo ${longitudRequerida} caracteres`;
    }

    return null;
  }

  /**
   * Valida formato de email
   * @param control Control del formulario
   * @returns Mensaje de error o null
   */
  emailValido(control: AbstractControl | null): string | null {
    if (!control || !control.errors || !control.touched) {
      return null;
    }

    if (control.errors['email']) {
      return 'Ingrese un correo electrónico válido';
    }

    return null;
  }

  /**
   * Valida que dos contraseñas coincidan
   * @param password Control de la contraseña
   * @param confirmPassword Control de la confirmación de contraseña
   * @returns Mensaje de error o null
   */
  passwordsIguales(password: AbstractControl | null, confirmPassword: AbstractControl | null): string | null {
    if (!password || !confirmPassword || !confirmPassword.touched) {
      return null;
    }

    if (password.value !== confirmPassword.value) {
      return 'Las contraseñas no coinciden';
    }

    return null;
  }

  /**
   * Valida formato de número de teléfono
   * @param control Control del formulario
   * @returns Mensaje de error o null
   */
  telefonoValido(control: AbstractControl | null): string | null {
    if (!control || !control.errors || !control.touched) {
      return null;
    }

    if (control.errors['pattern']) {
      return 'Ingrese un número de teléfono válido';
    }

    return null;
  }

  /**
   * Valida que un campo no esté vacío o solo con espacios en blanco
   * @param control Control del formulario
   * @returns ValidationErrors o null
   */
  noWhitespaceValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null; // Si está vacío, otros validadores como required se encargarán
    }
    
    const isWhitespace = (control.value || '').trim().length === 0;
    
    return isWhitespace ? { 'whitespace': true } : null;
  }
}