import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportsAuditComponent } from './components/reports-audit/reports-audit.component';

export const routes: Routes = [
  {
    path: '',
    component: ReportsAuditComponent,
    title: 'Reportes y Auditoría - AyudAi'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsAuditRoutingModule { }
