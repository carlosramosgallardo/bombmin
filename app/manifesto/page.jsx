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
          </p>
        </section>

        <section className="mb-8">
          <p>
            Participation is completely free.
            You can mine with a balance of zero, cancel the symbolic 0.00001 ETH transaction at any time, and still affect the system.
            Donations are optional — impact is not.
          </p>
        </section>

        <section className="mb-8">
          <p>
            Join the <a href="/pov" className="text-blue-400 underline">Proof of Vote</a>:
            respond anonymously yet nomically (by wallet) to yes/no questions on global issues.
          </p>
        </section>

        <section className="mb-8">
          <p>
            Create your own anonymous yes/no questions via <a href="/poa" className="text-blue-400 underline">Proof of Ask</a>:
            submit polls to the community anonymously and see how the world responds to your ideas.
          </p>
        </section>

        <section className="mb-8">
          <p>
            The platform is completely transparent, providing a public <a href="/api" className="text-blue-400 underline">API</a> that lets you query, at any moment, real-time and historical data on the token’s value, wallet contributions, polls, and voting results.
          </p>
        </section>

        <section className="mb-8">
          <p>
            Does one person have multiple wallets? Of course. So what?
            The wife of the Spanish Prime Minister has seven bank accounts and absolutely nothing happens.
          </p>
        </section>

        <section className="mb-8">
          <p>
            This is not a financial product. This is a game. This is a rebellion.
          </p>
        </section>

        <section className="mb-8">
          <p className="text-xs italic">
            MathsMine3 reserves the right to remove any offensive or inappropriate content. Users are responsible for the content they publish.
          </p>
        </section>
      </div>
    </main>
  );
}
