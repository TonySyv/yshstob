import { Link } from 'react-router-dom';

export default function Info() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors mb-6"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to URL Shortener
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            How Our URL Personality System Works
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Discover all the ways our URL gremlin reacts to your input! The system changes its personality based on the day of the week and responds to different URL patterns and typing behaviors.
          </p>
        </div>

        <div className="space-y-8">
          {/* Weekly Moods */}
          <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Weekly Moods</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Our URL gremlin has a different personality each day of the week:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Monday - Sassy 💅</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Sharp, sarcastic, and not afraid to call you out.</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Tuesday - Bored 😑</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Unimpressed, tired, and barely paying attention.</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Wednesday - Bruh 😎</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Every message contains "bruh". That's it.</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Thursday - Bro 💪</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Gym-bro energy, encouraging and motivational.</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Friday - Party 🎉</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">ALL CAPS! EMOJIS! HYPED ENERGY!</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Saturday - Chill 😌</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Relaxed, smooth, bartender vibes.</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg md:col-span-2">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Sunday - Wholesome 💖</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Gentle, supportive, and caring. Your biggest cheerleader.</p>
              </div>
            </div>
          </section>

          {/* Typing Behaviors */}
          <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Typing Behaviors</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              The system watches how you type and reacts to different patterns:
            </p>
            <div className="space-y-3">
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Started Typing</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">When you first start typing in the field.</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Cleared Everything</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">When you delete all the text and start fresh.</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Oscillating</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">When you keep going back and forth between the same values (can't make up your mind).</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Added TLD</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">When you add a top-level domain like .com while typing.</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Removed TLD</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">When you accidentally remove the .com or other TLD.</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Fixed an Error</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">When you correct an invalid URL and make it valid.</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Broke Validity</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">When you had a valid URL and then made it invalid.</p>
              </div>
            </div>
          </section>

          {/* URL Pattern Issues */}
          <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">URL Pattern Issues</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              The system detects specific problems with your URL:
            </p>
            <div className="space-y-3">
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Missing TLD</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Your URL doesn't have a top-level domain like .com, .org, or .net (e.g., "google" instead of "google.com").</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Missing Protocol</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Your URL doesn't start with http:// or https:// (though we'll add https:// automatically).</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Spaces in URL</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">URLs can't have spaces. Use hyphens or %20 instead.</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Invisible Characters</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Your URL contains sneaky zero-width or exotic Unicode space characters that look invisible but cause problems.</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Dot Without TLD</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">You have a dot but no proper ending (e.g., "example." instead of "example.com").</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Special Characters</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Your URL contains unusual characters like commas, brackets, pipes, quotes, or backticks. Common in API calls with comma-separated values like <code className="text-xs bg-gray-200 dark:bg-gray-600 px-1 rounded">?include=roles,permissions</code>.</p>
              </div>
            </div>
          </section>

          {/* URL Pattern Features */}
          <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Special URL Features</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              The system recognizes and comments on special URL features:
            </p>
            <div className="space-y-3">
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Custom Port</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Your URL includes a port number like :8080 or :3000. Still valid, but we'll roast you for it!</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Using HTTP (Not Secure)</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">You're using http:// instead of https://. We'll definitely roast you for this in 2025!</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">UTM Tracking Parameters</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Your URL has tracking parameters like ?utm_source=google. Marketing detected!</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Login Page</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">The URL looks like a login or sign-in page (contains "login", "signin", or "auth").</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Admin Page</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">The URL looks like an admin or dashboard page (contains "admin" or "dashboard").</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">IP Address</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">You're using an IP address like 192.168.1.1 instead of a domain name. Old school!</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Insanely Long URL</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Your URL is over 500 characters long. That's a lot!</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Too Short to Shorten</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Your URL is under 30 characters. The shortened version will actually be LONGER than your original!</p>
              </div>
            </div>
          </section>

          {/* Fun Behaviors */}
          <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Fun Behaviors</h2>
            <div className="space-y-3">
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Swearwords Detected</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">If you include certain words in your URL, we'll definitely notice. Keep it clean!</p>
              </div>
            </div>
          </section>

          {/* Speedometer */}
          <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">📊 Speedometer</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              We track and display real-time metrics about our redirect service performance:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Average Redirect Speed</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">How fast our redirects happen on average (in milliseconds).</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Total Redirects</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">The total number of redirects we've processed.</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Version & Deploy Info</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Current version number and when the service was last deployed.</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Commit Summary</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">What's new in the latest deployment.</p>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mt-4">
              Check it out at <Link to="/speedometer" className="text-blue-600 dark:text-blue-400 hover:underline">/speedometer</Link>!
            </p>
          </section>

          {/* How It Works */}
          <section className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">How It Works</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              The system analyzes your URL in real-time as you type. It checks for patterns, detects your typing behavior, and combines multiple observations into natural-sounding messages. All processing happens instantly in your browser - no data is sent to any server until you click "Shorten URL".
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              Try typing different URLs, add ports, use http:// instead of https://, or type something under 30 characters to see all the different reactions!
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

