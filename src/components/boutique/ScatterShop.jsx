import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { scatterPerfumes } from '../../data/perfumes'

const CHUNK = 900
const CELL = 280
const INITIAL_COUNT = 7
const DRAG_CLICK_PX = 8
const DIM_OPACITY = 0.22

function hash(n) {
  const x = Math.sin(n * 127.1) * 43758.5453
  return x - Math.floor(x)
}
const perfumes = scatterPerfumes
function perfumeAt(ix, iy) {
  const i = Math.abs(Math.floor(ix * 73856093) ^ Math.floor(iy * 19349663)) % perfumes.length
  return perfumes[i]
}

function buildItemsInView(ox, oy, w, h) {
  const pad = 0.85
  const minX = Math.floor((ox - w * pad) / CELL) - 1
  const maxX = Math.ceil((ox + w * pad) / CELL) + 1
  const minY = Math.floor((oy - h * pad) / CELL) - 1
  const maxY = Math.ceil((oy + h * pad) / CELL) + 1
  const items = []

  for (let iy = minY; iy <= maxY; iy++) {
    for (let ix = minX; ix <= maxX; ix++) {
      const jitterX = (hash(ix * 12.3 + iy * 4.1) - 0.5) * CELL * 0.55
      const jitterY = (hash(ix * 7.7 + iy * 19.2) - 0.5) * CELL * 0.55
      if (hash(ix + iy * 97) < 0.42) continue
      const perfume = perfumeAt(ix, iy)
      const rot = (hash(ix * 3 + iy) - 0.5) * 18
      const size = Math.min(w, h) * (0.14 + hash(ix * 5 + iy * 9) * 0.08)
      items.push({
        key: `${ix}:${iy}`,
        perfume,
        x: ix * CELL + jitterX,
        y: iy * CELL + jitterY,
        rot,
        size,
      })
    }
  }
  return items
}

function placeInitial(w, h) {
  const shuffled = [...perfumes].sort(() => Math.random() - 0.5).slice(0, INITIAL_COUNT)
  const cols = w < 640 ? 2 : w < 1024 ? 3 : 4
  return shuffled.map((perfume, i) => {
    const col = i % cols
    const row = Math.floor(i / cols)
    const rows = Math.ceil(shuffled.length / cols)
    const cellW = w / cols
    const cellH = (h * 0.72) / rows
    return {
      key: `seed-${perfume.id}`,
      perfume,
      x: cellW * col + cellW * (0.18 + hash(i * 1.7) * 0.28),
      y: h * 0.24 + cellH * row + cellH * (0.08 + hash(i * 3.1) * 0.22),
      rot: (hash(i * 4.2) - 0.5) * 16,
      size: Math.min(cellW, cellH) * (0.72 + hash(i * 8) * 0.18),
    }
  })
}

function rectRelativeTo(el, root) {
  const aabb = el.getBoundingClientRect()
  const origin = root.getBoundingClientRect()
  const width = el.offsetWidth || aabb.width
  const height = el.offsetHeight || aabb.height
  return {
    left: aabb.left + aabb.width / 2 - width / 2 - origin.left,
    top: aabb.top + aabb.height / 2 - height / 2 - origin.top,
    width,
    height,
  }
}

function destInSlot(slotEl, root, aspect) {
  const slot = rectRelativeTo(slotEl, root)
  const height = slot.height
  const width = height * (aspect || 0.55)
  return {
    left: slot.left + (slot.width - width) / 2,
    top: slot.top,
    width,
    height,
  }
}

function imageAspect(img, fallbackRect) {
  if (img?.naturalWidth && img?.naturalHeight) return img.naturalWidth / img.naturalHeight
  if (fallbackRect?.width && fallbackRect?.height) return fallbackRect.width / fallbackRect.height
  return 0.55
}

/**
 * Gordon-style infinite scatter floor of perfumes.
 */
