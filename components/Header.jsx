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

      <section className="mb-6 px-6 py-3 bg-gray-900 rounded-lg border border-gray-700 shadow-md">
        <p className="text-base font-mono text-green-400">
          Master Math, Mine MM3, and Shape the Future with PoV & PoA.
        </p>
      </section>

      <NavLinks className="mt-2" />
    </header>
  )
}
