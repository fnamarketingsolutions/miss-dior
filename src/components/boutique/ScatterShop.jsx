import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { perfumes } from '../../data/perfumes'

const CHUNK = 900
const CELL = 280
const INITIAL_COUNT = 7

function hash(n) {
  const x = Math.sin(n * 127.1) * 43758.5453
  return x - Math.floor(x)
}

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

/**
 * Gordon-style infinite scatter floor of perfumes.
 */
export default function ScatterShop({ onClose }) {
  const viewportRef = useRef(null)
  const offset = useRef({ x: 0, y: 0 })
  const dragging = useRef(false)
  const last = useRef({ x: 0, y: 0 })
  const [tick, setTick] = useState(0)
  const [entered, setEntered] = useState(false)
  const [showPerfumes, setShowPerfumes] = useState(false)
  const [perfumesVisible, setPerfumesVisible] = useState(false)
  const [hasPanned, setHasPanned] = useState(false)
  const [selected, setSelected] = useState(null)
  const [size, setSize] = useState({ w: 1200, h: 800 })
  const seeds = useRef(null)

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

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        if (selected) setSelected(null)
        else onClose?.()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, selected])

  const panBy = useCallback((dx, dy) => {
    if (!dx && !dy) return
    offset.current.x -= dx
    offset.current.y -= dy
    if (Math.hypot(offset.current.x, offset.current.y) > 36) setHasPanned(true)
    setTick((n) => n + 1)
  }, [])

  useEffect(() => {
    const el = viewportRef.current
    if (!el) return

    const onWheel = (e) => {
      e.preventDefault()
      panBy(e.deltaX, e.deltaY)
    }

    const onPointerDown = (e) => {
      if (e.target.closest('[data-ui]')) return
      dragging.current = true
      last.current = { x: e.clientX, y: e.clientY }
      el.setPointerCapture(e.pointerId)
    }
    const onPointerMove = (e) => {
      if (!dragging.current) return
      const dx = e.clientX - last.current.x
      const dy = e.clientY - last.current.y
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

  void tick

  const items = useMemo(() => {
    if (!showPerfumes) return []

    if (!hasPanned) {
      const sized = seeds.current
      if (!sized || sized.w !== size.w || sized.h !== size.h) {
        seeds.current = { w: size.w, h: size.h, items: placeInitial(size.w, size.h) }
      }
      return seeds.current.items
    }

    const ox = offset.current.x + size.w / 2
    const oy = offset.current.y + size.h / 2
    return buildItemsInView(ox, oy, size.w, size.h)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- tick drives pan updates
  }, [tick, size.w, size.h, showPerfumes, hasPanned])

  return (
    <div
      className={`fixed inset-0 z-[80] bg-[#f4f2f0] transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
        entered ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div
        ref={viewportRef}
        className="relative h-full w-full cursor-grab overflow-hidden active:cursor-grabbing"
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
          {items.map((it) => (
            <button
              key={it.key}
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                if (it.faded) return
                setSelected(it.perfume)
              }}
              className={`absolute origin-center transition-opacity duration-700 ease-out ${
                perfumesVisible ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                left: it.x,
                top: it.y,
                width: it.size,
                maxWidth: 'min(42vw, 220px)',
                transform: `rotate(${it.rot}deg)`,
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
          ))}
        </div>

        <div
          data-ui
          className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-5 md:p-8"
        >
          <p className="pointer-events-none font-display text-3xl tracking-[0.12em] text-deep md:text-5xl">
            Miss Dior
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

        <p className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 font-body text-xs tracking-wide text-muted md:text-sm">
          Drag or scroll any direction · click a perfume to pick it up
        </p>
      </div>

      {selected && (
        <div
          data-ui
          className="absolute inset-0 z-10 flex items-center justify-center bg-deep/40 p-6 backdrop-blur-sm"
          onClick={() => setSelected(null)}
          role="presentation"
        >
          <div
            className="relative max-w-md rounded-2xl bg-white p-6 shadow-xl md:p-8"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label={selected.name}
          >
            <img
              src={selected.image}
              alt={selected.name}
              className="mx-auto h-56 w-auto object-contain md:h-72"
            />
            <h3 className="mt-5 font-display text-3xl text-deep">{selected.name}</h3>
            <p className="mt-2 font-body text-sm leading-relaxed text-muted">{selected.note}</p>
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="mt-6 rounded-full bg-soft-rose px-5 py-2 font-body text-sm text-white transition hover:bg-deep"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
