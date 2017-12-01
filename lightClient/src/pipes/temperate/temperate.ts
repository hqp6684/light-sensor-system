import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the TemperatePipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'temperature'
})
export class TemperatePipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: number, type: string) {
    let result = '';
    switch (type) {
      case 'f':
        value = value * 9 / 5 + 32;
        result = value.toFixed(2).concat(' F');
        break;
      case 'c':
      default:
        result = value.toFixed(2).concat(' C');
    }

    return result;
  }
}
