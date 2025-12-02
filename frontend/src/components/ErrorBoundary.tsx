import { Component } from 'react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { getCurrentMood } from '../lib/moodSystem';
import messagesData from '../data/messages.json';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

function random<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const mood = getCurrentMood();
      const moodPack = messagesData[mood as keyof typeof messagesData] as {
        error?: { '404'?: string[] };
      };
      
      const errorMessages = moodPack?.error?.['404'] || [
        "Something went wrong. But hey, at least you tried.",
      ];
      const message = random(errorMessages);

      return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4">
          <div className="text-center max-w-2xl">
            <h1 className="text-6xl sm:text-8xl font-bold text-gray-900 dark:text-white mb-4">
              Oops!
            </h1>
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-700 dark:text-gray-300 mb-6">
              Something Went Wrong
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-4">
              {message}
            </p>
            {this.state.error && (
              <p className="text-sm text-gray-500 dark:text-gray-500 mb-8 font-mono">
                {this.state.error.message}
              </p>
            )}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
              >
                Go Home
              </Link>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

