'use client'

import Image from 'next/image'
import Link from 'next/link'
import NavLinks from '@/components/NavLinks'

export default function Header() {
  return (
    <header className="w-full flex flex-col items-center py-8 space-y-4">
      <Link href="/" aria-label="Go to homepage">
        <Image
          src="/MM.jpg"
          alt="MathsMine3 Logo"
          width={160}
          height={160}
          className="rounded-full shadow-2xl hover:scale-105 transition-transform duration-300"
          priority
        />
      </Link>

      <section className="mb-6 px-6 py-3 bg-[#0b0f19] rounded-lg border border-[#22d3ee] shadow-md">
        <p className="text-base font-mono text-[#22d3ee]">
          Master Math, Mine MM3, and Shape the Future with PoV & PoA.
        </p>
      </section>

      <NavLinks className="mt-2" />
    </header>
  )
}
