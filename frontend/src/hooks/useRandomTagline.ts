import { useState, useEffect } from 'react';
import { TAGLINES } from '../constants/taglines';

export function useRandomTagline(): string {
  const [tagline, setTagline] = useState<string>('');

  useEffect(() => {
    // Client-side only: select random tagline on mount
    const randomIndex = Math.floor(Math.random() * TAGLINES.length);
    setTagline(TAGLINES[randomIndex]);
  }, []);

  return tagline;
}









