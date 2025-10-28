import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface DialogData {
  title: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error' | 'confirm';
  confirmText?: string;
  cancelText?: string;
  showCancel?: boolean;
  icon?: string;
}

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.scss'
})
export class ConfirmationDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    // Valores por defecto
    this.data.type = this.data.type || 'info';
    this.data.confirmText = this.data.confirmText || 'Aceptar';
    this.data.cancelText = this.data.cancelText || 'Cancelar';
    this.data.showCancel = this.data.showCancel !== undefined ? this.data.showCancel : true;
    
    // Asignar icono según el tipo si no se proporciona uno
    if (!this.data.icon) {
      this.data.icon = this.getDefaultIcon();
    }
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  getDefaultIcon(): string {
    switch (this.data.type) {
      case 'success':
        return 'fa-solid fa-check';
      case 'error':
        return 'fa-solid fa-xmark';
      case 'warning':
        return 'fa-solid fa-exclamation';
      case 'confirm':
        return 'fa-solid fa-check-double';
      case 'info':
      default:
        return 'fa-solid fa-info';
    }
  }

  getIconClass(): string {
    return `icon-${this.data.type}`;
  }
}
