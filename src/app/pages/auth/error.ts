import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';

@Component({
  selector: 'app-error',
  imports: [ButtonModule, RippleModule, RouterModule, AppFloatingConfigurator],
  standalone: true,
  template: `
    <app-floating-configurator />
    <div class="bg-gradient-to-b from-surface-100 to-surface-50 dark:from-surface-900 dark:to-surface-800 flex items-center justify-center min-h-screen min-w-screen overflow-hidden">
      <div class="flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 w-full max-w-xl">
        <!-- Card container con efecto de flotar -->
        <div class="w-full bg-white dark:bg-surface-800 rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1 relative" style="transform-style: preserve-3d; transform: rotateX(1deg) translateZ(10px)">
          <!-- Efecto de sombra para parecer flotante -->
          <div class="absolute inset-0 -z-10 bg-pink-200 dark:bg-pink-900 rounded-2xl translate-y-2 translate-x-2 opacity-20"></div>
          
          <!-- Contenido del error -->
          <div class="p-8 flex flex-col items-center">
            <!-- Ícono de error con efecto pulsante -->
            <div class="relative mb-6">
              <div class="absolute inset-0 bg-pink-500 rounded-full opacity-20 animate-ping"></div>
              <div class="flex justify-center items-center border-2 border-pink-500 rounded-full bg-white dark:bg-surface-900 z-10 relative" style="height: 4rem; width: 4rem">
                <i class="pi pi-exclamation-triangle text-pink-500 text-3xl"></i>
              </div>
            </div>
            
            <!-- Textos de error -->
            <h1 class="text-surface-900 dark:text-surface-0 font-bold text-4xl md:text-5xl mb-3 text-center">Oops! Error</h1>
            <p class="text-surface-600 dark:text-surface-400 text-center mb-8">
              Lo sentimos, el recurso solicitado no está disponible.
            </p>
            
            <!-- Ilustración de error -->
            <div class="w-full max-w-md mb-8 px-4 py-6 bg-surface-50/50 dark:bg-surface-900/50 rounded-xl">
              <img 
                src="https://primefaces.org/cdn/templates/sakai/auth/asset-error.svg" 
                alt="Error Illustration" 
                class="w-full h-auto"
              />
            </div>
            
            <!-- Botones de acción -->
            <div class="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <p-button 
                label="Volver al inicio" 
                icon="pi pi-home" 
                routerLink="/" 
                severity="danger" 
                [rounded]="true"
                styleClass="shadow-md"
              ></p-button>
              
              <p-button 
                label="Intentar nuevamente" 
                icon="pi pi-refresh" 
                severity="secondary" 
                [outlined]="true"
                [rounded]="true"
                styleClass="shadow-sm"
                (click)="refreshPage()"
              ></p-button>
            </div>
            
            <!-- Código de error -->
            <div class="mt-8 text-surface-500 dark:text-surface-400 text-sm">
              Código de error: <span class="font-mono">404_NOT_FOUND</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class Error {
  refreshPage(): void {
    window.location.reload();
  }
}
