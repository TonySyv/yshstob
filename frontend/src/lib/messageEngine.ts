/**
 * Message selection engine for personality-driven URL input
 */

import type { MoodType, BehaviorType, PatternType, MessageResult } from '../types/urlPersonality';
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
 * Check if message ends with punctuation
 */
function endsWithPunctuation(msg: string): boolean {
  return /[.!?]$/.test(msg.trim());
}

/**
 * Context-aware combination templates for common pairs
 */
function getContextualCombination(
  _msg1: string,
  _msg2: string,
  behavior1: BehaviorType,
  behavior2: BehaviorType,
  mood: MoodType
): string | null {
  // Spaces + HTTP
  if ((behavior1 === 'has_spaces' && behavior2 === 'using_http') ||
      (behavior1 === 'using_http' && behavior2 === 'has_spaces')) {
    const templates: Record<MoodType, string[]> = {
      sassy: [
        "Spaces AND http://? Double trouble, honey.",
        "Spaces plus http://? That's a double whammy of wrong."
      ],
      bored: [
        "Spaces and http://. Double issues.",
        "Spaces plus http://. Two problems at once."
      ],
      bruh: [
        "Bruh, spaces and http://? Double wrong, bruh.",
        "Bruh, spaces plus http://. That's two issues, bruh."
      ],
      bro: [
        "Bro, spaces and http://? Double trouble, bro.",
        "Bro, spaces plus http://. Two problems, bro."
      ],
      party: [
        "SPACES AND http://?! 🎊 DOUBLE TROUBLE! 💥",
        "SPACES PLUS http://! 🎉 TWO ISSUES AT ONCE! 🔥"
      ],
      chill: [
        "Spaces and http://. Two issues there, friend.",
        "Spaces plus http://. Double trouble, but we can fix it."
      ],
      wholesome: [
        "Spaces and http://? Two issues, but you can fix them! ✨",
        "Spaces plus http://. Double trouble, but no worries! 💖"
      ],
    };
    return random(templates[mood] || []);
  }

  // Too short + HTTP
  if ((behavior1 === 'too_short' && behavior2 === 'using_http') ||
      (behavior1 === 'using_http' && behavior2 === 'too_short')) {
    const templates: Record<MoodType, string[]> = {
      sassy: [
        "Short URL with http://? At least make it secure if you're going to shorten it.",
        "Under 30 chars AND http://? Double wrong, honey."
      ],
      bored: [
        "Short URL with http://. Two issues.",
        "Too short and http://. Double problems."
      ],
      bruh: [
        "Bruh, short URL with http://? Two wrongs, bruh.",
        "Bruh, too short and http://. Double issue."
      ],
      bro: [
        "Bro, short URL with http://? At least use https://, bro.",
        "Bro, too short and http://. Two problems, bro."
      ],
      party: [
        "SHORT URL WITH http://?! 🎊 DOUBLE TROUBLE! 💥",
        "TOO SHORT AND http://! 🎉 TWO ISSUES! 🔥"
      ],
      chill: [
        "Short URL with http://. Two issues, but no worries.",
        "Too short and http://. Double trouble, but fixable."
      ],
      wholesome: [
        "Short URL with http://? Two issues, but you can fix them! ✨",
        "Too short and http://. Double trouble, but no problem! 💖"
      ],
    };
    return random(templates[mood] || []);
  }

  // Spaces + Swearwords
  if ((behavior1 === 'has_spaces' && behavior2 === 'has_swearwords') ||
      (behavior1 === 'has_swearwords' && behavior2 === 'has_spaces')) {
    const templates: Record<MoodType, string[]> = {
      sassy: [
        "Spaces and swearwords? Classy AND wrong. Double whammy.",
        "Spaces plus profanity? That's a mess, honey."
      ],
      bored: [
        "Spaces and swearwords. Two issues.",
        "Spaces plus profanity. Double problems."
      ],
      bruh: [
        "Bruh, spaces and swearwords? Double wrong, bruh.",
        "Bruh, spaces plus profanity. Two issues."
      ],
      bro: [
        "Bro, spaces and swearwords? Keep it clean and fix the spaces, bro.",
        "Bro, spaces plus profanity. Two problems, bro."
      ],
      party: [
        "SPACES AND SWEARWORDS! 🎊 DOUBLE TROUBLE! 💥",
        "SPACES PLUS PROFANITY! 🎉 TWO ISSUES! 🔥"
      ],
      chill: [
        "Spaces and swearwords. Two issues, but fixable.",
        "Spaces plus profanity. Double trouble, but we can sort it out."
      ],
      wholesome: [
        "Spaces and swearwords? Two issues, but you can fix them! ✨",
        "Spaces plus profanity. Keep it clean and fix the spaces! 💖"
      ],
    };
    return random(templates[mood] || []);
  }

  return null;
}

/**
 * Combine multiple messages gracefully with improved flow
 */
function combineMessages(
  messages: string[],
  behaviors: BehaviorType[],
  mood: MoodType
): string {
  if (messages.length === 0) return '';
  if (messages.length === 1) return messages[0];

  // Try contextual combination for 2 messages
  if (messages.length === 2 && behaviors.length === 2) {
    const contextual = getContextualCombination(
      messages[0],
      messages[1],
      behaviors[0],
      behaviors[1],
      mood
    );
    if (contextual) return contextual;
  }

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
    
    // Better handling based on first message punctuation
    const firstEndsWithPunct = endsWithPunctuation(messages[0]);
    if (firstEndsWithPunct) {
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
    
    // Handle punctuation better
    if (endsWithPunctuation(msg1)) {
      return `${msg1}${connector1} ${msg2}${connector2} ${msg3}`;
    }
    
    return `${msg1}${connector1} ${msg2}${connector2} ${msg3}`;
  }

  // For 4+ messages, use a list-like structure with better flow
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
    
    // Use "and" for the last item for better flow
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
  const behaviorTypes: BehaviorType[] = [];

  // Priority 1: Collect behavior-specific messages (excluding "typing")
  const nonTypingBehaviors = behaviors.filter(b => b !== 'typing');

  // Filter out transitional behaviors when there are structural issues
  // These are less relevant when combined with actual problems
  const structuralBehaviors: BehaviorType[] = [
    'has_spaces',
    'has_invisible_chars',
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
    has_invisible_chars: 2,
    dot_without_tld: 3,
    has_swearwords: 4,
    using_http: 5,
    has_port: 6,
    too_short: 7,
    broke_validity: 8,
    fixed_error: 9,
    removed_tld: 10,
    added_tld: 11,
    oscillating: 12,
    cleared_all: 13,
    started_typing: 14,
    typing: 99,
  };
  
  // Sort behaviors by priority
  const sortedBehaviors = [...filteredBehaviors].sort(
    (a, b) => (behaviorPriority[a] || 50) - (behaviorPriority[b] || 50)
  );
  
  for (const behavior of sortedBehaviors) {
    const behaviorRecord = moodPack.behavior as Record<string, string[] | undefined>;
    if (behaviorRecord[behavior]) {
      const messages = behaviorRecord[behavior];
      if (messages && messages.length > 0) {
        behaviorMessages.push(random(messages));
        behaviorTypes.push(behavior);
      }
    }
  }

  // If we have behavior messages, combine and return them
  if (behaviorMessages.length > 0) {
    return {
      message: combineMessages(behaviorMessages, behaviorTypes, mood),
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
