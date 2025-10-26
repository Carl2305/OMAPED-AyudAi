import { Component, EventEmitter, OnDestroy, Output, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NgIf } from "@angular/common";
import { Subject } from 'rxjs';
import { FormsModule } from "@angular/forms";
import { RandomNumberService } from '@shared/utils/services/random-numer/random-number.service';
import { CodeCaptchaService } from '@shared/utils/services/code-captcha/code-captcha.service';
import { CodeCaptchaRequest } from '@core/models/auth/code-captcha.interface';

@Component({
  selector: 'app-code-captcha',
  standalone: true,
  imports: [NgIf, FormsModule],
  templateUrl: './code-captcha.component.html',
  styleUrl: './code-captcha.component.scss'
})
export class CodeCaptchaComponent implements OnDestroy, OnChanges {
  @Output() valueChange = new EventEmitter<boolean>();
  @Input() shouldLoad: boolean = false;

  loadedCodeCaptcha: boolean = false;
  urlImageCodeCaptcha?: string;
  loading: boolean = false;
  error: boolean = false;
  validCaptcha: boolean = false;
  valueCodeCaptcha?: string = '';
  tokenCaptcha?: string = '';
  private destroy$ = new Subject<void>();

  constructor(
    private codeCaptchaService: CodeCaptchaService,
  ) {  }

  ngOnChanges(changes: SimpleChanges): void {
    // Solo cargar cuando shouldLoad cambia a true
    if (changes['shouldLoad'] && changes['shouldLoad'].currentValue && !changes['shouldLoad'].previousValue) {
      this.loadCodeCaptcha();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.loadedCodeCaptcha = false;
    this.urlImageCodeCaptcha = undefined
  }

  onKeyPress(event: KeyboardEvent) {
    if(this.valueCodeCaptcha){
      setTimeout(() => {
        if(this.valueCodeCaptcha?.length == 4) {
          this.onCheckCodeCaptcha(this.valueCodeCaptcha!.toString());
        }
      }, 500); // Reducir el timeout para mejor UX
    }
  }

  reloadCodeCaptcha(): void {
    this.resetCodeCaptcha();
    this.loadCodeCaptcha();
  }

  private resetCodeCaptcha(): void {
    this.loading = false;
    this.error = false;
    this.validCaptcha = false;
    this.loadedCodeCaptcha = false;
    this.urlImageCodeCaptcha = undefined;
    this.valueCodeCaptcha = '';
    this.valueChange.emit(false); // Reset validation state
  }

  private loadCodeCaptcha(): void {
    this.loading = true;

    this.onLoadCodeCaptcha();
  }

  private async onLoadCodeCaptcha(): Promise<void> {
    try {
      const response = this.codeCaptchaService.getUrlCodeCaptcha();

      if (response) {
        this.urlImageCodeCaptcha = (await response).imageBase64;
        this.tokenCaptcha = (await response).token;
        this.loadedCodeCaptcha = true;
        console.log('Code Captcha loaded successfully');
      } else {
        console.warn('No code captcha data received');
      }
    } catch (error) {
      console.error('Code Captcha loading error:', error);
    } finally {
      this.loading = false;
      this.error = false;
    }
  }

  private async onCheckCodeCaptcha(code: string): Promise<void> {
    if (!code || code.length !== 4) {
      this.valueChange.emit(false);
      return;
    }

    this.loading = true;

    try {
      const request: CodeCaptchaRequest = {
        token: this.tokenCaptcha!,
        userInput: code.toLocaleUpperCase()
      };
      const response = await this.codeCaptchaService.postCheckCodeCaptcha(request);

      if (response) {
        this.validCaptcha = true;
        this.valueChange.emit(true);
      } else {
        this.validCaptcha = false;
        this.valueChange.emit(false);
        console.warn('Invalid captcha code');
      }
    } catch (error) {
      console.error('Code Captcha validation error:', error);
      this.validCaptcha = false;
      this.valueChange.emit(false);
    } finally {
      this.loading = false;
      this.error = !this.validCaptcha;
    }
  }

  toUppercase(ev: Event) {
    const el = ev.target as HTMLInputElement;
    const start = el.selectionStart, end = el.selectionEnd;
    el.value = (el.value ?? '').toUpperCase();
    if (start !== null && end !== null) el.setSelectionRange(start, end);
  }
}
