import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'secToTime'
})
export class SecToTimePipe implements PipeTransform {

  transform(value: any): string {
    let pad = function(num, size) { return ('000' + num).slice(size * -1); };
    // let time = parseFloat(value).toFixed(3);
    // let hours = Math.floor(time / 60 / 60);
    let minutes = Math.floor(value / 60) % 60;
    // let seconds = Math.floor(time - minutes * 60);
    // let milliseconds = time.slice(-3);
    return pad(minutes, 2) + ':' + pad(value - (minutes*60), 2);
  }

}
