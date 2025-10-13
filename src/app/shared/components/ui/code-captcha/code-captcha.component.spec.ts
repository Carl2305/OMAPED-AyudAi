import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CodeCaptchaComponent } from './code-captcha.component';

describe('CodeCaptchaComponent', () => {
  let component: CodeCaptchaComponent;
  let fixture: ComponentFixture<CodeCaptchaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodeCaptchaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CodeCaptchaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
