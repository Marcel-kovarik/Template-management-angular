import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'creationType'
})
export class CreationTypePipe implements PipeTransform {

  private typeToClass = [
    {type : 'CREAPUB', icon: 'icon-crea_pub', route: 'campaigns/formats/edit'},
    {type : 'ASSISTANT', icon: 'icon-assistants', route: 'campaign/assistant'},
    {type : 'VOICECOMM', icon: 'icon-voicecomm2', route: 'campaign/voice-commerce'},
    {type : 'SPC', icon: 'icon-speak', route: 'campaigns/speak-and-collect'},
  ];

  transform(value: string, type: string): string {
    if (!['CREAPUB', 'ASSISTANT', 'VOICECOMM', 'SPC'].includes(value.toUpperCase())) {
      return '';
    }
    const iconClass = this.typeToClass.filter(e => {
      return value.toUpperCase().indexOf(e.type) > -1;
    });
    return iconClass[0][type];
  }

}
