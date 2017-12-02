import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the PullPeriodPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'pullPeriod'
})
export class PullPeriodPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: number, ...args) {
    let result = '';
    switch (value) {
      case 300:
        return (result = value.toString().concat(' milliSeconds'));
      case 1:
        return (result = value.toString().concat(' second'));
      default:
        return (result = value.toString().concat(' seconds'));
    }
  }
}
