/**
 * Behavior detection system for tracking user input patterns
 */

import type { InputState, BehaviorType } from '../types/urlPersonality';

const MAX_HISTORY_LENGTH = 20;

/**
 * Detect user behavior pattern based on previous and current input state
 */
export function detectBehavior(
  prev: InputState | null,
  next: InputState,
  history: InputState[]
): BehaviorType {
  // No previous state - user just started
  if (!prev || !prev.value) {
    if (next.value) return 'started_typing';
    return 'typing';
  }

  // User cleared everything
  if (prev.value && !next.value) {
    return 'cleared_all';
  }

  // Large paste detected (more than 10 characters added at once)
  const lengthDiff = next.value.length - prev.value.length;
  if (lengthDiff > 10) {
    return 'pasted_big';
  }

  // TLD changes
  if (!prev.flags.hasTld && next.flags.hasTld) {
    return 'added_tld';
  }

  if (prev.flags.hasTld && !next.flags.hasTld) {
    return 'removed_tld';
  }

  // Validity changes
  if (!prev.flags.valid && next.flags.valid) {
    return 'fixed_error';
  }

  if (prev.flags.valid && !next.flags.valid) {
    return 'broke_validity';
  }

  // Oscillating pattern: current value matches value from 3 steps ago
  if (history.length >= 3) {
    const threeStepsAgo = history[history.length - 3];
    if (threeStepsAgo && threeStepsAgo.value === next.value) {
      return 'oscillating';
    }
  }

  // Default: just typing
  return 'typing';
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

