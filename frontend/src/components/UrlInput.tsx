import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { parseUrl, getUrlFlags, detectStructurePattern } from '../lib/urlUtils';
import { detectBehaviors, createInitialState, updateHistory } from '../lib/behaviorDetection';
import { getCurrentMood } from '../lib/moodSystem';
import { pickMessage } from '../lib/messageEngine';
import type { InputState, MessageResult } from '../types/urlPersonality';

interface UrlInputProps {
  onSubmit: (url: string) => void;
  isLoading?: boolean;
}

export default function UrlInput({ onSubmit, isLoading = false }: UrlInputProps) {
  const [value, setValue] = useState('');
  const [history, setHistory] = useState<InputState[]>([]);
  const [messageResult, setMessageResult] = useState<MessageResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Process input changes
  useEffect(() => {
    const prev = history[history.length - 1] || createInitialState();
    const parsed = parseUrl(value);
    const flags = getUrlFlags(parsed, value);
    const nextState: InputState = { value, parsed, flags };

    const behaviors = detectBehaviors(prev, nextState, history);
    const pattern = detectStructurePattern(flags);
    const mood = getCurrentMood();

    const message = pickMessage(mood, pattern, behaviors, parsed);

    setMessageResult(message);
    setHistory((prevHistory) => updateHistory(prevHistory, nextState));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    // Limit to reasonable length (2048 chars is URL max)
    const maxLength = 2000;
    setValue(newValue.length > maxLength ? newValue.substring(0, maxLength) : newValue);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    setValue(pastedText);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim() || isLoading) return;

    // Normalize the URL for submission
    const parsed = parseUrl(value);
    let urlToSubmit = value.trim();

    if (parsed) {
      urlToSubmit = parsed.href;
    } else {
      // If parsing failed, try to add https://
      urlToSubmit = value.trim().startsWith('http://') || value.trim().startsWith('https://')
        ? value.trim()
        : `https://${value.trim()}`;
    }

    onSubmit(urlToSubmit);
  };

  const canSubmit = value.trim().length > 0 && !isLoading;

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col gap-2">
        {/* Unified Input Field */}
        <div className="flex items-center gap-0 rounded-lg border border-gray-200 dark:border-gray-700 focus-within:ring-2 focus-within:ring-blue-500/30 focus-within:border-blue-500/50 bg-white dark:bg-gray-800 transition-all overflow-hidden relative shadow-sm">
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={handleInputChange}
            onPaste={handlePaste}
            placeholder="https://example.com/path"
            className="w-full px-4 py-2.5 bg-transparent border-0 focus:outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 text-sm"
            disabled={isLoading}
            autoComplete="off"
            spellCheck="false"
            maxLength={2000}
          />
        </div>

        {/* Personality Message Display */}
        <AnimatePresence mode="wait">
          {messageResult && value.trim() && (
            <motion.div
              key={messageResult.message}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="min-h-[60px]"
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-300 dark:border-zinc-600 rounded-lg px-3.5 py-2.5 text-zinc-700 dark:text-zinc-200 text-sm"
              >
                <div className="flex items-start gap-2">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                    className="text-lg"
                  >
                    {messageResult.mood === 'party' && '🎉'}
                    {messageResult.mood === 'wholesome' && '💖'}
                    {messageResult.mood === 'bruh' && '😎'}
                    {messageResult.mood === 'bro' && '💪'}
                    {messageResult.mood === 'sassy' && '💅'}
                    {messageResult.mood === 'bored' && '😑'}
                    {messageResult.mood === 'chill' && '😌'}
                  </motion.div>
                  <p className="flex-1 leading-relaxed">{messageResult.message}</p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={!canSubmit}
          whileHover={canSubmit ? { scale: 1.01 } : {}}
          whileTap={canSubmit ? { scale: 0.99 } : {}}
          className="px-5 py-2 rounded-lg bg-stone-800 hover:bg-stone-900 active:bg-stone-950 dark:bg-stone-200 dark:hover:bg-white dark:active:bg-stone-100 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50 text-white dark:text-stone-900 text-sm font-medium transition-all duration-150 shadow-sm hover:shadow-md self-start flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <motion.svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </motion.svg>
              <span>Shortening...</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              <span>Shorten URL</span>
            </>
          )}
        </motion.button>
      </div>
    </form>
  );
}
