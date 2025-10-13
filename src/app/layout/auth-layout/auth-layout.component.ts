import { Component } from '@angular/core';
import { AuthService } from '@core/services/auth/auth.service';
import { Router } from '@angular/router';
import { SharedModule } from '@shared/shared.module';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.scss'
})
export class AuthLayoutComponent {
  currentYear = new Date().getFullYear();

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Redirigir si ya está autenticado
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/home']);
    }
  }
}
