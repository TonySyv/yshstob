import { useState } from 'react';
import { createShortUrl } from '../lib/api';
import UrlInput from '../components/UrlInput';
import ShortUrlResult from '../components/ShortUrlResult';

export default function Home() {
  const [shortUrl, setShortUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (longUrl: string) => {
    setIsLoading(true);
    setError(null);
    setShortUrl(null);

    try {
      const response = await createShortUrl(longUrl);
      setShortUrl(response.shortUrl);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create short URL. Please try again.');
      console.error('Error creating short URL:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-3xl text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          URL Shortener
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          Transform long URLs into short, shareable links
        </p>

        <UrlInput onSubmit={handleSubmit} isLoading={isLoading} />

        {error && (
          <div className="mt-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 rounded-lg text-red-700 dark:text-red-400">
            {error}
          </div>
        )}

        {shortUrl && <ShortUrlResult shortUrl={shortUrl} />}
      </div>
    </div>
  );
}

