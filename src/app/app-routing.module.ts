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
    //canActivate: [GuestGuard], // Solo usuarios no autenticados
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule),
    title: 'Autenticación - AyudAi'
  },
  // Rutas principales (usuarios autenticados)
  {
    path: '',
    component: MainLayoutComponent,
    //canActivate: [AuthGuard],
    children: [
      // Dashboard/Home - Acceso básico para usuarios
      {
        path: 'home',
        //loadChildren: () => import('./features/home/home.module').then(m => m.HomeModule),
        component: HomeComponent,
        //canActivate: [RoleGuard],
        title: 'Inicio - AyudAi',
        data: {
          roles: ['USER'],
          breadcrumb: 'Inicio',
        }
      },
      // // Transacciones - Usuarios y Admins
      // {
      //   path: 'transactions',
      //   loadChildren: () => import('./features/transactions/transactions.module').then(m => m.TransactionsModule),
      //   canActivate: [RoleGuard],
      //   title: 'Transacciones - Financial App',
      //   data: {
      //     roles: ['USER', 'ADMIN', 'MANAGER'],
      //     breadcrumb: 'Transacciones',
      //     permissions: ['view_transactions']
      //   }
      // },
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

