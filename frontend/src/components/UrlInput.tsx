import { useState, useEffect, useRef, useCallback } from 'react';
import { parseUrl, validateTld, normalizeUrl, type TldError } from '../lib/urlUtils';

interface UrlInputProps {
  onSubmit: (url: string) => void;
  isLoading?: boolean;
}

export default function UrlInput({ onSubmit, isLoading = false }: UrlInputProps) {
  const [protocol, setProtocol] = useState('https://');
  const [domain, setDomain] = useState('');
  const [tldError, setTldError] = useState<TldError | null>(null);
  const [arrowPosition, setArrowPosition] = useState(0);
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const domainInputRef = useRef<HTMLInputElement>(null);
  const protocolFieldRef = useRef<HTMLDivElement>(null);
  const errorContainerRef = useRef<HTMLDivElement>(null);
  const inputContainerRef = useRef<HTMLDivElement>(null);
  const updateTimeoutRef = useRef<number | null>(null);

  // Auto-focus input on mount
  useEffect(() => {
    domainInputRef.current?.focus();
  }, []);

  // Update arrow position with debouncing to prevent flicker during rapid typing
  const updateArrowPosition = useCallback((charPosition: number) => {
    // Clear any pending updates
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }

    // Debounce the position update
    updateTimeoutRef.current = window.setTimeout(() => {
      if (!domainInputRef.current || !protocolFieldRef.current || !inputContainerRef.current) return;
      
      // Use a canvas to measure text width accurately
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) return;
      
      const inputStyle = window.getComputedStyle(domainInputRef.current);
      context.font = inputStyle.font;
      
      // Measure the width of text up to the error position
      const textBeforeError = domain.substring(0, charPosition);
      const textWidth = context.measureText(textBeforeError).width;
      
      // Get the protocol field width
      const protocolWidth = protocolFieldRef.current.offsetWidth;
      
      // Get padding offset
      const paddingLeft = parseFloat(inputStyle.paddingLeft) || 16;
      
      // Calculate absolute position: protocol field width + domain text width + padding
      const absolutePosition = protocolWidth + textWidth + paddingLeft;
      
      setArrowPosition(absolutePosition);
    }, 50); // 50ms debounce to prevent flicker
  }, [domain]);

  // Validate TLD when domain changes
  useEffect(() => {
    if (domain.trim()) {
      const error = validateTld(domain);
      setTldError(error);
      
      if (error) {
        updateArrowPosition(error.position);
      } else {
        // Clear timeout if no error
        if (updateTimeoutRef.current) {
          clearTimeout(updateTimeoutRef.current);
        }
      }
    } else {
      setTldError(null);
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    }
  }, [domain, updateArrowPosition]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, []);

  const handleDomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Handle very long URLs - limit to reasonable length (2048 chars is URL max)
    const maxLength = 2000;
    setDomain(value.length > maxLength ? value.substring(0, maxLength) : value);
  };

  const handleDomainPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    
    // Parse the pasted URL
    const parsed = parseUrl(pastedText);
    setProtocol(parsed.protocol);
    setDomain(parsed.domain);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const normalized = normalizeUrl(protocol, domain);
    if (normalized.replace(/^https?:\/\//, '').trim()) {
      setIsButtonClicked(true);
      setTimeout(() => setIsButtonClicked(false), 500);
      onSubmit(normalized);
    }
  };

  const canSubmit = domain.trim().length > 0 && !isLoading;

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col gap-2">
        {/* Split Input Fields */}
        <div 
          ref={inputContainerRef}
          className="flex items-center gap-0 rounded-xl border border-gray-200 dark:border-gray-700 focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:border-blue-500/50 bg-white dark:bg-gray-800 transition-all overflow-hidden relative shadow-sm"
        >
          {/* Protocol Field (Read-only) */}
          <div 
            ref={protocolFieldRef}
            className="px-4 py-3 bg-gray-50/80 dark:bg-gray-700/80 border-r border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 font-mono text-sm select-none flex-shrink-0 min-w-fit"
            title="Protocol (read-only)"
          >
            {protocol}
          </div>
          
          {/* Domain Field (Editable) */}
          <div className="flex-1 relative min-w-0">
            <input
              ref={domainInputRef}
              type="text"
              value={domain}
              onChange={handleDomainChange}
              onPaste={handleDomainPaste}
              placeholder="example.com/path"
              className="w-full px-4 py-3 bg-transparent border-0 focus:outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 text-sm"
              disabled={isLoading}
              autoComplete="off"
              spellCheck="false"
              maxLength={2000}
            />
          </div>
        </div>

        {/* Error Indicator - Always rendered to reserve space */}
        <div
          ref={errorContainerRef}
          className={`relative mt-2 min-h-[80px] transition-opacity duration-200 ${
            tldError && inputContainerRef.current
              ? 'opacity-100 visible'
              : 'opacity-0 invisible'
          }`}
        >
          {/* Arrow pointing to error position */}
          {tldError && inputContainerRef.current && (
            <div
              className="absolute bottom-full mb-1 transition-all duration-200 z-10 pointer-events-none"
              style={{
                left: `${Math.min(arrowPosition, inputContainerRef.current.offsetWidth - 12)}px`,
                transform: 'translateX(-50%)',
                minWidth: '24px',
                maxWidth: '24px',
              }}
            >
              <svg
                width="24"
                height="12"
                viewBox="0 0 24 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-amber-500 dark:text-amber-400 drop-shadow-sm"
              >
                <path
                  d="M12 12L0 0H24L12 12Z"
                  fill="currentColor"
                />
              </svg>
            </div>
          )}

          {/* Error Message */}
          {tldError && (
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200/60 dark:border-amber-800/60 rounded-lg px-3.5 py-2.5 text-amber-800 dark:text-amber-200 text-sm">
              <div className="flex items-start gap-2">
                <svg
                  className="w-4 h-4 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <p className="font-medium text-xs">{tldError.message}</p>
                  <p className="text-xs mt-0.5 text-amber-700/80 dark:text-amber-300/80">
                    You can still submit, but the URL may not work correctly.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!canSubmit}
          className={`relative px-6 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 active:from-blue-700 active:to-blue-800 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50 text-white text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl shadow-blue-500/50 hover:shadow-blue-500/60 self-start flex items-center gap-2 overflow-hidden group ${
            isButtonClicked ? 'button-click-animate' : ''
          }`}
        >
          {/* Shimmer effect on hover */}
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          
          {/* Ripple effect on click */}
          {isButtonClicked && (
            <>
              <span className="absolute inset-0 button-ripple-1"></span>
              <span className="absolute inset-0 button-ripple-2"></span>
            </>
          )}
          
          {/* Button content */}
          <span className={`relative z-10 flex items-center gap-2 ${isButtonClicked ? 'button-content-bounce' : ''}`}>
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Shortening...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                <span>Shorten URL</span>
              </>
            )}
          </span>
        </button>
      </div>
    </form>
  );
}
