import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditHistoryModalComponent } from './audit-history-modal.component';

describe('AuditHistoryModalComponent', () => {
  let component: AuditHistoryModalComponent;
  let fixture: ComponentFixture<AuditHistoryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuditHistoryModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AuditHistoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
