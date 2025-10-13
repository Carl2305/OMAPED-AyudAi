import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { ClassificationPrioritizationRoutingModule } from './classification-prioritization.routing.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ClassificationPrioritizationRoutingModule,
    SharedModule
  ]
})
export class ClassificationPrioritizationModule { }
