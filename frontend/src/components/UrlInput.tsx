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
  const domainInputRef = useRef<HTMLInputElement>(null);
  const protocolFieldRef = useRef<HTMLDivElement>(null);
  const errorContainerRef = useRef<HTMLDivElement>(null);
  const inputContainerRef = useRef<HTMLDivElement>(null);
  const updateTimeoutRef = useRef<number | null>(null);

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
      onSubmit(normalized);
    }
  };

  const canSubmit = domain.trim().length > 0 && !isLoading;

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl">
      <div className="flex flex-col gap-2">
        {/* Split Input Fields */}
        <div 
          ref={inputContainerRef}
          className="flex items-center gap-0 rounded-lg border border-gray-300 dark:border-gray-600 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent bg-white dark:bg-gray-800 transition-all overflow-hidden relative"
        >
          {/* Protocol Field (Read-only) */}
          <div 
            ref={protocolFieldRef}
            className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-r border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 font-mono text-sm select-none flex-shrink-0"
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
              className="w-full px-4 py-3 bg-transparent border-0 focus:outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 overflow-x-auto"
              disabled={isLoading}
              autoComplete="off"
              spellCheck="false"
              maxLength={2000}
            />
            
            {/* Highlight overlay for error position */}
            {tldError && domainInputRef.current && (
              <div
                className="absolute top-0 bottom-0 pointer-events-none opacity-30"
                style={{
                  left: `${arrowPosition}px`,
                  width: '2px',
                  backgroundColor: 'rgb(245, 158, 11)',
                }}
              />
            )}
          </div>
        </div>

        {/* Error Indicator */}
        {tldError && inputContainerRef.current && (
          <div
            ref={errorContainerRef}
            className="relative mt-2 animate-in fade-in slide-in-from-top-2 duration-200"
          >
            {/* Arrow pointing to error position */}
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

            {/* Error Message */}
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg px-4 py-3 text-amber-800 dark:text-amber-200 text-sm">
              <div className="flex items-start gap-2">
                <svg
                  className="w-5 h-5 flex-shrink-0 mt-0.5"
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
                  <p className="font-medium">{tldError.message}</p>
                  <p className="text-xs mt-1 text-amber-700 dark:text-amber-300">
                    You can still submit, but the URL may not work correctly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!canSubmit}
          className="px-8 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium transition-colors duration-200 shadow-md hover:shadow-lg self-start"
        >
          {isLoading ? 'Shortening...' : 'Shorten'}
        </button>
      </div>
    </form>
  );
}
