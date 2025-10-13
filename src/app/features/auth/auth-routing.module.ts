import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { TwoFactorAuthComponent } from './components/two-factor-auth/two-factor-auth.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'Iniciar Sesión - AyudAi',
    data: {
      animation: 'LoginPage'
    }
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    title: 'Recuperar Contraseña - AyudAi',
    data: {
      animation: 'ForgotPasswordPage'
    }
  },
  {
    path: 'reset-password/:token',
    component: ResetPasswordComponent,
    // canActivate: [ResetTokenGuard], // Descomenta cuando tengas el guard
    title: 'Restablecer Contraseña - AyudAi',
    data: {
      animation: 'ResetPasswordPage'
    }
  },
  {
    path: 'two-factor',
    component: TwoFactorAuthComponent,
    title: 'Verificación en Dos Pasos - AyudAi',
    data: {
      animation: 'TwoFactorPage',
      requiresPartialAuth: true
    }
  },
  {
    path: 'logout',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
