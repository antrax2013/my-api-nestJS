import { Injectable } from '@nestjs/common';

@Injectable()
export class AppServiceDate {
  addDays(date: Date, days: number): Date {
    date.setDate(date.getDate() + days);
    return date;
  }

  addMonth(date: Date, months: number): Date {
    date.setMonth(date.getMonth() + months);
    return date;
  }
}
