import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the OnOffPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'onOff'
})
export class OnOffPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: boolean, ...args) {
    let result = '';
    value ? (result = 'On') : (result = 'Off');
    return result;
  }
}
