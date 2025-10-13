import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { ReportsAuditRoutingModule } from './reports-audit.routing.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReportsAuditRoutingModule,
    SharedModule
  ]
})
export class ReportsAuditModule { }
