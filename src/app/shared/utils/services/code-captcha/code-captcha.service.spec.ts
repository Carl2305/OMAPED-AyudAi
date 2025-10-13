import { TestBed } from '@angular/core/testing';
import { CodeCaptchaService } from './code-captcha.service';

describe('CodeCaptchaService', () => {
  let service: CodeCaptchaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CodeCaptchaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
