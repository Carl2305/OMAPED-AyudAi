import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationDialogComponent, DialogData } from '@shared/components/ui/confirmation-dialog/confirmation-dialog.component';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfirmationDialogService {

  constructor(private dialog: MatDialog) { }

  /**
   * Abre un diálogo de confirmación personalizado
   * @param data Datos del diálogo
   * @returns Observable con el resultado (true/false)
   */
  openDialog(data: DialogData): Observable<boolean> {
    const dialogRef: MatDialogRef<ConfirmationDialogComponent> = this.dialog.open(
      ConfirmationDialogComponent,
      {
        width: '500px',
        maxWidth: '90vw',
        panelClass: 'custom-dialog-container',
        disableClose: false,
        autoFocus: true,
        data: data
      }
    );

    return dialogRef.afterClosed();
  }

  /**
   * Muestra un diálogo de información
   */
  showInfo(title: string, message: string, confirmText: string = 'Aceptar'): Observable<boolean> {
    return this.openDialog({
      title,
      message,
      type: 'info',
      confirmText,
      showCancel: false
    });
  }

  /**
   * Muestra un diálogo de éxito
   */
  showSuccess(title: string, message: string, confirmText: string = 'Aceptar'): Observable<boolean> {
    return this.openDialog({
      title,
      message,
      type: 'success',
      confirmText,
      showCancel: false
    });
  }

  /**
   * Muestra un diálogo de advertencia
   */
  showWarning(title: string, message: string, confirmText: string = 'Entendido'): Observable<boolean> {
    return this.openDialog({
      title,
      message,
      type: 'warning',
      confirmText,
      showCancel: false
    });
  }

  /**
   * Muestra un diálogo de error
   */
  showError(title: string, message: string, confirmText: string = 'Cerrar'): Observable<boolean> {
    return this.openDialog({
      title,
      message,
      type: 'error',
      confirmText,
      showCancel: false
    });
  }

  /**
   * Muestra un diálogo de confirmación
   */
  showConfirm(
    title: string, 
    message: string, 
    confirmText: string = 'Confirmar',
    cancelText: string = 'Cancelar'
  ): Observable<boolean> {
    return this.openDialog({
      title,
      message,
      type: 'confirm',
      confirmText,
      cancelText,
      showCancel: true
    });
  }

  /**
   * Muestra un diálogo de eliminación
   */
  showDelete(
    title: string = '¿Eliminar elemento?',
    message: string = 'Esta acción no se puede deshacer.',
    confirmText: string = 'Eliminar',
    cancelText: string = 'Cancelar'
  ): Observable<boolean> {
    return this.openDialog({
      title,
      message,
      type: 'error',
      confirmText,
      cancelText,
      showCancel: true,
      icon: 'delete_forever'
    });
  }
}
