import { useState } from 'react';

interface ShortUrlResultProps {
  shortUrl: string;
}

export default function ShortUrlResult({ shortUrl }: ShortUrlResultProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="mt-5 w-full animate-[fadeIn_0.3s_ease-out]">
      <div className="p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 min-w-0 w-full">
            <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 mb-2 uppercase tracking-wider">
              Your short URL
            </p>
            <div 
              className="text-base font-mono text-gray-900 dark:text-gray-100 break-all select-all cursor-text bg-gray-50 dark:bg-gray-900/50 rounded-md px-3 py-2 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-colors"
              onClick={(e) => {
                const selection = window.getSelection();
                const range = document.createRange();
                range.selectNodeContents(e.currentTarget);
                selection?.removeAllRanges();
                selection?.addRange(range);
              }}
            >
              {shortUrl}
            </div>
          </div>
          <div className="flex items-end">
            <button
              onClick={handleCopy}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0 flex items-center gap-2 ${
                copied
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-md'
                  : 'bg-gray-700 hover:bg-gray-800 active:bg-gray-900 text-white shadow-sm hover:shadow-md dark:bg-gray-600 dark:hover:bg-gray-700 dark:active:bg-gray-800'
              }`}
            >
            {copied ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                <span>Copied!</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>Copy</span>
              </>
            )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

