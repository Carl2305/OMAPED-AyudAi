// home.component.ts - OMAPED Dashboard
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface Estadistica {
  titulo: string;
  valor: number | string;
  icono: string;
  color: string;
  descripcion: string;
  cambio?: string;
}

interface ActividadReciente {
  id: number;
  nombreCompleto: string;
  tipoDiscapacidad: string;
  fechaRegistro: Date;
  registrador: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  // Estadísticas principales de OMAPED
  estadisticas: Estadistica[] = [
    {
      titulo: 'Total Beneficiarios',
      valor: 1247,
      icono: 'users',
      color: '#2563eb',
      descripcion: 'Registrados en el sistema',
      cambio: '+12% este mes',
    },
    {
      titulo: 'Registros del Mes',
      valor: 156,
      icono: 'user-plus',
      color: '#10b981',
      descripcion: 'Nuevos beneficiarios',
      cambio: '+23 esta semana',
    },
    {
      titulo: 'Con Carnet CONADIS',
      valor: 892,
      icono: 'award',
      color: '#f59e0b',
      descripcion: 'Certificados activos',
      cambio: '71.5% del total',
    },
    {
      titulo: 'Departamento Piura',
      valor: 735,
      icono: 'map-pin',
      color: '#8b5cf6',
      descripcion: 'Beneficiarios locales',
      cambio: '58.9% del total',
    },
  ];

  // Actividad reciente (últimos registros)
  actividadReciente: ActividadReciente[] = [
    {
      id: 1,
      nombreCompleto: 'Juan Carlos Pérez García',
      tipoDiscapacidad: 'Física o motora',
      fechaRegistro: new Date(Date.now() - 5 * 60000), // hace 5 minutos
      registrador: 'María López',
    },
    {
      id: 2,
      nombreCompleto: 'Ana María Torres Ruiz',
      tipoDiscapacidad: 'Visual',
      fechaRegistro: new Date(Date.now() - 1 * 60 * 60000), // hace 1 hora
      registrador: 'Carlos Mendoza',
    },
    {
      id: 3,
      nombreCompleto: 'Luis Alberto Sánchez',
      tipoDiscapacidad: 'Auditiva',
      fechaRegistro: new Date(Date.now() - 2 * 60 * 60000), // hace 2 horas
      registrador: 'Patricia Gómez',
    },
    {
      id: 4,
      nombreCompleto: 'Rosa Elena Campos',
      tipoDiscapacidad: 'Intelectual',
      fechaRegistro: new Date(Date.now() - 4 * 60 * 60000), // hace 4 horas
      registrador: 'Roberto Andrade',
    },
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    // Aquí irá la llamada al servicio para obtener datos reales
    // this.omapedService.getEstadisticas().subscribe(...)
  }

  // Métodos de utilidad
  formatearTiempoTranscurrido(fecha: Date): string {
    const ahora = new Date();
    const diff = ahora.getTime() - fecha.getTime();
    const minutos = Math.floor(diff / 60000);
    const horas = Math.floor(diff / 3600000);
    const dias = Math.floor(diff / 86400000);

    if (minutos < 60) {
      return `Hace ${minutos} min`;
    } else if (horas < 24) {
      return `Hace ${horas} hora${horas > 1 ? 's' : ''}`;
    } else {
      return `Hace ${dias} día${dias > 1 ? 's' : ''}`;
    }
  }

  // Acciones rápidas
  registrarNuevoBeneficiario(): void {
    this.router.navigate(['/registro-beneficiarios']);
  }

  buscarBeneficiario(): void {
    this.router.navigate(['/buscar']);
  }

  verReportes(): void {
    this.router.navigate(['/reportes']);
  }

  exportarDatos(): void {
    console.log('Exportando datos...');
    // Implementar lógica de exportación
  }

  verDetalleBeneficiario(id: number): void {
    this.router.navigate(['/beneficiario', id]);
  }
}
