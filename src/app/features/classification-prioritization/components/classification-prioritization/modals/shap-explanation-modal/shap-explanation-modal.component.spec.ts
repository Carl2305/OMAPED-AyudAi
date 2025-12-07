import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShapExplanationModalComponent } from './shap-explanation-modal.component';

describe('ShapExplanationModalComponent', () => {
  let component: ShapExplanationModalComponent;
  let fixture: ComponentFixture<ShapExplanationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShapExplanationModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShapExplanationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
