'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function NavLinks({ className = '' }) {
  const pathname = usePathname()

  const linkClass = (href) =>
    `underline hover:text-white ${
      pathname === href ? 'text-white font-semibold' : ''
    }`

  return (
    <div className={`text-base text-gray-400 space-x-3 ${className}`}>
      <Link href="/theory" className={linkClass('/theory')}>Math to Mine</Link>
      <Link href="/" className={linkClass('/')}>MM3</Link>
      <Link href="/pov" className={linkClass('/pov')}>Poof of Vote</Link>
      <Link href="/poa" className={linkClass('/poa')}>Proof of Ask</Link>
      <Link href="/api" className={linkClass('/api')}>API</Link>
      <Link href="/manifesto" className={linkClass('/manifesto')}>Manifesto</Link>
    </div>
  )
}
