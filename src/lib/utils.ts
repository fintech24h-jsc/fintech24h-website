import { type ClassValue, clsx } from 'clsx';
import { PureComponent } from 'react';
import { twMerge } from 'tailwind-merge';

/**
 * Merges class names with tailwind-merge and clsx
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats clean numbers to standard abbreviations (e.g. 1000 -> 1.0k)
 */
export function formatCompactNumber(number: number): string {
  if (number < 1000) return String(number);
  const formatter = Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 });
  return formatter.format(number);
}

/**
 * Returns estimated reading time for a text block in minutes
 */
export function getReadingTime(text: string): number {
  const wordsPerMinute = 225;
  const words = text.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}
