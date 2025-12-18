/**
 * Behavior detection system for tracking user input patterns
 */

import type { InputState, BehaviorType } from '../types/urlPersonality';

const MAX_HISTORY_LENGTH = 20;

/**
 * Detect user behavior patterns based on previous and current input state
 * Returns an array of behaviors that apply
 */
export function detectBehaviors(
  prev: InputState | null,
  next: InputState,
  history: InputState[]
): BehaviorType[] {
  const behaviors: BehaviorType[] = [];

  // No previous state - user just started (no message needed)
  if (!prev || !prev.value) {
    // Return empty array - no message for initial typing
    if (!next.value) {
      return [];
    }
  }

  // User cleared everything
  if (prev && prev.value && !next.value) {
    return ['cleared_all'];
  }

  // Detect if it's a replacement (completely different URL, not gradual editing)
  // This helps filter out false positives for "removed_tld" and "broke_validity"
  const isReplacement = prev && 
    next.value.length > 0 && 
    prev.value.length > 0 &&
    !next.value.startsWith(prev.value) && 
    !prev.value.startsWith(next.value);
  
  // Detect large changes (for filtering out transitional behaviors)
  // Used to distinguish editing from replacement, not as a behavior itself
  const isLargeChange = prev && Math.abs(next.value.length - prev.value.length) > 10;

  // TLD changes - only detect if it's gradual editing, not replacement
  if (prev && !isLargeChange && !isReplacement) {
    if (!prev.flags.hasTld && next.flags.hasTld) {
      behaviors.push('added_tld');
    }
    if (prev.flags.hasTld && !next.flags.hasTld) {
      behaviors.push('removed_tld');
    }
  }

  // Validity changes - only detect if it's gradual editing, not replacement
  if (prev && !isLargeChange && !isReplacement) {
    if (!prev.flags.valid && next.flags.valid) {
      behaviors.push('fixed_error');
    }
    if (prev.flags.valid && !next.flags.valid) {
      behaviors.push('broke_validity');
    }
  }

  // Oscillating pattern: current value matches value from 3 steps ago
  if (history.length >= 3) {
    const threeStepsAgo = history[history.length - 3];
    if (threeStepsAgo && threeStepsAgo.value === next.value) {
      behaviors.push('oscillating');
    }
  }

  // New behavior patterns based on flags
  if (next.flags.hasSpaces) {
    behaviors.push('has_spaces');
  }
  if (next.flags.hasInvisibleChars) {
    behaviors.push('has_invisible_chars');
  }
  // Only detect port if it's a complete port number (not incomplete)
  if (next.flags.hasPort && next.parsed) {
    behaviors.push('has_port');
  }
  if (next.flags.hasSwearwords) {
    behaviors.push('has_swearwords');
  }
  if (next.flags.dotWithoutTld) {
    behaviors.push('dot_without_tld');
  }
  // Roast for using http:// instead of https://
  if (next.flags.isHttp && next.flags.valid) {
    behaviors.push('using_http');
  }
  // Comment on commas in URL (often in query params)
  if (next.flags.hasComma) {
    behaviors.push('has_comma');
  }

  return behaviors;
}

/**
 * Create initial empty input state
 */
export function createInitialState(): InputState {
  return {
    value: '',
    parsed: null,
    flags: { valid: false },
  };
}

/**
 * Update history array, maintaining max length
 */
export function updateHistory(
  history: InputState[],
  newState: InputState
): InputState[] {
  const updated = [...history, newState];
  if (updated.length > MAX_HISTORY_LENGTH) {
    return updated.slice(-MAX_HISTORY_LENGTH);
  }
  return updated;
}

