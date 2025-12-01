/**
 * Message selection engine for personality-driven URL input
 */

import type { MoodType, BehaviorType, PatternType, MessageResult, InputState } from '../types/urlPersonality';
import messagesData from '../data/messages.json';

type MessagesData = typeof messagesData;

/**
 * Pick a random message from an array
 */
function random<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Select the appropriate message based on mood, pattern, and behavior
 * Priority: behavior-specific messages > invalid pattern messages > valid default messages
 */
export function pickMessage(
  mood: MoodType,
  pattern: PatternType,
  behavior: BehaviorType,
  parsed: URL | null
): MessageResult {
  const moodPack = messagesData[mood] as MessagesData[MoodType];

  // Priority 1: Behavior-specific messages (if available and not just "typing")
  if (behavior !== 'typing' && moodPack.behavior[behavior]) {
    const behaviorMessages = moodPack.behavior[behavior];
    if (behaviorMessages && behaviorMessages.length > 0) {
      return {
        message: random(behaviorMessages),
        mood,
        behavior,
        pattern,
        parsed,
      };
    }
  }

  // Priority 2: Invalid URL pattern messages
  if (!parsed && moodPack.invalid) {
    const invalidKey = pattern as keyof typeof moodPack.invalid;
    if (moodPack.invalid[invalidKey]) {
      const invalidMessages = moodPack.invalid[invalidKey];
      if (invalidMessages && invalidMessages.length > 0) {
        return {
          message: random(invalidMessages),
          mood,
          behavior,
          pattern,
          parsed,
        };
      }
    }
  }

  // Priority 3: Valid URL pattern messages (including special patterns)
  if (parsed && moodPack.valid) {
    const validKey = pattern as keyof typeof moodPack.valid;
    if (moodPack.valid[validKey]) {
      const validMessages = moodPack.valid[validKey];
      if (validMessages && validMessages.length > 0) {
        return {
          message: random(validMessages),
          mood,
          behavior,
          pattern,
          parsed,
        };
      }
    }
    // Fallback to default valid message
    if (moodPack.valid.default) {
      return {
        message: random(moodPack.valid.default),
        mood,
        behavior,
        pattern,
        parsed,
      };
    }
  }

  // Ultimate fallback (shouldn't happen with proper data structure)
  return {
    message: 'URL input detected.',
    mood,
    behavior,
    pattern,
    parsed,
  };
}

