import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassificationPrioritizationComponent } from './classification-prioritization.component';

describe('ClassificationPrioritizationComponent', () => {
  let component: ClassificationPrioritizationComponent;
  let fixture: ComponentFixture<ClassificationPrioritizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassificationPrioritizationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassificationPrioritizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
