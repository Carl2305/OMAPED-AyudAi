import { TestBed } from '@angular/core/testing';
import { KeyboardVirtualService } from './keyboard-virtual.service';

describe('KeyboardVirtualService', () => {
  let service: KeyboardVirtualService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KeyboardVirtualService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
