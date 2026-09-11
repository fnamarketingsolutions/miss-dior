import { useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { getLenis } from '../lib/lenisStore'

gsap.registerPlugin(ScrollTrigger)

const links = [
  { href: '/#the-scent', label: 'The Scent' },
  { href: '/#shop', label: 'Shop' },
  { href: '/#ritual', label: 'Ritual' },
  { href: '/#gallery', label: 'Gallery' },
  { href: '/contact', label: 'Contact' },
]

export default function Footer() {
  const footerRef = useRef(null)
  const location = useLocation()

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.footer-reveal', {
        y: 36,
        opacity: 0,
        duration: 1.15,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top 88%',
        },
      })
    }, footerRef)

    return () => ctx.revert()
  }, [])

  const handleAnchor = (e, href) => {
    if (!href.startsWith('/#')) return
    if (location.pathname !== '/') return
    e.preventDefault()
    const el = document.getElementById(href.slice(2))
    const lenis = getLenis()
    if (el) {
      if (lenis) lenis.scrollTo(el, { offset: -80 })
      else el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <footer
      ref={footerRef}
      className="relative overflow-hidden bg-gradient-to-b from-[#f9e4ea] via-[#f7f1ee] to-[#f4ebe6]"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-soft-rose/40" />

      <div className="mx-auto max-w-6xl px-5 pb-10 pt-16 md:px-8 md:pt-24">
        <p className="footer-reveal font-body text-[0.68rem] uppercase tracking-[0.42em] text-soft-rose">
          The closing note
        </p>

        <p className="footer-reveal mt-5 font-display text-[clamp(3.5rem,12vw,8.5rem)] leading-[0.85] tracking-[0.06em] text-deep">
          NIVA
        </p>

        <p className="footer-reveal mt-6 max-w-md font-body text-sm font-light leading-relaxed text-muted md:text-base">
          A bouquet of roses for the modern romantic. Worn close, left behind only as a trail.
        </p>

        <nav className="footer-reveal mt-10 flex flex-wrap gap-x-8 gap-y-3">
          {links.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={(e) => handleAnchor(e, link.href)}
              className="font-body text-xs uppercase tracking-[0.28em] text-muted transition hover:text-deep"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="footer-reveal mt-14 flex flex-col gap-3 border-t border-deep/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-body text-[0.7rem] uppercase tracking-[0.22em] text-muted">
            Eau de Parfum
          </p>
          <p className="font-body text-[0.7rem] tracking-wide text-muted">
            © {new Date().getFullYear()} NIVA. Inspired fragrance showcase.
          </p>
        </div>
      </div>
    </footer>
  )
}
