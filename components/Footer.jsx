'use client'

import { useState } from 'react'
import NavLinks from '@/components/NavLinks'

export default function Footer() {
  const [revealed, setRevealed] = useState(false)

  return (
    <footer className="text-center text-sm text-gray-400 mt-12 mb-4 space-y-4">
      <div className="w-full max-w-3xl border-t border-gray-700/50 mb-6 opacity-50 mx-auto" />

      <div className="flex justify-center gap-4 text-blue-500 underline">
        <a href="https://www.youtube.com/@FreakingAI" target="_blank" rel="noopener noreferrer">YouTube</a>
        <a href="https://www.tiktok.com/@freakingai" target="_blank" rel="noopener noreferrer">TikTok</a>
        <a href="https://www.instagram.com/freakingai" target="_blank" rel="noopener noreferrer">Instagram</a>
        <a href="https://x.com/freakingai" target="_blank" rel="noopener noreferrer">X</a>
        <a href="https://github.com/carlosramosgallardo/MathsMine3" target="_blank" rel="noopener noreferrer">GitHub</a>
      </div>

      <div>
        {!revealed ? (
          <button
            onClick={() => setRevealed(true)}
            className="underline text-blue-400 focus:outline-none"
            aria-label="Reveal email"
          >
            Contact
          </button>
        ) : (
          <a href="mailto:botsandpods@gmail.com" className="underline text-blue-400">
            botsandpods@gmail.com
          </a>
        )}
      </div>

      <NavLinks />
    </footer>
  )
}
