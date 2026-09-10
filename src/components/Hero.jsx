import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import bottle from '../assets/perfume3.png'

export default function Hero() {
  const sectionRef = useRef(null)
  const bottleRef = useRef(null)
  const textRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      mm.add('(min-width: 768px)', () => {
        gsap.set(bottleRef.current, {
          x: '65vw',
          y: 40,
          rotate: 12,
          opacity: 0,
          scale: 0.85,
        })

        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

        tl.to(bottleRef.current, {
          x: 0,
          y: -20,
          rotate: -4,
          opacity: 1,
          scale: 1,
          duration: 1.6,
        })
          .to(
            bottleRef.current,
            {
              x: 0,
              y: 0,
              rotate: 0,
              duration: 0.9,
              ease: 'power2.inOut',
            },
            '-=0.3',
          )
          .to(bottleRef.current, {
            y: -18,
            duration: 2.4,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
          })
      })

      mm.add('(max-width: 767px)', () => {
        gsap.set(bottleRef.current, {
          x: '40vw',
          y: 30,
          rotate: 8,
          opacity: 0,
          scale: 0.9,
        })

        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

        tl.to(bottleRef.current, {
          x: 0,
          y: -10,
          rotate: -3,
          opacity: 1,
          scale: 1,
          duration: 1.3,
        })
          .to(
            bottleRef.current,
            {
              y: 0,
              rotate: 0,
              duration: 0.7,
              ease: 'power2.inOut',
            },
            '-=0.2',
          )
          .to(bottleRef.current, {
            y: -12,
            duration: 2.2,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
          })
      })

      gsap.from(textRef.current?.children || [], {
        y: 36,
        opacity: 0,
        duration: 1,
        stagger: 0.14,
        ease: 'power3.out',
        delay: 0.35,
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative flex min-h-svh items-center overflow-hidden pt-20"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 70% 40%, #f7c6d0 0%, transparent 55%), radial-gradient(ellipse 70% 50% at 20% 80%, #f9e4ea 0%, transparent 50%), linear-gradient(180deg, #fff 0%, #f9e4ea 100%)',
        }}
      />
      <div
        className="pointer-events-none absolute -right-20 top-1/4 h-72 w-72 rounded-full bg-baby-pink/40 blur-3xl md:h-[28rem] md:w-[28rem]"
        aria-hidden
      />

      <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-8 px-5 py-12 md:grid-cols-2 md:gap-4 md:px-8 md:py-20">
        <div ref={textRef} className="order-2 text-center md:order-1 md:text-left">
          <p className="font-display text-5xl tracking-[0.2em] text-deep md:text-7xl lg:text-8xl">
            MISS DIOR
          </p>
          <h1 className="mt-5 font-display text-2xl font-medium italic text-deep md:text-3xl lg:text-4xl">
            A rose for every woman who dares to bloom
          </h1>
          <p className="mx-auto mt-4 max-w-md font-body text-base font-light leading-relaxed text-muted md:mx-0 md:text-lg">
            Soft petals, luminous woods, and a trail that lingers like a
            whispered secret.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 md:justify-start">
            <a
              href="#the-scent"
              className="rounded-full bg-deep px-7 py-3 font-body text-sm tracking-wide text-white transition hover:bg-soft-rose"
            >
              Discover the scent
            </a>
            <Link
              to="/contact"
              className="rounded-full border border-soft-rose px-7 py-3 font-body text-sm tracking-wide text-deep transition hover:bg-light-pink"
            >
              
              Find yours
            </Link>
          </div>
        </div>

        <div className="order-1 flex h-full w-full items-center justify-center overflow-visible md:order-2">
  <img
    ref={bottleRef}
    src={bottle}
    alt="Miss Dior perfume bottle"
    className="h-auto w-[90%] scale-110 object-contain drop-shadow-2xl sm:scale-120 md:w-[min(70vw,640px)] md:scale-125 lg:w-[min(65vw,750px)]"
  />
</div>
      </div>
    </section>
  )
}
