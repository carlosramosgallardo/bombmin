'use client';

import Link from 'next/link';

export default function ApiPage() {
  return (
    <main className="flex flex-col items-center min-h-screen w-full px-4 pt-10 pb-20 text-lg font-mono text-white bg-black">
      <div className="max-w-2xl w-full">
        <Link href="/" className="text-blue-400 underline mb-6 inline-block">← Back</Link>
        <h1 className="text-2xl font-bold mb-4">Public API Documentation</h1>

        <p className="mb-4">
          MathsMine3 provides a simple public API to access real-time game data. All responses are JSON.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">🔹 Token Value</h2>
        <p className="mb-2">Fetch the current in-game token value:</p>
        <code className="block bg-gray-800 p-2 rounded mb-4">
          <a href="https://mathsmine3.xyz/api/token-value" target="_blank" className="text-blue-400">
            GET https://mathsmine3.xyz/api/token-value
          </a>
        </code>
        <p className="mb-2">Example response:</p>
        <pre className="bg-gray-900 p-3 rounded overflow-auto mb-6">
{`{
  "value": 1.0234,
  "updatedAt": "2025-03-23T20:15:00Z"
}`}
        </pre>
        <p className="mb-2">Get the top 10 most active contributor wallets:</p>
        <code className="block bg-gray-800 p-2 rounded mb-4">
          <a href="https://mathsmine3.xyz/api/top-contributors" target="_blank" className="text-blue-400">
            GET https://mathsmine3.xyz/api/top-contributors
          </a>
        </code>
        <p className="mb-2">Example response:</p>
        <pre className="bg-gray-900 p-3 rounded overflow-auto">
{`[
  { "wallet": "0x123...cDe", "positiveScore": 14.5 },
  { "wallet": "0x456...aBc", "positiveScore": 12.3 }
]`}
        </pre>
        <Link href="/" className="text-blue-400 underline mt-6 inline-block">← Back</Link>
      </div>
    </main>
  );
}
