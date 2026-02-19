export class DateUtility {
  static isToday(date: string | Date): boolean {
    const dateObj = new Date(date);
    const today = new Date();
    return (
      dateObj.getDate() === today.getDate() &&
      dateObj.getMonth() === today.getMonth() &&
      dateObj.getFullYear() === today.getFullYear()
    );
  }

  static getCurrentWeekStart(): Date {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 6 = Saturday
    const diff = today.getDate() - dayOfWeek; // Days to subtract to get to Sunday
    const sunday = new Date(today);
    sunday.setDate(diff);
    sunday.setHours(0, 0, 0, 0);
    return sunday;
  }

  static getCurrentWeekEnd(): Date {
    const sunday = this.getCurrentWeekStart();
    const saturday = new Date(sunday);
    saturday.setDate(sunday.getDate() + 6);
    saturday.setHours(23, 59, 59, 999);
    return saturday;
  }

  static getWeekDays(): Date[] {
    const sunday = this.getCurrentWeekStart();
    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(sunday);
      day.setDate(sunday.getDate() + i);
      days.push(day);
    }
    return days;
  }

  static formatDayName(date: Date): string {
    const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
    return dayNames[date.getDay()];
  }

  static isSameDay(date1: Date | string, date2: Date | string): boolean {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return (
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear()
    );
  }

  static formatDateString(date: Date): string {
    return date.toISOString().split("T")[0];
  }
}
