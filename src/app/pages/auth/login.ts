import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { DividerModule } from 'primeng/divider';
import { CardModule } from 'primeng/card';
import { TooltipModule } from 'primeng/tooltip';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { CommonModule } from '@angular/common';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';
import { ValidacionFormulariosService } from '../../service/validacion-formularios.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ButtonModule,
    CheckboxModule,
    InputTextModule,
    PasswordModule,
    ReactiveFormsModule,
    RouterModule,
    RippleModule,
    DividerModule,
    CardModule,
    TooltipModule,
    MessagesModule,
    MessageModule,
    CommonModule,
    AppFloatingConfigurator,
  ],
  template: `
    <app-floating-configurator />
    <div
      class="bg-gradient-to-b from-primary-50 to-surface-50 dark:from-primary-900/30 dark:to-surface-900 flex items-center justify-center min-h-screen min-w-screen overflow-hidden"
    >
      <div
        class="flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 w-full max-w-lg"
        style="perspective: 1000px"
      >
        <!-- Logo y card container -->
        <div
          class="w-full bg-white dark:bg-surface-800 rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1 relative"
          style="transform-style: preserve-3d; transform: rotateX(2deg) rotateY(0deg) translateZ(10px)"
        >
          <!-- Efecto de sombra para parecer flotante -->
          <div
            class="absolute inset-0 -z-10 bg-primary-200 dark:bg-primary-800 rounded-2xl translate-y-2 translate-x-2 opacity-20"
          ></div>

          <!-- Logo section -->
          <div
            class="bg-primary-500 dark:bg-primary-600 p-6 flex justify-center"
          >
            <svg
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="w-20 h-20"
            >
              <!-- Círculo exterior representando tecnología moderna -->
              <circle
                cx="50"
                cy="50"
                r="48"
                stroke="#ffffff"
                stroke-width="2"
                fill="none"
              />

              <!-- Forma de muela estilizada -->
              <path
                d="M35 30C35 30 38 25 50 25C62 25 65 30 65 30C65 30 68 35 68 45C68 60 65 75 60 75C55 75 53 65 50 65C47 65 45 75 40 75C35 75 32 60 32 45C32 35 35 30 35 30Z"
                fill="#ffffff"
                stroke="#ffffff"
                stroke-width="2"
              />

              <!-- Elementos tecnológicos - círculos dentro de la muela -->
              <circle cx="43" cy="40" r="3" fill="#ffffff" opacity="0.9" />
              <circle cx="57" cy="40" r="3" fill="#ffffff" opacity="0.9" />
              <circle cx="50" cy="55" r="3" fill="#ffffff" opacity="0.9" />

              <!-- Líneas tecnológicas a través de la muela -->
              <path
                d="M35 48H65"
                stroke="#ffffff"
                stroke-width="1.5"
                stroke-dasharray="3 2"
              />
              <path
                d="M38 60H62"
                stroke="#ffffff"
                stroke-width="1.5"
                stroke-dasharray="3 2"
              />

              <!-- Elemento tecnológico alrededor -->
              <path
                d="M25 50C25 36.2 36.2 25 50 25"
                stroke="#ffffff"
                stroke-width="1.5"
                stroke-dasharray="3 3"
                fill="none"
              />
              <path
                d="M75 50C75 63.8 63.8 75 50 75"
                stroke="#ffffff"
                stroke-width="1.5"
                stroke-dasharray="3 3"
                fill="none"
              />

              <!-- Pequeños elementos de dispositivos odontológicos modernos -->
              <rect
                x="72"
                y="45"
                width="6"
                height="10"
                rx="1"
                stroke="#ffffff"
                fill="none"
              />
              <rect
                x="22"
                y="45"
                width="6"
                height="10"
                rx="1"
                stroke="#ffffff"
                fill="none"
              />

              <!-- Destellos de luz que representan tecnología -->
              <path
                d="M26 30L29 33"
                stroke="#ffffff"
                stroke-width="1.5"
                stroke-linecap="round"
              />
              <path
                d="M74 30L71 33"
                stroke="#ffffff"
                stroke-width="1.5"
                stroke-linecap="round"
              />
              <path
                d="M74 70L71 67"
                stroke="#ffffff"
                stroke-width="1.5"
                stroke-linecap="round"
              />
              <path
                d="M26 70L29 67"
                stroke="#ffffff"
                stroke-width="1.5"
                stroke-linecap="round"
              />
            </svg>
          </div>

          <!-- Content section -->
          <div class="p-6 sm:p-8">
            <div class="text-center mb-8">
              <h1
                class="text-surface-900 dark:text-surface-0 text-2xl font-semibold mb-2"
              >
                ¡Bienvenido a DentiTech!
              </h1>
              <p class="text-muted-color text-sm">
                Inicia sesión para continuar
              </p>
            </div>

            <!-- Formulario con ReactiveFormsModule -->
            <form
              [formGroup]="loginForm"
              (ngSubmit)="onSubmit()"
              class="space-y-6"
            >
              <!-- Email field -->
              <div class="space-y-2">
                <label
                  for="email"
                  class="block text-surface-700 dark:text-surface-200 text-sm font-medium"
                  >Email</label
                >
                <span class="p-input-icon-left w-full">
                  <i class="pi pi-envelope text-muted-color"></i>
                  <input
                    pInputText
                    id="email"
                    type="email"
                    formControlName="email"
                    placeholder="correo@ejemplo.com"
                    class="w-full"
                    [ngClass]="{
                      'ng-invalid ng-dirty': isFieldInvalid('email')
                    }"
                  />
                </span>
                <small
                  *ngIf="
                    validacionService.obtenerErrorFormControl(
                      loginForm.get('email')
                    )
                  "
                  class="text-red-500"
                >
                  {{
                    validacionService.obtenerErrorFormControl(
                      loginForm.get('email')
                    )
                  }}
                </small>
              </div>

              <!-- Password field -->
              <div class="space-y-2">
                <div class="flex justify-between items-center">
                  <label
                    for="password"
                    class="block text-surface-700 dark:text-surface-200 text-sm font-medium"
                    >Contraseña</label
                  >
                  <a
                    class="text-xs text-primary-500 hover:text-primary-700 dark:hover:text-primary-300 transition-colors cursor-pointer"
                  >
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
                <span class="p-input-icon-left w-full">
                  <i class="pi pi-lock text-muted-color"></i>
                  <p-password
                    id="password"
                    formControlName="password"
                    placeholder="••••••••"
                    [toggleMask]="true"
                    styleClass="w-full"
                    [inputStyleClass]="'w-full pl-8'"
                    [feedback]="false"
                    [ngClass]="{
                      'ng-invalid ng-dirty': isFieldInvalid('password')
                    }"
                  ></p-password>
                </span>
                <small
                  *ngIf="
                    validacionService.passwordsIguales(
                      loginForm.get('password'),
                      loginForm.get('confirmPassword')
                    )
                  "
                  class="text-red-500"
                >
                  {{
                    validacionService.passwordsIguales(
                      loginForm.get('password'),
                      loginForm.get('confirmPassword')
                    )
                  }}
                </small>
              </div>

              <!-- Remember me option -->
              <div class="flex items-center ">
                <p-checkbox
                  formControlName="rememberMe"
                  inputId="rememberme"
                  binary
                  [style]="{ 'margin-right': '0.5rem' }"
                ></p-checkbox>
                <label
                  for="rememberme"
                  class="text-sm text-surface-600 dark:text-surface-300 cursor-pointer select-none"
                  >Recordarme</label
                >
              </div>

              <!-- Sign in button -->
              <p-button
                type="submit"
                label="Iniciar Sesión"
                icon="pi pi-sign-in"
                styleClass="w-full shadow-md mt-6"
                [rounded]="true"
                [disabled]="loginForm.invalid"
              ></p-button>
            </form>

            <!-- Register link -->
            <div class="mt-6 text-center">
              <span class="text-surface-600 dark:text-surface-400 text-sm"
                >¿No tienes una cuenta?</span
              >
              <a
                class="text-primary-500 hover:text-primary-700 dark:hover:text-primary-300 ml-1 text-sm font-medium cursor-pointer"
                >Regístrate</a
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class Login implements OnInit {
  loginForm!: FormGroup;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    public validacionService: ValidacionFormulariosService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false],
    });
  }

  isFieldInvalid(field: string): boolean {
    return this.submitted && (this.loginForm.get(field)?.invalid || false);
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.loginForm.valid) {
      // Aquí iría la lógica de autenticación
      console.log('Formulario válido', this.loginForm.value);
    } else {
      // Marcar todos los campos como touched para mostrar los errores
      Object.keys(this.loginForm.controls).forEach((key) => {
        const control = this.loginForm.get(key);
        control?.markAsTouched();
      });
    }
  }
}
