import { NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { Key, KeyboardVirtualResponse } from '@core/models/auth/keyboard-virtual.interface';
import { KeyboardVirtualService } from '@shared/utils/services/keyboard-virtual/keyboard-virtual.service';
import { RandomNumberService } from '@shared/utils/services/random-numer/random-number.service';
import { Subject } from 'rxjs';

export interface KeyboardValueChangeEvent {
  keys: Key[];
  numericValue: string;
  code: number;
  device: number;
}

@Component({
  selector: 'app-keyboard-virtual',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './keyboard-virtual.component.html',
  styleUrl: './keyboard-virtual.component.scss'
})
export class KeyboardVirtualComponent implements OnDestroy {
  @Output() valueChange = new EventEmitter<KeyboardValueChangeEvent>();
  @Output() hideKeyboard = new EventEmitter<void>();

  loadedKeyboard: boolean = false;
  loading: boolean = false;
  value: Key[] = [];
  keyboard?: KeyboardVirtualResponse;
  passwordValue: string = '';
  codeKeyboard: number = 0;
  deviceKeyboard: number = 0;
  private readonly MAX_LENGTH = 6;
  private destroy$ = new Subject<void>();

  constructor(
    private randomNumberService: RandomNumberService,
    private keyboardVirtualService: KeyboardVirtualService
  ) {  }

  ngOnInit(): void {
    this.loadKeyboard();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.loadedKeyboard = false;
    this.keyboard = undefined;
  }

  reloadKeyboard(): void {
    this.resetKeyboard();
    this.loadKeyboard();
  }

  private resetKeyboard(): void {
    this.loadedKeyboard = false;
    this.loading = false;
    this.value = [];
    this.passwordValue = '';
    this.keyboard = undefined;
  }

  private loadKeyboard(): void {
    this.loading = true;

    this.randomNumberService.generateSecureRandom(1, 100)
      .then((result) => {
        if (result) {
          this.onLoadKeyboardVirtual(result);
        }
      })
      .catch((error) => {
        console.error('Error generating random number:', error);
        this.loading = false;
      });
  }

  onKeyPress(key: Key): void {
    if (this.value.length >= this.MAX_LENGTH) {
      return;
    }

    this.value.push(key);
    this.passwordValue += key.valor?.toString();
    this.emitValueChange();
  }

  onBackspace(): void {
    if (this.value.length > 0) {
      this.value.pop();
      this.passwordValue = this.passwordValue.slice(0, -1);
      this.emitValueChange();
    }
  }

  onClear(): void {
    this.value = [];
    this.passwordValue = '';
    this.emitValueChange();
  }

  onHideKeyboard(): void {
    this.hideKeyboard.emit();
  }

  private emitValueChange(): void {
    const eventData: KeyboardValueChangeEvent = {
      keys: [...this.value],
      numericValue: this.passwordValue,
      code: this.codeKeyboard,
      device: this.deviceKeyboard
    };
    this.valueChange.emit(eventData);
  }

  get canAddMoreCharacters(): boolean {
    return this.value.length < this.MAX_LENGTH;
  }

  get currentProgress(): string {
    return `${this.value.length}/${this.MAX_LENGTH}`;
  }

  private async onLoadKeyboardVirtual(request: number): Promise<void> {
    try {
      // Usar el método con reintentos automáticos
      const response = await this.keyboardVirtualService.getKeyboardVirtual(request);

      if (response && response.botones && response.botones.length > 0) {
        this.keyboard = response;
        this.codeKeyboard = response.codigo || 0;
        this.deviceKeyboard = response.dispositivo || 0;
        this.loadedKeyboard = true;
        console.log('Keyboard loaded successfully');
      } else {
        console.warn('No keyboard data received');
      }
    } catch (error) {
      console.error('Keyboard loading error:', error);
    } finally {
      this.loading = false;
    }
  }

}
