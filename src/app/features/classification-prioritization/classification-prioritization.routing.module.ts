import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClassificationPrioritizationComponent } from './components/classification-prioritization/classification-prioritization.component';

export const routes: Routes = [
  {
    path: '',
    component: ClassificationPrioritizationComponent,
    title: 'Clasificación y Priorización - AyudAi'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClassificationPrioritizationRoutingModule { }
