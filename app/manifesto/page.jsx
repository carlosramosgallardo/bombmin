'use client';

import Link from 'next/link';

export default function ManifestoPage() {
  return (
    <main className="flex flex-col items-center min-h-screen w-full px-4 pt-10 pb-20 text-sm font-mono text-gray-200 bg-black">
      <div className="max-w-3xl w-full">
        <h1 className="text-3xl font-bold mb-8">Principles of Play & Rebellion</h1>

        <section className="mb-8">
          <p>
          As the global economy teeters under scrutiny, the desire for personal financial sovereignty grows stronger. 
          MathsMine3 offers a symbolic stage: here, anyone can "mine" a fake token and interact with the ecosystem using the only identity that truly matters in Web3 — a wallet.

          Participation is completely free. 
          You can mine with a balance of zero, cancel the symbolic 0.00001 ETH transaction at any time, and still affect the system. Donations are optional — impact is not.

          Join the Proof of Vote: respond anonymously yet nomically (by wallet) to yes/no questions on global issues.
          Does one person have multiple wallets? Of course. So what?
          The wife of the Spanish Prime Minister has seven accounts and absolutely nothing happens.

          This is not a financial product. This is a game. This is a rebellion.
          </p>
      </section>

        <p className="text-gray-400 italic mb-6">
          This is not a financial product.
        </p>

        <Link href="/" className="text-blue-400 underline mt-10 inline-block">← Back</Link>
      </div>
    </main>
  );
}
