'use client';

import Link from 'next/link';

export default function ApiPage() {
  return (
    <main className="flex flex-col items-center min-h-screen w-full px-4 pt-10 pb-20 text-sm font-mono text-white bg-black">
      <div className="max-w-2xl w-full">
        <h1 className="text-2xl font-bold mb-6">Public API Documentation</h1>

        <p className="mb-6">
          MathsMine3 provides a public, read-only API that exposes real-time data related to token metrics, game contributions, and community polls. All endpoints return JSON responses.
        </p>

        {/* /api/token-value */}
        <h2 className="text-xl font-semibold mt-8 mb-2">Token Value</h2>
        <p>Returns the current token mining value:</p>
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
        <p>Hourly cumulative token mining values:</p>
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
        <p>List of wallet addresses with the highest mining impact (positive or negative):</p>
        <code className="block bg-gray-800 p-2 rounded my-2">
          <a href="/api/top-contributors" className="text-blue-400" target="_blank">GET /api/top-contributors</a>
        </code>
        <pre className="bg-gray-900 p-3 rounded overflow-auto mb-6">
{`[
  {
    "wallet": "0xabc...",
    "totalImpact": 12.34
  }
]`}
        </pre>

        {/* /api/pov/get */}
        <h2 className="text-xl font-semibold mt-8 mb-2">Active Polls</h2>
        <p>Returns all polls currently open for voting:</p>
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
      </div>
    </main>
  );
}
