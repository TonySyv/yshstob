import { Link } from 'react-router-dom';
import { getCurrentMood } from '../lib/moodSystem';
import messagesData from '../data/messages.json';

function random<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export default function NotFound() {
  const mood = getCurrentMood();
  const moodPack = messagesData[mood as keyof typeof messagesData] as {
    error?: { '404'?: string[] };
  };
  
  const errorMessages = moodPack?.error?.['404'] || [
    "404? That page doesn't exist. Try another one.",
  ];
  const message = random(errorMessages);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        <h1 className="text-6xl sm:text-8xl font-bold text-gray-900 dark:text-white mb-4">
          404
        </h1>
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-700 dark:text-gray-300 mb-6">
          Page Not Found
        </h2>
        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-8">
          {message}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
          >
            Go Home
          </Link>
          <Link
            to="/speedometer"
            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
          >
            Speedometer
          </Link>
        </div>
      </div>
    </div>
  );
}

