/**
 * Behavior detection system for tracking user input patterns
 */

import type { InputState, BehaviorType } from '../types/urlPersonality';

// Keep old function name for backward compatibility, but mark as deprecated
/**
 * @deprecated Use detectBehaviors instead (returns array)
 */
export function detectBehavior(
  prev: InputState | null,
  next: InputState,
  history: InputState[]
): BehaviorType {
  const behaviors = detectBehaviors(prev, next, history);
  return behaviors[0] || 'typing';
}

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

  // No previous state - user just started
  if (!prev || !prev.value) {
    if (next.value) {
      behaviors.push('started_typing');
    } else {
      return ['typing'];
    }
  }

  // User cleared everything
  if (prev && prev.value && !next.value) {
    return ['cleared_all'];
  }

  // Large paste detected (more than 10 characters added at once)
  if (prev) {
    const lengthDiff = next.value.length - prev.value.length;
    if (lengthDiff > 10) {
      behaviors.push('pasted_big');
    }
  }

  // TLD changes
  if (prev) {
    if (!prev.flags.hasTld && next.flags.hasTld) {
      behaviors.push('added_tld');
    }
    if (prev.flags.hasTld && !next.flags.hasTld) {
      behaviors.push('removed_tld');
    }
  }

  // Validity changes
  if (prev) {
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
  // Only detect port if it's a complete port number (not incomplete)
  if (next.flags.hasPort && next.parsed) {
    behaviors.push('has_port');
  }
  if (next.flags.hasSwearwords) {
    behaviors.push('has_swearwords');
  }
  // Only roast for short URLs if they're valid (roasting about shortening, not validity)
  if (next.flags.isShort && next.flags.valid) {
    behaviors.push('too_short');
  }
  if (next.flags.dotWithoutTld) {
    behaviors.push('dot_without_tld');
  }
  // Roast for using http:// instead of https://
  if (next.flags.isHttp && next.flags.valid) {
    behaviors.push('using_http');
  }

  // If no specific behaviors detected, return typing
  if (behaviors.length === 0) {
    return ['typing'];
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

