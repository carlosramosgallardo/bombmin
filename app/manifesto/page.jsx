'use client';

import Link from 'next/link';

export default function ManifestoPage() {
  return (
    <main className="flex flex-col items-center min-h-screen w-full px-4 pt-10 pb-20 text-sm font-mono text-gray-200 bg-black">
      <div className="max-w-3xl w-full">
        <Link href="/" className="text-blue-400 underline mb-6 inline-block">← Back</Link>
        <h1 className="text-3xl font-bold mb-8">📜 MathsMine3: Principles of Play & Rebellion</h1>

        <p className="mb-6">
          MathsMine3 is more than a game. It's a symbolic system — a digital thought experiment disguised as entertainment.
          A call to action, a ritual, a pattern. Behind each number lies a reaction, and behind each click lies intent.
        </p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">🧱 Foundational Ideas</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Truth is hidden in simplicity. Math reveals what systems conceal.</li>
            <li>Speed is impact. Hesitation is cost. Every second matters.</li>
            <li>Every player affects the whole. There are no passive observers.</li>
            <li>There is no real token — only symbolic energy and social tension.</li>
            <li>Freedom is not given; it's practiced.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">⚖️ Digital Rebellion</h2>
          <p>
            The system is broken. Middlemen monetize inefficiency. Institutions inflate value by inflating complexity.
            MathsMine3 proposes an absurd alternative: a fake token, mined through mental speed, affecting value directly.
            No banks. No fees. Just clicks and consequences.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">📈 Speculation as Survival</h2>
          <p>
            The future is not earned. It is simulated, iterated, and gamified.
            MathsMine3 models a system where speculation and skill are inseparable.
            Half survival. Half speculation. All symbolic.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">📖 The Unwritten Rules</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>Do not wait for permission to play.</li>
            <li>Do not play to win. Play to affect.</li>
            <li>Do not believe the token is real — it’s more dangerous that way.</li>
            <li>If it makes you question value, you've already won.</li>
            <li>If many play, something will shift. But not what you expect.</li>
          </ol>
        </section>

        <p className="text-gray-400 italic mb-6">
          This is not a financial product.
        </p>

        <Link href="/" className="text-blue-400 underline mt-10 inline-block">← Back</Link>
      </div>
    </main>
  );
}
