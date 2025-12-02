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
 * Normalize message for combination (lowercase first letter, handle punctuation)
 */
function normalizeForCombination(msg: string): string {
  // If message starts with a question or exclamation, keep it
  if (msg.match(/^[?!]/)) return msg;
  
  // Lowercase first letter but preserve the rest
  return msg.charAt(0).toLowerCase() + msg.slice(1);
}

/**
 * Combine multiple messages gracefully
 * Creates natural-sounding combinations with better flow
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
      sassy: [' Also,', ' Plus,', ' And', ' Oh, and', ' Not to mention,'],
      bored: [' Also,', ' Plus,', ' And', ' On top of that,'],
      bruh: [' Also,', ' Bruh,', ' And', ' Plus, bruh,'],
      bro: [' Also,', ' Plus,', ' And', ' Not only that,'],
      party: [' ALSO!', ' PLUS!', ' AND', ' NOT TO MENTION!'],
      chill: [' Also,', ' Plus,', ' And', ' On top of that,'],
      wholesome: [' Also,', ' Plus,', ' And', ' Not only that,'],
    };
    const connector = random(connectors[mood] || [' Also,']);
    const secondMsg = normalizeForCombination(messages[1]);
    
    // Handle questions and exclamations better
    if (messages[0].endsWith('?') || messages[0].endsWith('!')) {
      return `${messages[0]}${connector} ${secondMsg}`;
    }
    
    return `${messages[0]}${connector} ${secondMsg}`;
  }

  // For 3 messages, create a more natural flow
  if (messages.length === 3) {
    const twoConnectors: Record<MoodType, string[]> = {
      sassy: [' Also,', ' Plus,', ' And', ' Oh, and'],
      bored: [' Also,', ' Plus,', ' And'],
      bruh: [' Also,', ' Bruh,', ' And'],
      bro: [' Also,', ' Plus,', ' And'],
      party: [' ALSO!', ' PLUS!', ' AND'],
      chill: [' Also,', ' Plus,', ' And'],
      wholesome: [' Also,', ' Plus,', ' And'],
    };
    
    const finalConnectors: Record<MoodType, string[]> = {
      sassy: [' And', ' Plus,', ' Oh, and'],
      bored: [' And', ' Plus,'],
      bruh: [' And', ' Bruh,', ' Plus,'],
      bro: [' And', ' Plus,'],
      party: [' AND', ' PLUS!'],
      chill: [' And', ' Plus,'],
      wholesome: [' And', ' Plus,'],
    };
    
    const connector1 = random(twoConnectors[mood] || [' Also,']);
    const connector2 = random(finalConnectors[mood] || [' And']);
    
    const msg1 = messages[0];
    const msg2 = normalizeForCombination(messages[1]);
    const msg3 = normalizeForCombination(messages[2]);
    
    return `${msg1}${connector1} ${msg2}${connector2} ${msg3}`;
  }

  // For 4+ messages, use a list-like structure
  const firstMsg = messages[0];
  const rest = messages.slice(1);
  
  const connectors: Record<MoodType, string[]> = {
    sassy: [' Also,', ' Plus,', ' And', ' Oh, and'],
    bored: [' Also,', ' Plus,', ' And'],
    bruh: [' Also,', ' Bruh,', ' And'],
    bro: [' Also,', ' Plus,', ' And'],
    party: [' ALSO!', ' PLUS!', ' AND'],
    chill: [' Also,', ' Plus,', ' And'],
    wholesome: [' Also,', ' Plus,', ' And'],
  };
  
  let combined = firstMsg;
  for (let i = 0; i < rest.length; i++) {
    const connector = random(connectors[mood] || [' Also,']);
    const normalized = normalizeForCombination(rest[i]);
    
    // Use "and" for the last item
    if (i === rest.length - 1 && rest.length > 1) {
      combined += ` and ${normalized}`;
    } else {
      combined += `${connector} ${normalized}`;
    }
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

  // Filter out transitional behaviors when there are structural issues
  // These are less relevant when combined with actual problems
  const structuralBehaviors: BehaviorType[] = [
    'has_spaces',
    'dot_without_tld',
    'has_swearwords',
    'using_http',
    'has_port',
    'too_short',
    'broke_validity',
  ];

  const transitionalBehaviors: BehaviorType[] = [
    'fixed_error',
    'added_tld',
    'removed_tld',
    'started_typing',
    'oscillating',
  ];

  // If we have structural behaviors, filter out transitional ones
  // Exception: keep 'cleared_all' as it's informative
  const hasStructural = nonTypingBehaviors.some(b => structuralBehaviors.includes(b));
  const filteredBehaviors = hasStructural
    ? nonTypingBehaviors.filter(b => !transitionalBehaviors.includes(b) || b === 'cleared_all')
    : nonTypingBehaviors;
  
  // Order behaviors for better flow: structural issues first, then behavioral roasts
  const behaviorPriority: Record<BehaviorType, number> = {
    has_spaces: 1,
    dot_without_tld: 2,
    has_swearwords: 3,
    using_http: 4,
    has_port: 5,
    too_short: 6,
    broke_validity: 7,
    fixed_error: 8,
    removed_tld: 9,
    added_tld: 10,
    oscillating: 11,
    cleared_all: 12,
    started_typing: 13,
    typing: 99,
  };
  
  // Sort behaviors by priority
  const sortedBehaviors = [...filteredBehaviors].sort(
    (a, b) => (behaviorPriority[a] || 50) - (behaviorPriority[b] || 50)
  );
  
  for (const behavior of sortedBehaviors) {
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
