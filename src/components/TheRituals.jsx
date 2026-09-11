import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import wearDior1 from '../assets/wear-dior1.mp4'
import wearDior2 from '../assets/wear-dior2.mp4'
import wearDior3 from '../assets/wear-dior3.mp4'

gsap.registerPlugin(ScrollTrigger)

const moments = [
  {
    step: '01',
    title: 'Pulse points',
    desc: 'Touch wrists, neck, and the hollow of the throat — where warmth unlocks the rose.',
    videoSrc: wearDior1,
    poster: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1200&q=80',
  },
  {
    step: '02',
    title: 'Morning mist',
    desc: 'A light veil after bathing. Let it bloom as you move through the day.',
    videoSrc: wearDior2,
    poster: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1200&q=80',
  },
  {
    step: '03',
    title: 'Evening trail',
    desc: 'A final spray on hair or scarf — so the night remembers you.',
    videoSrc: wearDior3,
    poster: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=1200&q=80',
  },
]

export default function TheRituals() {
  const containerRef = useRef(null)
  const pinRef = useRef(null)
  const layersRef = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      const layers = layersRef.current.filter(Boolean)
      const pin = pinRef.current
      if (!pin || layers.length === 0) return

      // Initial state
      layers.forEach((layer) => {
        const videoWrapper = layer.querySelector('.ritual-video-wrapper')
        const overlay = layer.querySelector('.ritual-overlay')
        const text = layer.querySelector('.ritual-text-content')

        gsap.set(videoWrapper, {
          scale: 0.85,
          opacity: 0,
          borderRadius: '2rem',
        })
        gsap.set(overlay, { opacity: 0 })
        gsap.set(text, { y: 40, opacity: 0 })
      })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pin,
          start: 'top top',
          end: '+=300%',
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      })

      layers.forEach((layer, i) => {
        const videoWrapper = layer.querySelector('.ritual-video-wrapper')
        const overlay = layer.querySelector('.ritual-overlay')
        const text = layer.querySelector('.ritual-text-content')

        // Fade out previous slide
        if (i > 0) {
          const prev = layers[i - 1]
          const prevWrapper = prev.querySelector('.ritual-video-wrapper')
          const prevText = prev.querySelector('.ritual-text-content')

          tl.to(
            prevText,
            { y: -30, opacity: 0, duration: 0.35, ease: 'power2.in' },
            `step-${i}`
          ).to(
            prevWrapper,
            { opacity: 0, scale: 0.95, duration: 0.4, ease: 'power2.in' },
            `step-${i}`
          )
        }

        // Animate current slide in
        tl.to(
          videoWrapper,
          {
            opacity: 1,
            scale: 1,
            borderRadius: '1rem',
            duration: 1,
            ease: 'power2.out',
          },
          i === 0 ? 'start' : `step-${i}+=0.2`
        )
          .to(
            overlay,
            { opacity: 0.45, duration: 0.5, ease: 'none' },
            '-=0.5'
          )
          .to(
            text,
            { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' },
            '-=0.4'
          )

        // Hold pause between steps
        if (i < layers.length - 1) {
          tl.to({}, { duration: 0.3 })
        }
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={containerRef} id="ritual" className="relative w-full bg-[#0e1116]">
      {/* Intro Header */}
      <div className="relative z-10 mx-auto max-w-5xl px-6 py-16 text-center md:py-24">
        <p className="text-xs uppercase tracking-[0.35em] text-[#e8b4b8]">
          The Ritual
        </p>
        <h2 className="mt-3 text-3xl font-light tracking-wide text-white md:text-5xl">
          How to wear NIVA
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm font-light leading-relaxed text-[#c2cbd6] md:text-base">
          Three quiet gestures that turn fragrance into presence.
        </p>
      </div>

      {/* Pinned Video Container */}
      <div
        ref={pinRef}
        className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-[#0e1116] px-4 md:px-8"
      >
        {moments.map((item, idx) => (
          <div
            key={item.step}
            ref={(el) => {
              layersRef.current[idx] = el
            }}
            className="absolute inset-0 flex items-center justify-center p-4 md:p-8"
            style={{ zIndex: idx + 1 }}
          >
            {/* Responsive Video Frame - shows full video without over-cropping */}
            <div className="ritual-video-wrapper relative flex h-full w-full max-h-[82vh] max-w-5xl items-center justify-center overflow-hidden rounded-2xl shadow-2xl">
              <video
                src={item.videoSrc}
                poster={item.poster}
                autoPlay
                muted
                loop
                playsInline
                className="h-full w-full object-contain md:object-cover" 
              />

              {/* Tint overlay for contrast */}
              <div className="ritual-overlay absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/40" />

              {/* Text content inside the card frame */}
              <div className="ritual-text-content absolute bottom-8 left-0 right-0 z-10 mx-auto max-w-2xl px-6 text-center text-white md:bottom-16">
                <span className="text-3xl font-light tracking-widest text-[#f5d0d8] md:text-5xl">
                  {item.step}
                </span>
                <h3 className="mt-2 text-2xl font-light md:text-4xl">
                  {item.title}
                </h3>
                <p className="mx-auto mt-3 max-w-lg text-sm font-light leading-relaxed text-white/90 md:text-base">
                  {item.desc}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}