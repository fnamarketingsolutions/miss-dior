import { useEffect, useMemo, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { fallenFromPerfumes } from '../data/perfumes'

gsap.registerPlugin(ScrollTrigger)

function mulberry32(seed) {
  return function rand() {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function layoutBottles(bottles) {
  const rand = mulberry32(0x4d1550)
  const count = bottles.length || 1

  // Left se Right spacing adjust taaki sabhi badi bottles fit ho paayein
  const slotStep = 75 / count

  return bottles.map((perfume, i) => {
    const baseLeft = 4 + i * slotStep
    const jitter = (rand() - 0.5) * (slotStep * 0.15)
    const finalLeft = baseLeft + jitter

    return {
      perfume,
      left: Math.max(1, Math.min(75, finalLeft)),
      rot: rand() * 10 - 5,
      drop: 110 + rand() * 40,
      duration: 1.4 + rand() * 0.5,
      delay: rand() * 2.2,
      initialTilt: (rand() > 0.5 ? 1 : -1) * (18 + rand() * 14),
    }
  })
}

export default function BottleDropCollection() {
  const sectionRef = useRef(null)

  const items = useMemo(() => layoutBottles(fallenFromPerfumes), [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      const bottles = gsap.utils.toArray('.drop-bottle')

      // 1. Initial State: Position bottles above screen
      bottles.forEach((bottle, i) => {
        const item = items[i]
        gsap.set(bottle, {
          transformOrigin: 'bottom center',
          y: `-${item?.drop ?? 120}vh`,
          autoAlpha: 0,
          rotate: (item?.rot ?? 0) + (item?.initialTilt ?? 20),
        })
      })

      // 2. Timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 65%',
          toggleActions: 'play none none reverse',
        },
      })

      // 3. Drop animations
      bottles.forEach((bottle, i) => {
        const item = items[i]
        const fallDuration = item?.duration ?? 1.5
        const restRot = item?.rot ?? 0

        tl.to(
          bottle,
          {
            y: 8,
            autoAlpha: 1,
            rotate: restRot * 0.5,
            duration: fallDuration,
            ease: 'power2.inOut',
          },
          item?.delay ?? 0
        )
          .to(
            bottle,
            {
              y: -4,
              rotate: restRot,
              duration: 0.35,
              ease: 'power1.out',
            },
            `>-0.05`
          )
          .to(bottle, {
            y: 0,
            duration: 0.25,
            ease: 'sine.inOut',
          })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [items])

  return (
    <section
      ref={sectionRef}
      id="collection"
      className="relative z-0 -mt-[22vh] w-full overflow-hidden bg-gradient-to-b from-[#e8eef4] via-[#f4eef2] to-[#f7f5f3]"
    >
      <div className="relative z-10 mx-auto max-w-5xl px-5 pt-[28vh] text-center md:px-8 md:pt-[32vh]">
        <p className="font-body text-xs uppercase tracking-[0.35em] text-soft-rose">
          The collection
        </p>
        <h2 className="mt-3 font-display text-4xl text-deep md:text-5xl">
          Fallen from the garden
        </h2>
        <p className="mx-auto mt-4 max-w-xl font-body text-sm font-light leading-relaxed text-muted md:text-base">
          Small bottles drop from behind the lawn and settle where they land.
        </p>
      </div>

      {/* Main Container with enough height for massive bottles */}
      <div className="pointer-events-none relative mx-auto h-[65vh] min-h-[500px] w-full max-w-[1600px] md:h-[75vh]">
        {items.map((item) => (
          <div
            key={item.perfume.id}
            className="drop-bottle absolute bottom-0 origin-bottom opacity-0 will-change-transform"
            style={{
              left: `${item.left}%`,
              transformOrigin: 'bottom center',
            }}
          >
            {/* 
              FIX: 
              1. w-60 sm:w-80 md:w-[380px] lg:w-[440px] forces EVERY image to take pehli image jaisa massive footprint width.
              2. scale-125 / scale-115 applies additional boost so smaller background card images match Versace's visual scale.
            */}
            <img
              src={item.perfume.image}
              alt={item.perfume.name}
              draggable={false}
              className="h-60 w-60 min-w-[240px] max-w-none select-none object-contain drop-shadow-2xl sm:w-80 md:w-[380px] lg:w-[440px]"
            />
          </div>
        ))}
      </div>
    </section>
  )
}