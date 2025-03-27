'use client';

import Link from 'next/link';

export default function ApiPage() {
  return (
    <main className="flex flex-col items-center min-h-screen w-full px-4 pt-10 pb-20 text-sm font-mono text-white bg-black">
      <div className="max-w-2xl w-full">
        <h1 className="text-2xl font-bold mb-6">Public API Documentation</h1>

        <p className="mb-6">
          MathsMine3 exposes a public read-only API for token, poll, and game data. All responses are in JSON format.
        </p>

        {/* /api/token-value */}
        <h2 className="text-xl font-semibold mt-8 mb-2">Token Value</h2>
        <p>Get the current in-game token value:</p>
        <code className="block bg-gray-800 p-2 rounded my-2">
          <a href="/api/token-value" className="text-blue-400" target="_blank">GET /api/token-value</a>
        </code>
        <pre className="bg-gray-900 p-3 rounded overflow-auto mb-6">
{`{
  "value": 1.0234,
  "updatedAt": "2025-03-23T20:15:00Z"
}`}
        </pre>

        {/* /api/token-history */}
        <h2 className="text-xl font-semibold mt-8 mb-2">Token History</h2>
        <p>Hourly cumulative ETH mined data:</p>
        <code className="block bg-gray-800 p-2 rounded my-2">
          <a href="/api/token-history" className="text-blue-400" target="_blank">GET /api/token-history</a>
        </code>
        <pre className="bg-gray-900 p-3 rounded overflow-auto mb-6">
{`[
  {
    "hour": "2025-03-26T18:00:00Z",
    "cumulative_reward": 0.00001776052
  }
]`}
        </pre>

        {/* /api/top-contributors */}
        <h2 className="text-xl font-semibold mt-8 mb-2">Top Contributors</h2>
        <p>Wallets with the most positive mining impact:</p>
        <code className="block bg-gray-800 p-2 rounded my-2">
          <a href="/api/top-contributors" className="text-blue-400" target="_blank">GET /api/top-contributors</a>
        </code>
        <pre className="bg-gray-900 p-3 rounded overflow-auto mb-6">
{`[
  {
    "wallet": "0xabc...",
    "positiveScore": 12.34
  }
]`}
        </pre>

        {/* /api/pov/get */}
        <h2 className="text-xl font-semibold mt-8 mb-2">Get Active Polls</h2>
        <p>Returns all currently active polls:</p>
        <code className="block bg-gray-800 p-2 rounded my-2">
          <a href="/api/pov/get" className="text-blue-400" target="_blank">GET /api/pov/get</a>
        </code>
        <pre className="bg-gray-900 p-3 rounded overflow-auto mb-6">
{`[
  {
    "id": "uuid...",
    "question": "Is this system fair?",
    "created_at": "2025-03-26T23:35:23Z"
  }
]`}
        </pre>

        {/* /api/pov/has-voted */}
        <h2 className="text-xl font-semibold mt-8 mb-2">Check If Voted</h2>
        <p>Check if a wallet has already voted on a given poll:</p>
        <code className="block bg-gray-800 p-2 rounded my-2">
          <span className="text-blue-400">GET /api/pov/has-voted?poll_id=&lt;uuid&gt;&wallet=&lt;address&gt;</span>
        </code>
        <pre className="bg-gray-900 p-3 rounded overflow-auto mb-6">
{`{
  "hasVoted": true
}`}
        </pre>

        {/* /api/pov/vote */}
        <h2 className="text-xl font-semibold mt-8 mb-2">Submit Vote</h2>
        <p>Submit a vote in a poll (wallet must have ≥ 0.00001 ETH mined):</p>
        <code className="block bg-gray-800 p-2 rounded my-2">
          <span className="text-blue-400">POST /api/pov/vote</span>
        </code>
        <p className="text-gray-400 text-sm">Body (JSON):</p>
        <pre className="bg-gray-900 p-3 rounded overflow-auto mb-2">
{`{
  "poll_id": "uuid...",
  "wallet_address": "0x123...",
  "vote": "yes"
}`}
        </pre>
        <p className="text-gray-500 text-xs italic mb-6">
          Returns <code>403</code> if not eligible, <code>409</code> if already voted, <code>200</code> if accepted.
        </p>

        <Link href="/" className="text-blue-400 underline mt-10 inline-block">← Back</Link>
      </div>
    </main>
  );
}
