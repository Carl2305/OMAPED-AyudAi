import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { GuestGuard } from './core/guards/guest.guard';
import { NgModule } from '@angular/core';
import { HomeComponent } from '@features/home/components/home/home.component';

export const routes: Routes = [
  // Redirección inicial
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  // Rutas de autenticación (usuarios no autenticados)
  {
    path: 'auth',
    component: AuthLayoutComponent,
    canActivate: [GuestGuard], // Solo usuarios no autenticados
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule),
    title: 'Autenticación - AyudAi'
  },
  // Rutas principales (usuarios autenticados)
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      // Dashboard/Home - Acceso básico para usuarios
      {
        path: 'home',
        component: HomeComponent,
        canActivate: [RoleGuard],
        title: 'Inicio - AyudAi',
        data: {
          roles: ['ADMIN', 'TSOCIAL', 'COORDINADOR', 'JEFE'],
          breadcrumb: 'Inicio',
        }
      },
      // Registro de Beneficiarios 
      {
        path: 'beneficiary-registration',
        loadChildren: () => import('./features/beneficiary-registration/beneficiary-registration.module').then(m => m.BeneficiaryRegistrationModule),
        canActivate: [RoleGuard],
        title: 'Registro de Beneficiarios - AyudAi',
        data: {
          roles: ['ADMIN', 'T-SOCIAL'],
          breadcrumb: 'Registro de Beneficiarios',
          //permissions: ['view_transactions'] //habilitar cuando se tenga el sistema de permisos
        }
      },
      // Clasificación y Priorización 
      {
        path: 'classification-prioritization',
        loadChildren: () => import('./features/classification-prioritization/classification-prioritization.module').then(m => m.ClassificationPrioritizationModule),
        canActivate: [RoleGuard],
        title: 'Clasificación y Priorización - AyudAi',
        data: {
          roles: ['ADMIN', 'T-SOCIAL', 'COORDINADOR'],
          breadcrumb: 'Clasificación y Priorización',
          //permissions: ['view_transactions'] //habilitar cuando se tenga el sistema de permisos
        }
      },
      // Reportes y Auditoría 
      {
        path: 'reports-audit',
        loadChildren: () => import('./features/reports-audit/reports-audit.module').then(m => m.ReportsAuditModule),
        canActivate: [RoleGuard],
        title: 'Reportes y Auditoría - AyudAi',
        data: {
          roles: ['ADMIN', 'COORDINADOR', 'JEFE'],
          breadcrumb: 'Reportes y Auditoría',
          //permissions: ['view_transactions'] //habilitar cuando se tenga el sistema de permisos
        }
      },
      // // Cuentas - Usuarios y Admins
      // {
      //   path: 'accounts',
      //   loadChildren: () => import('./features/accounts/accounts.module').then(m => m.AccountsModule),
      //   canActivate: [RoleGuard],
      //   title: 'Cuentas - Financial App',
      //   data: {
      //     roles: ['USER', 'ADMIN', 'MANAGER'],
      //     breadcrumb: 'Cuentas',
      //     permissions: ['view_accounts']
      //   }
      // },

      // // Reportes - Solo Admins y Managers
      // {
      //   path: 'reports',
      //   loadChildren: () => import('./features/reports/reports.module').then(m => m.ReportsModule),
      //   canActivate: [RoleGuard],
      //   title: 'Reportes - Financial App',
      //   data: {
      //     roles: ['ADMIN', 'MANAGER'],
      //     breadcrumb: 'Reportes',
      //     permissions: ['view_reports', 'generate_reports']
      //   }
      // },

      // // Administración - Solo Admins
      // {
      //   path: 'admin',
      //   loadChildren: () => import('./features/admin/admin.module').then(m => m.AdminModule),
      //   canActivate: [RoleGuard],
      //   title: 'Administración - Financial App',
      //   data: {
      //     roles: ['ADMIN'],
      //     breadcrumb: 'Administración',
      //     permissions: ['admin_access']
      //   }
      // },

      // // Perfil de usuario - Todos los usuarios autenticados
      // {
      //   path: 'profile',
      //   loadChildren: () => import('./features/profile/profile.module').then(m => m.ProfileModule),
      //   title: 'Mi Perfil - Financial App',
      //   data: {
      //     breadcrumb: 'Mi Perfil'
      //   }
      // },

      // // Configuraciones - Usuarios con permisos
      // {
      //   path: 'settings',
      //   loadChildren: () => import('./features/settings/settings.module').then(m => m.SettingsModule),
      //   canActivate: [RoleGuard],
      //   title: 'Configuraciones - Financial App',
      //   data: {
      //     roles: ['USER', 'ADMIN', 'MANAGER'],
      //     breadcrumb: 'Configuraciones'
      //   }
      // }
    ]
  },
  // Rutas de error y páginas especiales
  // {
  //   path: 'unauthorized',
  //   loadComponent: () => import('./shared/components/error/unauthorized/unauthorized.component')
  //     .then(c => c.UnauthorizedComponent),
  //   title: 'Acceso Denegado - Financial App'
  // },
  // {
  //   path: 'forbidden',
  //   redirectTo: '/unauthorized'
  // },
  // {
  //   path: '403',
  //   redirectTo: '/unauthorized'
  // },
  // Página no encontrada
  // {
  //   path: '404',
  //   loadComponent: () => import('./shared/components/error/not-found/not-found.component')
  //     .then(c => c.NotFoundComponent),
  //   title: 'Página No Encontrada - Financial App'
  // },
  // // Error del servidor
  // {
  //   path: '500',
  //   loadComponent: () => import('./shared/components/error/server-error/server-error.component')
  //     .then(c => c.ServerErrorComponent),
  //   title: 'Error del Servidor - Financial App'
  // },
  // Redirección para rutas no encontradas
  {
    path: '**',
    redirectTo: '/404'
  }
];


@NgModule({
  imports: [RouterModule.forRoot(routes, {
    preloadingStrategy: PreloadAllModules
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

