import { DatePipe } from "@angular/common";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class DateService {

  constructor() { }

  public transformToLocaleDate(date: Date | string): Date {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Date(dateObj.getTime() - dateObj.getTimezoneOffset() * 60000);
  }

  public formatDate(date: Date) {
    const datePipe = new DatePipe('en-US');
    return datePipe.transform(date, 'MMMM dd, yyyy \'at\' hh:mm a');
  }

}