export default function ScatterShop({ onClose }) {
  const rootRef = useRef(null)
  const viewportRef = useRef(null)
  const flyerRef = useRef(null)
  const slotRef = useRef(null)
  const timelineRef = useRef(null)
  const pickedRef = useRef(null)
  const dismissingRef = useRef(false)
  const dragDistRef = useRef(0)
  const offset = useRef({ x: 0, y: 0 })
  const dragging = useRef(false)
  const last = useRef({ x: 0, y: 0 })
  const [tick, setTick] = useState(0)
  const [entered, setEntered] = useState(false)
  const [showPerfumes, setShowPerfumes] = useState(false)
  const [perfumesVisible, setPerfumesVisible] = useState(false)
  const [hasPanned, setHasPanned] = useState(false)
  const [picked, setPicked] = useState(null)
  const [cardReady, setCardReady] = useState(false)
  const [size, setSize] = useState({ w: 1200, h: 800 })
  const seeds = useRef(null)
  const itemsCache = useRef([])

  pickedRef.current = picked

  useEffect(() => {
    const el = viewportRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setSize({ w: width, h: height })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setEntered(true))
    return () => window.cancelAnimationFrame(frame)
  }, [])

  useEffect(() => {
    if (!entered) return
    const t = window.setTimeout(() => setShowPerfumes(true), 620)
    return () => window.clearTimeout(t)
  }, [entered])

  useEffect(() => {
    if (!showPerfumes) return
    const t = window.setTimeout(() => setPerfumesVisible(true), 40)
    return () => window.clearTimeout(t)
  }, [showPerfumes])

  const panBy = useCallback((dx, dy) => {
    if (pickedRef.current) return
    if (!dx && !dy) return
    offset.current.x -= dx
    offset.current.y -= dy
    if (Math.hypot(offset.current.x, offset.current.y) > 36) setHasPanned(true)
    setTick((n) => n + 1)
  }, [])

  const dismiss = useCallback(() => {
    const current = pickedRef.current
    if (!current || dismissingRef.current) return
    dismissingRef.current = true
    setCardReady(false)

    const flyer = flyerRef.current
    const root = rootRef.current
    const source = root?.querySelector(`[data-bottle-key="${CSS.escape(current.key)}"] img`)
    const dest = source && root ? rectRelativeTo(source, root) : current.fromRect

    timelineRef.current?.kill()

    if (!flyer) {
      setPicked(null)
      dismissingRef.current = false
      return
    }

    gsap.set(flyer, { visibility: 'visible' })
    const tl = gsap.timeline({
      onComplete: () => {
        setPicked(null)
        dismissingRef.current = false
        timelineRef.current = null
      },
    })
    tl.to(flyer, {
      left: dest.left,
      top: dest.top,
      width: dest.width,
      height: dest.height,
      rotation: current.rot,
      y: 0,
      duration: 0.55,
      ease: 'power3.inOut',
    })
    timelineRef.current = tl
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'Escape') return
      if (pickedRef.current) dismiss()
      else onClose?.()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, dismiss])

  useEffect(() => {
    const el = viewportRef.current
    if (!el) return

    const onWheel = (e) => {
      e.preventDefault()
      panBy(e.deltaX, e.deltaY)
    }

    const onPointerDown = (e) => {
      if (pickedRef.current) return
      if (e.target.closest('[data-ui]')) return
      dragging.current = true
      dragDistRef.current = 0
      last.current = { x: e.clientX, y: e.clientY }
      el.setPointerCapture(e.pointerId)
    }
    const onPointerMove = (e) => {
      if (!dragging.current) return
      const dx = e.clientX - last.current.x
      const dy = e.clientY - last.current.y
      dragDistRef.current += Math.hypot(dx, dy)
      last.current = { x: e.clientX, y: e.clientY }
      panBy(-dx, -dy)
    }
    const onPointerUp = (e) => {
      dragging.current = false
      try {
        el.releasePointerCapture(e.pointerId)
      } catch {
        /* ignore */
      }
    }

    el.addEventListener('wheel', onWheel, { passive: false })
    el.addEventListener('pointerdown', onPointerDown)
    el.addEventListener('pointermove', onPointerMove)
    el.addEventListener('pointerup', onPointerUp)
    el.addEventListener('pointercancel', onPointerUp)
    return () => {
      el.removeEventListener('wheel', onWheel)
      el.removeEventListener('pointerdown', onPointerDown)
      el.removeEventListener('pointermove', onPointerMove)
      el.removeEventListener('pointerup', onPointerUp)
      el.removeEventListener('pointercancel', onPointerUp)
    }
  }, [panBy])

  const pickBottle = useCallback((e, it) => {
    e.stopPropagation()
    if (it.faded || pickedRef.current || dismissingRef.current) return
    if (dragDistRef.current > DRAG_CLICK_PX) return

    const root = rootRef.current
    const img = e.currentTarget.querySelector('img')
    if (!root || !img) return

    setCardReady(false)
    setPicked({
      key: it.key,
      perfume: it.perfume,
      fromRect: rectRelativeTo(img, root),
      rot: it.rot,
    })
  }, [])

  useLayoutEffect(() => {
    if (!picked || dismissingRef.current) return undefined
    const flyer = flyerRef.current
    const slot = slotRef.current
    const root = rootRef.current
    if (!flyer || !slot || !root) return undefined

    const from = picked.fromRect
    gsap.set(flyer, {
      position: 'absolute',
      left: from.left,
      top: from.top,
      width: from.width,
      height: from.height,
      rotation: picked.rot,
      y: 0,
      transformOrigin: '50% 50%',
      visibility: 'visible',
    })

    const aspect = imageAspect(flyer, from)
    const dest = destInSlot(slot, root, aspect)
    const lift = window.matchMedia('(min-width: 768px)').matches ? -56 : -40

    const snapToSlot = () => {
      const slotEl = slotRef.current
      const rootEl = rootRef.current
      const flyerEl = flyerRef.current
      if (!slotEl || !rootEl || !flyerEl) return
      gsap.set(flyerEl, destInSlot(slotEl, rootEl, aspect))
    }

    const tl = gsap.timeline({
      onComplete: () => {
        snapToSlot()
        setCardReady(true)
      },
    })
    tl.to(flyer, {
      y: lift,
      rotation: 360,
      duration: 0.55,
      ease: 'power2.inOut',
    })
    tl.set(flyer, { rotation: 0 })
    tl.to(flyer, {
      left: dest.left,
      top: dest.top,
      width: dest.width,
      height: dest.height,
      y: 0,
      duration: 0.65,
      ease: 'power3.inOut',
    })
    timelineRef.current = tl

    return () => {
      tl.kill()
      if (timelineRef.current === tl) timelineRef.current = null
    }
  }, [picked])

  useLayoutEffect(() => {
    if (!picked || !cardReady) return
    const flyer = flyerRef.current
    const slot = slotRef.current
    const root = rootRef.current
    if (!flyer || !slot || !root) return
    const dest = destInSlot(slot, root, imageAspect(flyer, picked.fromRect))
    gsap.set(flyer, dest)
  }, [picked, cardReady, size.w, size.h])

  useEffect(() => () => {
    timelineRef.current?.kill()
  }, [])

  void tick

  const items = useMemo(() => {
    if (!showPerfumes) return []
    if (picked && itemsCache.current.length) return itemsCache.current

    let next = []
    if (!hasPanned) {
      const sized = seeds.current
      if (!sized || sized.w !== size.w || sized.h !== size.h) {
        seeds.current = { w: size.w, h: size.h, items: placeInitial(size.w, size.h) }
      }
      next = seeds.current.items
    } else {
      const ox = offset.current.x + size.w / 2
      const oy = offset.current.y + size.h / 2
      next = buildItemsInView(ox, oy, size.w, size.h)
    }

    itemsCache.current = next
    return next
    // eslint-disable-next-line react-hooks/exhaustive-deps -- tick drives pan updates
  }, [tick, size.w, size.h, showPerfumes, hasPanned, picked])

  return (
    <div
      ref={rootRef}
      className={`fixed inset-0 z-[80] bg-[#f4f2f0] transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
        entered ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div
        ref={viewportRef}
        className={`relative h-full w-full overflow-hidden ${
          picked ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'
        }`}
        style={{ touchAction: 'none' }}
      >
        <div
          className="absolute left-0 top-0 will-change-transform"
          style={{
            width: CHUNK * 8,
            height: CHUNK * 8,
            transform: `translate3d(${-offset.current.x}px, ${-offset.current.y}px, 0)`,
          }}
        >
          {items.map((it) => {
            const isSource = picked?.key === it.key
            let opacity = 0
            if (perfumesVisible) {
              if (isSource) opacity = 0
              else if (picked) opacity = DIM_OPACITY
              else opacity = 1
            }
            return (
              <button
                key={it.key}
                type="button"
                data-bottle-key={it.key}
                onClick={(e) => pickBottle(e, it)}
                className="absolute origin-center transition-opacity duration-700 ease-out"
                style={{
                  left: it.x,
                  top: it.y,
                  width: it.size,
                  maxWidth: 'min(42vw, 220px)',
                  transform: `rotate(${it.rot}deg)`,
                  opacity,
                  visibility: isSource ? 'hidden' : 'visible',
                }}
                aria-label={it.perfume.name}
              >
                <img
                  src={it.perfume.image}
                  alt=""
                  draggable={false}
                  className="h-auto w-full select-none object-contain drop-shadow-md"
                />
              </button>
            )
          })}
        </div>

        <div
          data-ui
          className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-5 md:p-8"
        >
          <p className="pointer-events-none font-display text-3xl tracking-[0.12em] text-deep md:text-5xl">
            NIVA
          </p>
          <button
            type="button"
            data-ui
            onClick={onClose}
            className="pointer-events-auto rounded-full border border-deep/20 bg-white/80 px-4 py-2 font-body text-sm text-deep backdrop-blur transition hover:bg-white"
          >
            Back to boutique
          </button>
        </div>

     
      </div>

      {picked && (
        <>
          <div
            data-ui
            className={`absolute inset-0 z-[85] flex items-center justify-center p-5 transition-opacity duration-300 sm:p-6 md:p-8 ${
              cardReady
                ? 'pointer-events-auto bg-deep/40 opacity-100 backdrop-blur-sm'
                : 'pointer-events-none bg-transparent opacity-0'
            }`}
            onClick={dismiss}
            role="presentation"
          >
            <div
              className="relative w-[min(28rem,92vw)] rounded-2xl bg-white p-5 shadow-xl sm:p-6 md:p-8"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-label={picked.perfume.name}
            >
              <div
                ref={slotRef}
                className="mx-auto h-[clamp(10rem,40vh,18rem)] w-full"
              />
              <h3 className="mt-5 font-display text-2xl text-deep md:text-3xl">{picked.perfume.name}</h3>
              <p className="mt-2 font-body text-sm leading-relaxed text-muted">{picked.perfume.note}</p>
              <button
                type="button"
                onClick={dismiss}
                className="mt-6 rounded-full bg-soft-rose px-5 py-2 font-body text-sm text-white transition hover:bg-deep"
              >
                Close
              </button>
            </div>
          </div>

          <img
            ref={flyerRef}
            src={picked.perfume.image}
            alt={picked.perfume.name}
            draggable={false}
            className="pointer-events-none absolute z-[90] select-none object-contain drop-shadow-lg will-change-transform"
          />
        </>
      )}
    </div>
  )
}
