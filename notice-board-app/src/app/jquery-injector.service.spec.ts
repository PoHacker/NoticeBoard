import { TestBed, inject } from '@angular/core/testing';

import { JqueryInjectorService } from './jquery-injector.service';

describe('JqueryInjectorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [JqueryInjectorService]
    });
  });

  it('should be created', inject([JqueryInjectorService], (service: JqueryInjectorService) => {
    expect(service).toBeTruthy();
  }));
});
