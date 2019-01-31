import { TestBed, inject } from '@angular/core/testing';

import { GoogleLoginService } from './google-login.service';

describe('GoogleLoginService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GoogleLoginService]
    });
  });

  it('should be created', inject([GoogleLoginService], (service: GoogleLoginService) => {
    expect(service).toBeTruthy();
  }));
});
