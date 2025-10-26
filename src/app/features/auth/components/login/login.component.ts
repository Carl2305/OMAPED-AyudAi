import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@core/services/auth/auth.service';
import { finalize, Subject, takeUntil } from 'rxjs';
import { SharedModule } from '@shared/shared.module';
import { KeyboardValueChangeEvent, KeyboardVirtualComponent } from '@shared/components/ui/keyboard-virtual/keyboard-virtual.component';
import { Key } from '@core/models/auth/keyboard-virtual.interface';
import { CodeCaptchaComponent } from '@shared/components/ui/code-captcha/code-captcha.component';
import { LoginRequest } from '@core/models/auth/auth.interface';
import { UserService } from '@core/services/auth/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  @ViewChild(KeyboardVirtualComponent) keyboardComponent!: KeyboardVirtualComponent;
  @ViewChild(CodeCaptchaComponent) codeCaptchaComponent!: CodeCaptchaComponent;

  loginForm: FormGroup;
  loading = false;
  error: string | null = null;
  showPassword = false;
  returnUrl = '';
  showKeyboard = false;
  selectedKeys: Key[] = [];
  passwordNumericValue: string = '';
  codeKeyboard: number = 0;
  deviceKeyboard: number = 0;
  validCaptcha: boolean = false;
  //private destroy$ = new Subject<void>();

  showCodeCaptcha = false;
  shouldLoadCaptcha = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Redirigir si ya está logueado
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/home']);
    }

    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });
  }

  ngOnInit(): void {
    // Obtener URL de retorno
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
  }

  ngOnDestroy(): void {
    // this.destroy$.next();
    // this.destroy$.complete();
  }

  onPasswordInputClick(): void {
    this.showPassword = false;
    this.loginForm.patchValue({ password: '' });
    this.showKeyboard = true;
    this.loadVirtualKeyboard();
    this.showCodeCaptcha = false;
    this.shouldLoadCaptcha = false; // Reset captcha
    this.validCaptcha = false;
  }

  private loadVirtualKeyboard(): void {
    // Forzar la recarga del componente del teclado virtual
    if (this.keyboardComponent) {
      this.keyboardComponent.reloadKeyboard();
      this.showCodeCaptcha = false;
      this.shouldLoadCaptcha = false;
    }
  }

  onKeyboardValueChange(event: KeyboardValueChangeEvent): void {
    // Reset captcha cuando cambia la contraseña
    this.showCodeCaptcha = false;
    this.shouldLoadCaptcha = false;
    this.validCaptcha = false;

    // Almacenar tanto las keys como el valor numérico
    this.selectedKeys = event.keys;
    this.passwordNumericValue = event.numericValue;
    this.codeKeyboard = event.code;
    this.deviceKeyboard = event.device;

    // Actualizar el formulario solo con el valor numérico para mostrar en el input
    this.loginForm.patchValue({
      password: this.passwordNumericValue
    });

    // Habilitar el campo password si tiene valor
    if (this.passwordNumericValue && this.loginForm.get('password')?.disabled) {
      this.loginForm.get('password')?.enable();
    }

    // Mostrar y cargar captcha automáticamente cuando llegue a 6 caracteres
    if (this.passwordNumericValue.length === 6) {
      this.loginForm.get('password')?.updateValueAndValidity();
      this.showCodeCaptcha = true;
      this.shouldLoadCaptcha = true; // Activar la carga del captcha
    }
  }

  onCodeCaptchaValueChange(event: boolean): void {
    this.validCaptcha = event;
  }

  onKeyboardHide(): void {
    this.showKeyboard = false;
    this.showCodeCaptcha = false;
    this.shouldLoadCaptcha = false;
  }

  async onSubmit(): Promise<void>{
    // Validar que el captcha esté válido antes de proceder
    if (this.loginForm.valid && this.validCaptcha) {
      this.loading = true;
      this.error = null;

      const loginData : LoginRequest = {
        documento: this.loginForm.get('username')?.value,
        codigo: this.codeKeyboard,
        dispositivo: this.deviceKeyboard,
        botones: this.selectedKeys.map(k => k.codigoHash!)
      };

      const response_login = await this.authService.login(loginData).finally(() => this.loading = false);

      if (response_login.success && response_login.data?.accessToken) {
        console.log(response_login);
        
        const userResponse = await this.userService.getUsuarioInfo(this.authService.decodeToken(response_login.data.accessToken)!.sub!);
        if (userResponse.success && userResponse.data) {
          this.authService['secureStorage'].setItem('current_user', JSON.stringify(userResponse.data));
          this.router.navigate([this.returnUrl]);
        } else{
          this.error = 'Error al obtener la información del usuario';
          return;
        }  
      } else {
        this.error = response_login.message || 'Error en el inicio de sesión';
      }

    } else {
      if (!this.validCaptcha && this.passwordNumericValue.length === 6) {
        this.error = 'Por favor, complete la validación del captcha';
      }
      this.markFormGroupTouched();
    }

    setTimeout(() => {
      this.error = null;
    }, 3000);
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      this.loginForm.get(key)?.markAsTouched();
    });
  }

  // Getters para facilitar el acceso en el template
  get username() { return this.loginForm.get('username'); }
  get password() { return this.loginForm.get('password'); }
}
