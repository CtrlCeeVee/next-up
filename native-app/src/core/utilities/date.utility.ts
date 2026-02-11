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
}
