import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MATERIAL_MODULES } from '@shared/constans/material.constants';
import { COMPONENTS } from '@shared/constans/components.constants';
import { SERVICES } from '@shared/constans/services.constants';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,

    // Módulos de Material
    ...MATERIAL_MODULES,

    // Componentes reutilizables
    ...COMPONENTS,
  ],
  exports: [
    // Módulos base que otros módulos necesitarán
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,

    // Módulos de Material
    ...MATERIAL_MODULES,

    // Componentes reutilizables
    ...COMPONENTS,
  ],
  providers: [
    ...SERVICES
  ]
})
export class SharedModule { }
