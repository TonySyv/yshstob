/**
 * Weekly mood system for personality-driven URL input
 */

import type { MoodType } from '../types/urlPersonality';

/**
 * Get the current mood based on the day of the week
 * Monday → sassy, Tuesday → bored, Wednesday → bruh, Thursday → bro,
 * Friday → party, Saturday → chill, Sunday → wholesome
 */
export function getCurrentMood(): MoodType {
  const day = new Date().getDay();

  switch (day) {
    case 0: // Sunday
      return 'wholesome';
    case 1: // Monday
      return 'sassy';
    case 2: // Tuesday
      return 'bored';
    case 3: // Wednesday
      return 'bruh';
    case 4: // Thursday
      return 'bro';
    case 5: // Friday
      return 'party';
    case 6: // Saturday
      return 'chill';
    default:
      return 'chill'; // Fallback
  }
}

