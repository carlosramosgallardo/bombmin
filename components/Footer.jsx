'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Footer() {
  const [revealed, setRevealed] = useState(false);

  return (
    <footer className="text-center text-sm text-gray-400 mt-12 mb-4 space-y-4">
      <div className="flex justify-center gap-4 text-blue-500 underline">
        <a
          href="https://www.youtube.com/@FreakingAI"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="YouTube"
        >
          YouTube
        </a>
        <a
          href="https://www.tiktok.com/@freakingai"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="TikTok"
        >
          TikTok
        </a>
        <a
          href="https://www.instagram.com/freakingai"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
        >
          Instagram
        </a>
        <a
          href="https://x.com/freakingai"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="X (Twitter)"
        >
          X
        </a>
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
          <a
            href="mailto:botsandpods@gmail.com"
            className="underline text-blue-400"
          >
            botsandpods@gmail.com
          </a>
        )}
      </div>

      <div className="text-gray-500 space-x-3">
        <Link href="/legal" className="underline hover:text-white">
          Legal Notice
        </Link>
        <Link href="/manifesto" className="underline hover:text-white">
          Manifesto
        </Link>
        <a
          href="https://github.com/carlosramosgallardo/MathsMine3"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-white"
        >
          View on GitHub
        </a>
        <Link href="/api" className="underline hover:text-white">
          API
        </Link>
      </div>
    </footer>
  );
}
