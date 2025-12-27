import { useState } from 'react';
import { Link } from 'react-router-dom';
import { createShortUrl } from '../lib/api';
import { generateShortCode } from '../lib/codeGenerator';
import UrlInput from '../components/UrlInput';
import ShortUrlResult from '../components/ShortUrlResult';
import { useRandomTagline } from '../hooks/useRandomTagline';

export default function Home() {
  const tagline = useRandomTagline();
  const [shortUrl, setShortUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (longUrl: string) => {
    setError(null);
    setIsConfirmed(false);
    
    // Generate code client-side for optimistic UI
    const code = generateShortCode();
    const baseUrl = import.meta.env.VITE_API_BASE_URL || window.location.origin;
    const optimisticUrl = `${baseUrl}/${code}`;
    
    // Show optimistic URL immediately
    setShortUrl(optimisticUrl);
    setIsLoading(true);

    try {
      const response = await createShortUrl(longUrl, code);
      // Update if backend returned different code (rare collision)
      if (response.shortUrl !== optimisticUrl) {
        setShortUrl(response.shortUrl);
      }
      setIsConfirmed(true);
    } catch (err: any) {
      // Clear optimistic URL on error
      setShortUrl(null);
      setError(err.response?.data?.message || 'Failed to create short URL. Please try again.');
      console.error('Error creating short URL:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-start px-4 sm:px-6 md:px-8 lg:px-12 pt-4 sm:pt-6 pb-6 sm:pb-8 relative">
      <div className="w-full max-w-2xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-1.5">
            URL Shortener
          </h1>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
            {tagline || 'Transform long URLs into short, shareable links'}
          </p>
        </div>

        <UrlInput onSubmit={handleSubmit} isLoading={isLoading} />

        {error && (
          <div className="mt-4 p-3.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-lg text-red-700 dark:text-red-400 text-sm animate-[fadeIn_0.2s_ease-out]">
            <div className="flex items-start gap-2">
              <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}

        {shortUrl && <ShortUrlResult shortUrl={shortUrl} isConfirmed={isConfirmed} />}
      </div>

      {/* Question Mark Help Button */}
      <Link
        to="/info"
        className="fixed bottom-4 right-4 w-6 h-6 bg-stone-700 hover:bg-stone-800 dark:bg-stone-300 dark:hover:bg-white text-white dark:text-stone-900 rounded-full shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center z-50 group"
        title="Learn about URL behavior patterns"
      >
        <svg
          className="w-3 h-3 transition-transform group-hover:scale-110"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </Link>
    </div>
  );
}

