'use client'

import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'

export default function PovPage() {
  const [poll, setPoll] = useState(null)
  const [voted, setVoted] = useState(false)
  const [loading, setLoading] = useState(false)
  const { address, isConnected } = useAccount()

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

  const submitVote = async (vote) => {
    if (!isConnected || !address) {
      alert('Please connect your wallet to vote.')
      return
    }

    setLoading(true)

    const res = await fetch('/api/pov/vote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        poll_id: poll.id,
        wallet_address: address,
        vote
      })
    })

    const result = await res.json()
    setLoading(false)

    if (res.ok) {
      alert('✅ Vote recorded!')
      setVoted(true)
    } else {
      alert(`❌ ${result.error || 'Unable to vote'}`)
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      <h1 className="text-4xl font-bold text-center mb-6">Proof of Vote</h1>

      {!isConnected ? (
        <p className="text-center text-gray-500 italic">Connect your wallet to vote.</p>
      ) : poll ? (
        voted ? (
          <p className="text-center text-green-500 text-lg">✅ Thanks for voting!</p>
        ) : (
          <div className="text-center">
            <p className="text-xl font-semibold mb-4">{poll.question}</p>
            <div className="flex justify-center gap-4">
              <button
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                onClick={() => submitVote('yes')}
                disabled={loading}
              >
                Yes
              </button>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                onClick={() => submitVote('no')}
                disabled={loading}
              >
                No
              </button>
            </div>
          </div>
        )
      ) : (
        <p className="text-center text-gray-600 italic">Loading poll...</p>
      )}
    </div>
  )
}
