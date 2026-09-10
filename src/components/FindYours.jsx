import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { findYoursPerfumes } from '../data/perfumes'

gsap.registerPlugin(ScrollTrigger)

const ROWS = [
  ['L', 'E', 'T', "'", 'S'],
  ['T', 'A', 'L', 'K'],
]

const BALL_COLORS = ['bg-baby-pink', 'bg-white', 'bg-blush', 'bg-white', 'bg-soft-rose']

function stackName(name) {
  return name.toUpperCase().split(/\s+/)
}

// Computes the exact scale multiplier to cover all 4 screen corners
function getFullscreenCoverScale(circleEl) {
  if (!circleEl) return 3
  const circleWidth = circleEl.offsetWidth || window.innerWidth
  const baseRadius = circleWidth / 2

  // Distance from bottom-center origin to top-left / top-right corners
  const maxCornerDistance = Math.hypot(window.innerWidth / 2, window.innerHeight)

  // 1.1 multiplier ensures edge bleeding with zero clipping artifacts
  return (maxCornerDistance / baseRadius) * 1.15
}

export default function FindYours() {
  const pinRef = useRef(null)

  useEffect(() => {
    const pin = pinRef.current
    if (!pin) return

    const ctx = gsap.context(() => {
      const balls = pin.querySelectorAll('.talk-ball')
      const dome = pin.querySelector('.talk-dome')
      const slides = pin.querySelectorAll('.perfume-beat')
      if (!dome || slides.length === 0) return

      // Initial positions
      gsap.set(balls, { scale: 0.16, opacity: 0 })
      gsap.set(dome, {
        xPercent: -50,
        y: 0,
        scale: 0.15,
        opacity: 0,
        transformOrigin: '50% 0%', // Scales up and outward from the bottom edge
      })
      gsap.set(slides, { opacity: 0, y: 50, pointerEvents: 'none' })

      // Entrance animation for LET'S TALK
      const intro = gsap.timeline({
        scrollTrigger: {
          trigger: pin,
          start: 'top 75%',
          once: true,
        },
      })

      intro
        .to(balls, {
          scale: 1,
          opacity: 1,
          duration: 0.6,
          stagger: 0.04,
          ease: 'power3.out',
        })
        .to(
          balls,
          { scale: 1.08, duration: 0.15, ease: 'power2.out' },
          '+=0.04'
        )
        .to(balls, {
          scale: 1,
          duration: 0.65,
          ease: 'elastic.out(1.15, 0.42)',
        })

      // Main scroll scrub timeline
      const totalUnits = 2.2 + findYoursPerfumes.length * 0.85

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pin,
          start: 'top top',
          end: `+=${Math.round(totalUnits * 100)}%`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true, // Recalculates exact scale on window resize
        },
      })

      // Phase 1: Fade letters & introduce initial half-circle
      tl.to('.lets-talk', {
        opacity: 0,
        y: -30,
        duration: 0.35,
        ease: 'power2.in',
      })
      .to(
        dome,
        {
          opacity: 1,
          scale: 0.5,
          duration: 0.35,
          ease: 'power1.out',
        },
        '-=0.15'
      )

      // Phase 2: Circle expands on scroll to cover 100% width and height
      tl.to(dome, {
        scale: () => getFullscreenCoverScale(dome),
        duration: 1.2,
        ease: 'power2.inOut',
      })

      // Phase 3: Reveal cards over the baby pink backdrop
      slides.forEach((slide, idx) => {
        tl.to(slide, {
          opacity: 1,
          y: 0,
          duration: 0.35,
          pointerEvents: 'auto',
          ease: 'power2.out',
        })

        if (idx < slides.length - 1) {
          tl.to(
            slide,
            {
              opacity: 0,
              y: -40,
              duration: 0.3,
              pointerEvents: 'none',
              ease: 'power2.in',
            },
            '+=0.3'
          )
        } else {
          // Keep final card visible before releasing pin into the footer
          tl.to(slide, { opacity: 1, duration: 0.4 })
        }
      })
    }, pin)

    return () => ctx.revert()
  }, [])

  return (
    <section id="find-yours" className="relative w-full">
      <div
        ref={pinRef}
        className="relative h-screen w-full overflow-hidden bg-[#f6f1ea]"
      >
        {/* LET'S TALK letter grid */}
        <div className="lets-talk pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4 md:gap-5">
            {ROWS.map((letters, row) => (
              <div
                key={row}
                data-row={row}
                className="talk-row flex items-center justify-center gap-3 md:gap-4"
              >
                {letters.map((letter, i) => (
                  <span
                    key={`${row}-${letter}-${i}`}
                    className={`talk-ball flex h-[4.25rem] w-[4.25rem] items-center justify-center rounded-full font-body text-xl font-light text-deep shadow-sm will-change-transform md:h-[6.25rem] md:w-[6.25rem] md:text-3xl ${
                      BALL_COLORS[(row * 3 + i) % BALL_COLORS.length]
                    }`}
                  >
                    {letter}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Baby Pink Expanding Circle */}
        <div
          className="talk-dome pointer-events-none absolute bottom-0 left-1/2 z-20 aspect-square w-[100vw] rounded-full bg-[#fadadd] shadow-[0_-15px_40px_rgba(250,218,221,0.5)] will-change-transform"
          aria-hidden="true"
        />

        {/* Product Cards Container */}
        {findYoursPerfumes.map((perfume) => (
          <div
            key={perfume.id}
            className="perfume-beat absolute inset-0 z-30 flex items-center justify-center px-6"
          >
            <div className="flex w-full max-w-5xl flex-col items-center gap-8 text-center md:flex-row md:gap-14 md:text-left">
              <div className="flex h-64 w-52 shrink-0 items-center justify-center rounded-[2rem] bg-white/90 p-6 shadow-xl backdrop-blur-sm md:h-80 md:w-64">
                <img
                  src={perfume.image}
                  alt={perfume.name}
                  className="max-h-full w-auto object-contain transition-transform duration-500 hover:scale-105"
                />
              </div>

              <div className="max-w-xl">
                <h2 className="font-display text-5xl font-light uppercase leading-[0.88] tracking-tight text-deep md:text-7xl">
                  {stackName(perfume.name).map((line, i) => (
                    <span key={`${perfume.id}-${i}`} className="block">
                      {line}
                    </span>
                  ))}
                </h2>
                <p className="mt-5 font-body text-sm font-light leading-relaxed text-[#4a3b32] md:text-base">
                  {perfume.note}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}