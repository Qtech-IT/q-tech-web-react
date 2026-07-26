//============================================================================
// FILE: resources/js/Lib/date.ts
// Date Utility Functions
// ============================================================================

import { format, parseISO, formatDistanceToNow, isValid, differenceInDays, addDays, subDays } from 'date-fns';

/**
 * Format date to readable string
 */
export function formatDate(date: string | Date, formatStr: string = 'MMM dd, yyyy'): string {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return isValid(dateObj) ? format(dateObj, formatStr) : 'Invalid date';
  } catch {
    return 'Invalid date';
  }
}

/**
 * Format datetime
 */
export function formatDateTime(date: string | Date): string {
  return formatDate(date, 'MMM dd, yyyy HH:mm');
}

/**
 * Format time only
 */
export function formatTime(date: string | Date): string {
  return formatDate(date, 'HH:mm:ss');
}

/**
 * Get relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: string | Date): string {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return isValid(dateObj) ? formatDistanceToNow(dateObj, { addSuffix: true }) : 'Invalid date';
  } catch {
    return 'Invalid date';
  }
}

/**
 * Check if date is today
 */
export function isToday(date: string | Date): boolean {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const today = new Date();
  return (
    dateObj.getDate() === today.getDate() &&
    dateObj.getMonth() === today.getMonth() &&
    dateObj.getFullYear() === today.getFullYear()
  );
}

/**
 * Get days difference between two dates
 */
export function getDaysDifference(date1: string | Date, date2: string | Date): number {
  const d1 = typeof date1 === 'string' ? parseISO(date1) : date1;
  const d2 = typeof date2 === 'string' ? parseISO(date2) : date2;
  return differenceInDays(d1, d2);
}

/**
 * Add days to date
 */
export function addDaysToDate(date: string | Date, days: number): Date {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return addDays(dateObj, days);
}

/**
 * Subtract days from date
 */
export function subtractDaysFromDate(date: string | Date, days: number): Date {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return subDays(dateObj, days);
}

/**
 * Format date for input field
 */
export function formatDateForInput(date: string | Date): string {
  return formatDate(date, 'yyyy-MM-dd');
}

/**
 * Format datetime for input field
 */
export function formatDateTimeForInput(date: string | Date): string {
  return formatDate(date, "yyyy-MM-dd'T'HH:mm");
}