import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeyboardVirtualComponent } from './keyboard-virtual.component';

describe('KeyboardVirtualComponent', () => {
  let component: KeyboardVirtualComponent;
  let fixture: ComponentFixture<KeyboardVirtualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KeyboardVirtualComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KeyboardVirtualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
