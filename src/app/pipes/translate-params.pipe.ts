import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'transParams'
})
export class TranslateParamsPipe implements PipeTransform {

  transform(value: string, keys: object): string {
    Object.keys(keys).forEach( e => {
      const regex = new RegExp('{{' + e.toUpperCase() + '}}', 'ig');
      value = value.replace(regex, keys[e]);
    });
    return value;
  }

}
