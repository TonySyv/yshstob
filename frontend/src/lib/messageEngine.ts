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
 * Combine multiple messages gracefully
 * Creates natural-sounding combinations instead of just concatenating
 */
function combineMessages(
  messages: string[],
  mood: MoodType
): string {
  if (messages.length === 0) return '';
  if (messages.length === 1) return messages[0];

  // For 2 messages, use natural connectors
  if (messages.length === 2) {
    const connectors: Record<MoodType, string[]> = {
      sassy: [' Also,', ' Plus,', ' And', ' Oh, and'],
      bored: [' Also,', ' Plus,', ' And'],
      bruh: [' Also,', ' Bruh,', ' And'],
      bro: [' Also,', ' Plus,', ' And'],
      party: [' ALSO!', ' PLUS!', ' AND'],
      chill: [' Also,', ' Plus,', ' And'],
      wholesome: [' Also,', ' Plus,', ' And'],
    };
    const connector = random(connectors[mood] || [' Also,']);
    // Lowercase the second message but preserve first letter capitalization if it's a proper sentence
    const secondMsg = messages[1].charAt(0).toLowerCase() + messages[1].slice(1);
    return `${messages[0]}${connector} ${secondMsg}`;
  }

  // For 3+ messages, combine first two, then add rest
  let combined = combineMessages([messages[0], messages[1]], mood);
  for (let i = 2; i < messages.length; i++) {
    const connectors: Record<MoodType, string[]> = {
      sassy: [' Also,', ' Plus,', ' And'],
      bored: [' Also,', ' Plus,', ' And'],
      bruh: [' Also,', ' Bruh,', ' And'],
      bro: [' Also,', ' Plus,', ' And'],
      party: [' ALSO!', ' PLUS!', ' AND'],
      chill: [' Also,', ' Plus,', ' And'],
      wholesome: [' Also,', ' Plus,', ' And'],
    };
    const connector = random(connectors[mood] || [' Also,']);
    const nextMsg = messages[i].charAt(0).toLowerCase() + messages[i].slice(1);
    combined += `${connector} ${nextMsg}`;
  }

  return combined;
}

/**
 * Select the appropriate message based on mood, pattern, and behaviors
 * Priority: behavior-specific messages > invalid pattern messages > valid default messages
 * Can combine multiple behavior messages gracefully
 */
export function pickMessage(
  mood: MoodType,
  pattern: PatternType,
  behaviors: BehaviorType[],
  parsed: URL | null
): MessageResult {
  const moodPack = messagesData[mood] as MessagesData[MoodType];
  const behaviorMessages: string[] = [];

  // Priority 1: Collect behavior-specific messages (excluding "typing")
  const nonTypingBehaviors = behaviors.filter(b => b !== 'typing');
  
  for (const behavior of nonTypingBehaviors) {
    if (moodPack.behavior[behavior]) {
      const messages = moodPack.behavior[behavior];
      if (messages && messages.length > 0) {
        behaviorMessages.push(random(messages));
      }
    }
  }

  // If we have behavior messages, combine and return them
  if (behaviorMessages.length > 0) {
    return {
      message: combineMessages(behaviorMessages, mood),
      mood,
      behaviors,
      pattern,
      parsed,
    };
  }

  // Priority 2: Invalid URL pattern messages
  const invalidPatterns: PatternType[] = ['missingTld', 'missingProtocol', 'invalid_general'];
  if (invalidPatterns.includes(pattern) && moodPack.invalid) {
    const invalidKey = pattern as keyof typeof moodPack.invalid;
    if (moodPack.invalid[invalidKey]) {
      const invalidMessages = moodPack.invalid[invalidKey];
      if (invalidMessages && invalidMessages.length > 0) {
        return {
          message: random(invalidMessages),
          mood,
          behaviors,
          pattern,
          parsed,
        };
      }
    }
  }

  // Priority 3: Valid URL pattern messages (including special patterns)
  const validPatterns: PatternType[] = ['valid', 'insanely_long', 'utm_tracking', 'login_page', 'admin_page', 'ip_address'];
  if (parsed && validPatterns.includes(pattern) && moodPack.valid) {
    const validKey = pattern as keyof typeof moodPack.valid;
    if (moodPack.valid[validKey]) {
      const validMessages = moodPack.valid[validKey];
      if (validMessages && validMessages.length > 0) {
        return {
          message: random(validMessages),
          mood,
          behaviors,
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
        behaviors,
        pattern,
        parsed,
      };
    }
  }

  // Ultimate fallback (shouldn't happen with proper data structure)
  return {
    message: 'URL input detected.',
    mood,
    behaviors,
    pattern,
    parsed,
  };
}
