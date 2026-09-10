import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

const PLANE_H = 1.9
const ALPHA_HIT = 12

function readImagePixels(img) {
  const w = img?.width
  const h = img?.height
  if (!w || !h) return null
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) return null
  ctx.drawImage(img, 0, 0)
  try {
    return { data: ctx.getImageData(0, 0, w, h).data, w, h }
  } catch {
    return null
  }
}

/** Fraction of the photo below the visible bottle base (transparent padding). */
function measureBottomPad(pixels) {
  if (!pixels) return 0
  const { data, w, h } = pixels
  for (let y = h - 1; y >= 0; y -= 1) {
    for (let x = 0; x < w; x += 2) {
      if (data[(y * w + x) * 4 + 3] > ALPHA_HIT) {
        return (h - 1 - y) / h
      }
    }
  }
  return 0
}

function alphaAt(pixels, uv) {
  if (!pixels || !uv) return 0
  const { data, w, h } = pixels
  const x = Math.min(w - 1, Math.max(0, Math.floor(uv.x * w)))
  const y = Math.min(h - 1, Math.max(0, Math.floor((1 - uv.y) * h)))
  return data[(y * w + x) * 4 + 3]
}

/**
 * Catalog photo standing on the lawn. Click lifts and scales it without
 * rotating, so the photo does not collapse or crop.
 */
export default function PerfumeBottle({
  perfume,
  position,
  scale = 1,
  rotation = 0,
  selected,
  dimmed,
  onSelect,
}) {
  const group = useRef(null)
  const pixelsRef = useRef(null)
  const [hovered, setHovered] = useState(false)
  const held = useRef(new THREE.Vector3(0, -0.15, 1.55))
  const home = useRef(new THREE.Vector3(...position))
  const texture = useTexture(perfume.image)
  const [plane, setPlane] = useState({ w: 1.2, h: PLANE_H })
  const [baseSink, setBaseSink] = useState(0)

  useLayoutEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace
    texture.anisotropy = 8
    texture.needsUpdate = true

    const img = texture.image
    const pixels = readImagePixels(img)
    pixelsRef.current = pixels
    if (img?.width && img?.height) {
      const aspect = img.width / img.height
      const w = Math.min(PLANE_H * aspect * 1.2, 2.6)
      const h = PLANE_H
      setPlane({ w, h })
      // Sit the opaque bottle base on the grass, not the transparent padding.
      setBaseSink(measureBottomPad(pixels) * h)
    }
  }, [texture])

  home.current.set(position[0], position[1] - baseSink, position[2])

  useFrame((_, delta) => {
    if (!group.current) return
    const target = selected ? held.current : home.current
    group.current.position.lerp(target, 1 - Math.exp(-6 * delta))
    const targetScale = selected ? scale * 0.92 : hovered && !dimmed ? scale * 1.08 : scale
    const s = THREE.MathUtils.damp(group.current.scale.x, targetScale, 8, delta)
    group.current.scale.setScalar(s)
    group.current.rotation.y = THREE.MathUtils.damp(
      group.current.rotation.y,
      selected ? 0 : rotation,
      6,
      delta,
    )
    const opacity = dimmed && !selected ? 0 : 1
    group.current.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material.transparent = true
        child.material.opacity = THREE.MathUtils.damp(
          child.material.opacity ?? 1,
          opacity,
          8,
          delta,
        )
      }
    })
  })

  const raycastOpaque = useMemo(
    () =>
      function raycastOpaque(raycaster, intersects) {
        if (dimmed) return
        const pixels = pixelsRef.current
        if (!pixels) return
        const hits = []
        THREE.Mesh.prototype.raycast.call(this, raycaster, hits)
        for (const hit of hits) {
          if (alphaAt(pixels, hit.uv) > ALPHA_HIT) intersects.push(hit)
        }
      },
    [dimmed],
  )

  return (
    <group
      ref={group}
      position={[position[0], position[1] - baseSink, position[2]]}
      scale={scale}
      rotation={[0, rotation, 0]}
    >
      <mesh
        position={[0, plane.h / 2, 0]}
        renderOrder={2}
        raycast={raycastOpaque}
        userData={{ perfumeId: perfume.id }}
        onClick={(e) => {
          e.stopPropagation()
          const top = e.intersections?.find((hit) => hit.object.userData?.perfumeId)
          if (top && top.object.userData.perfumeId !== perfume.id) return
          onSelect?.(perfume.id)
        }}
        onPointerOver={(e) => {
          e.stopPropagation()
          if (dimmed) return
          setHovered(true)
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          setHovered(false)
          document.body.style.cursor = 'auto'
        }}
      >
        <planeGeometry args={[plane.w, plane.h]} />
        <meshStandardMaterial
          map={texture}
          transparent
          alphaTest={0.02}
          roughness={0.85}
          metalness={0}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}
