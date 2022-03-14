import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderBy'
})
export class OrderByPipe implements PipeTransform {

  transform(value: any[], col = '', dir = 'ASC'): any {
    if (!value) { return []; }
    if (col === '') {
      return value.sort();
    } else {
      return value.sort((a, b) => {
        if (a[col] < b[col]) { return dir === 'ASC' ? -1 : 1; }
        if (a[col] > b[col]) { return dir === 'ASC' ? 1 : -1; }
        return 0;
      });
    }
    return null;
  }

}
