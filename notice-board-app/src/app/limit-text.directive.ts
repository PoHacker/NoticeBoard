import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appLimitText]'
})
export class LimitTextDirective {

  constructor(el: ElementRef) {
  }

}
