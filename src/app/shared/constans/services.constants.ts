import { AuditLoggerService } from '@shared/utils/services/audit-logger/audit-logger.service';
import { SecureStorageService } from '@shared/utils/services/storage/secure-storage.service';
import { RandomNumberService } from '@shared/utils/services/random-numer/random-number.service';
import { LoadingSpinnerService } from '@shared/utils/services/loading-spinner/loading-spinner.service';
import { KeyboardVirtualService } from '@shared/utils/services/keyboard-virtual/keyboard-virtual.service';
import { CodeCaptchaService } from '@shared/utils/services/code-captcha/code-captcha.service';

export const SERVICES = [
  RandomNumberService,
  LoadingSpinnerService,
  KeyboardVirtualService,
  CodeCaptchaService,
  AuditLoggerService,
  SecureStorageService
  // ErrorHandlerService,
  // NotificationService,
  // ValidationService,
  // UtilsService
];

