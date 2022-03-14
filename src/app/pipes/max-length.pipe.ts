import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'maxLength'
})
export class MaxLengthPipe implements PipeTransform {

  transform(value: string, len = 30, split = 'split'): unknown {
    if (value === null || value === '') {
      return value;
    }
    let str = value;
    if (value.length > len) {
      if (split === 'split') {
        len = len / 2 - 2;
        str = value.substr(0, len) + '[...]' + value.substr(value.length - len);
      }
      if (split === 'start') {
        str = value.substr(0, len);
      }

      if (split === 'end') {
        str = value.substr(value.length - len);
      }
    }
    return str;
  }

}
