export const dynamic = 'force-dynamic';
'use client'

import { useEffect, useState } from 'react'

export default function PovPage() {
  const [poll, setPoll] = useState(null)

  useEffect(() => {
    const fetchPoll = async () => {
      const res = await fetch('/api/pov/get')
      const data = await res.json()
      if (data?.length > 0) {
        setPoll(data[0])
      }
    }

    fetchPoll()
  }, [])

  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      <h1 className="text-4xl font-bold text-center mb-6">🗳️ Proof of Vote (PoV)</h1>

      {poll ? (
        <div className="text-center">
          <p className="text-xl font-semibold mb-4">{poll.question}</p>
          <button className="bg-green-600 text-white px-4 py-2 rounded mr-2">Yes</button>
          <button className="bg-red-600 text-white px-4 py-2 rounded">No</button>
        </div>
      ) : (
        <p className="text-center text-gray-600 italic">Loading poll...</p>
      )}
    </div>
  )
}
