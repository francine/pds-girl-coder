import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';

dayjs.extend(utc);
dayjs.extend(timezone);

export function toUserTimezone(date: Date, userTimezone: string): string {
  return dayjs(date).tz(userTimezone).format();
}

export function toUTC(date: Date | string): Date {
  return dayjs(date).utc().toDate();
}

export function startOfWeek(date: Date = new Date(), userTimezone?: string): Date {
  if (userTimezone) {
    return dayjs(date).tz(userTimezone).startOf('week').add(1, 'day').utc().toDate(); // Monday
  }
  return dayjs(date).utc().startOf('week').add(1, 'day').toDate(); // Monday
}

export function endOfWeek(date: Date = new Date(), userTimezone?: string): Date {
  if (userTimezone) {
    return dayjs(date).tz(userTimezone).endOf('week').add(1, 'day').utc().toDate(); // Sunday
  }
  return dayjs(date).utc().endOf('week').add(1, 'day').toDate(); // Sunday
}

export function startOfDay(date: Date = new Date(), userTimezone?: string): Date {
  if (userTimezone) {
    return dayjs(date).tz(userTimezone).startOf('day').utc().toDate();
  }
  return dayjs(date).utc().startOf('day').toDate();
}

export function endOfDay(date: Date = new Date(), userTimezone?: string): Date {
  if (userTimezone) {
    return dayjs(date).tz(userTimezone).endOf('day').utc().toDate();
  }
  return dayjs(date).utc().endOf('day').toDate();
}

export function isToday(date: Date, userTimezone?: string): boolean {
  const today = dayjs();
  const target = dayjs(date);

  if (userTimezone) {
    return today.tz(userTimezone).isSame(target.tz(userTimezone), 'day');
  }
  return today.isSame(target, 'day');
}

export function isTomorrow(date: Date, userTimezone?: string): boolean {
  const tomorrow = dayjs().add(1, 'day');
  const target = dayjs(date);

  if (userTimezone) {
    return tomorrow.tz(userTimezone).isSame(target.tz(userTimezone), 'day');
  }
  return tomorrow.isSame(target, 'day');
}
