import { FooterComponent } from "@shared/components/layout/footer/footer.component";
import { HeaderComponent } from "@shared/components/layout/header/header.component";
import { SidebarComponent } from "@shared/components/layout/sidebar/sidebar.component";
import { ConfirmationDialogComponent } from "@shared/components/ui/confirmation-dialog/confirmation-dialog.component";
import { ErrorDisplayComponent } from "@shared/components/ui/error-display/error-display.component";
import { LoadingSpinnerComponent } from "@shared/components/ui/loading-spinner/loading-spinner.component";
import { KeyboardVirtualComponent } from '@shared/components/ui/keyboard-virtual/keyboard-virtual.component';
import { CodeCaptchaComponent } from '@shared/components/ui/code-captcha/code-captcha.component';
import { MenuComponent } from "@shared/components/layout/menu/menu.component";


export const COMPONENTS = [
  // UI Components
  LoadingSpinnerComponent,
  ConfirmationDialogComponent,
  ErrorDisplayComponent,
  KeyboardVirtualComponent,
  CodeCaptchaComponent,

  // Layout Components
  HeaderComponent,
  MenuComponent,
  SidebarComponent,
  FooterComponent


];
