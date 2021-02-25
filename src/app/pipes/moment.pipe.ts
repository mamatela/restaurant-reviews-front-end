import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({ name: 'humanize' })
export class MomentHumanizePipe implements PipeTransform {
    transform(value: Date | moment.Moment): string {
      let startDate = moment(value), endDate = moment();
      return moment.duration(endDate.diff(startDate)).humanize();
    }
}