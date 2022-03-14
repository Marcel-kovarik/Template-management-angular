import { Pipe, PipeTransform } from '@angular/core';
import { ResourceSpec } from '../classes/resource-spec';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'checklist'
})
export class ChecklistPipe implements PipeTransform {

  constructor(private translate: TranslateService) {
  }

  transform(value: ResourceSpec, type: string): string {
    if (type === 'size') {
      return (value.child ? '' : (value.width !== 0 ? value.width + ' x ' + value.height + 'px' : '-'));
    }
    if (type === 'weight') {
      return (value.child ? '' : (value.maxWeight !== 0 ? 'Max ' + value.maxWeight + ' kb' : '-'));
    }
    if (type === 'type') {
      switch (value.resourceType) {
        case 'IMAGE':
          return (value.child ? this.translate.instant('ADD_IMG') : 'jpg, svg, png');
        case 'VIDEO':
          return 'MP4';
        case 'BGIMAGE':
          return 'jpg, gif, png';
        case 'COLOR':
          return this.translate.instant('COLOR_HEX');
        default:
          return '-';
      }
    }
  }
}
