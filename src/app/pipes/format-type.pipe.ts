import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatType'
})
export class FormatTypePipe implements PipeTransform {

  private typeToClass = [
    {type : '300x250', icon: 'icon-250', route: 'campaigns/formats/compose', class: 'formats-300_250'},
    {type : '300x600', icon: 'icon-600-intro', route: 'campaigns/formats/compose', class: 'formats-300_600'},
    {type : '300x600-split', icon: 'icon-600-splitscreen', route: 'campaigns/formats/compose', class: 'formats-300_600-split'},
    {type : '1800x1000', icon: 'icon-1000', route: 'campaigns/formats/compose', class: 'formats-1800x1000'},
    {type : '1910x1080', icon: 'icon-browser', route: 'campaigns/formats/1910x1080', class: 'formats-300_600'},
    {type : 'responsive', icon: 'icon-browser', route: 'campaigns/formats/compose', class: 'formats-responsive'},
    {type : '300x600-split-image', icon: 'icon-600-splitscreen', route: 'campaigns/formats/compose', class: 'formats-300x600-split-image'},
    {type : '300x600-split-video', icon: 'icon-600-splitscreen', route: 'campaigns/formats/compose', class: 'formats-300x600-split-video'},
    {type : '300x600-intro-image', icon: 'icon-browser', route: 'campaigns/formats/compose', class: 'formats-300x600-intro-image'}
  ];

  transform(value: string, type: string): string {
    if (!['300x250', 
          '300x600', 
          '300x600-split', 
          '1800x1000', 
          '1910x1080', 
          'responsive', 
          '300x600-split-image', 
          '300x600-split-video', 
          '300x600-intro-image'
        ].includes(value)) 
    {
      return (type === 'icon') ? 'icon-browser' : '';
    }
    const iconClass = this.typeToClass.filter(e => {
      return value ===  e.type;
    });
    return iconClass[0][type];
  }

}
