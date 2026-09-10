import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, Environment } from '@react-three/drei'
import * as THREE from 'three'
import PerfumeBottle from './PerfumeBottle'
import ShopPole from './ShopPole'
import { dioramaPerfumes, getPerfume } from '../../data/perfumes'

// Lowered center to bring the entire curved hill and bottles down
const FLOOR_RADIUS = 10.5
const FLOOR_CENTER_Y = -11.1

/** Height of the curved grass at a given XZ. */
export function floorY(x, z) {
  const d2 = x * x + z * z
  const r2 = FLOOR_RADIUS * FLOOR_RADIUS
  if (d2 >= r2) return FLOOR_CENTER_Y + FLOOR_RADIUS
  return FLOOR_CENTER_Y + Math.sqrt(r2 - d2)
}

function makeGrassTexture() {
  const size = 512
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#3f9a34'
  ctx.fillRect(0, 0, size, size)

  for (let i = 0; i < 14000; i++) {
    const x = Math.random() * size
    const y = Math.random() * size
    const g = 110 + Math.random() * 110
    ctx.fillStyle = `rgb(${28 + Math.random() * 40}, ${g}, ${24 + Math.random() * 36})`
    ctx.fillRect(x, y, 1.5, 2 + Math.random() * 5)
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(12, 12)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 8
  return texture
}

function GardenGround() {
  const grass = useMemo(() => makeGrassTexture(), [])

  return (
    <mesh position={[0, FLOOR_CENTER_Y, 0]} receiveShadow>
      <sphereGeometry args={[FLOOR_RADIUS, 96, 96]} />
      <meshStandardMaterial map={grass} color="#5cb84a" roughness={0.96} metalness={0} />
    </mesh>
  )
}

function CameraRig({ selectedId }) {
  const { camera } = useThree()

  // Default Overview: Elevated and pulled back to keep bottles below text
  // Selected View: Mild frame so only the held photo stays inside the screen
  const targetPos = useMemo(
    () =>
      selectedId
        ? new THREE.Vector3(0, 1.7, 7.1)
        : new THREE.Vector3(0, 2.1, 7.8),
    [selectedId]
  )

  const targetLook = useMemo(
    () =>
      selectedId
        ? new THREE.Vector3(0, 0.45, 1.55)
        : new THREE.Vector3(0, -0.7, 0),
    [selectedId]
  )

  const currentLook = useRef(targetLook.clone())

  useFrame((_, delta) => {
    const factor = 1 - Math.exp(-4.5 * delta)
    camera.position.lerp(targetPos, factor)
    currentLook.current.lerp(targetLook, factor)
    camera.lookAt(currentLook.current)
  })

  return null
}

function GardenBottles({ selectedId, onSelectPerfume }) {
  return (
    <group>
      {dioramaPerfumes.map((slot) => {
        const perfume = getPerfume(slot.perfumeId)
        if (!perfume) return null
        const [x, , z] = slot.position
        return (
          <PerfumeBottle
            key={slot.perfumeId}
            perfume={perfume}
            position={[x, floorY(x, z), z]}
            scale={slot.scale}
            rotation={slot.rotation}
            selected={selectedId === slot.perfumeId}
            dimmed={Boolean(selectedId) && selectedId !== slot.perfumeId}
            onSelect={onSelectPerfume}
          />
        )
      })}
    </group>
  )
}

function SceneContent({ selectedId, onSelectPerfume, onOpenScatter }) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight
        castShadow
        position={[4, 8, 3]}
        intensity={1.35}
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight position={[-3, 4, -2]} intensity={0.35} color="#f7c6d0" />

      <CameraRig selectedId={selectedId} />
      <GardenGround />

      <GardenBottles
        selectedId={selectedId}
        onSelectPerfume={onSelectPerfume}
      />

      {!selectedId && (
        <ShopPole
          position={[2.4, floorY(2.4, 0.35), 0.35]}
          onOpen={onOpenScatter}
        />
      )}

      <ContactShadows
        position={[0, floorY(0, 0) + 0.02, 0]}
        opacity={0.35}
        scale={12}
        blur={2.5}
        far={4}
      />
      <Environment preset="city" />
    </>
  )
}

export default function BoutiqueScene({
  selectedId,
  onSelectPerfume,
  onClearSelection,
  onOpenScatter,
}) {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 2.1, 7.8], fov: 46, near: 0.1, far: 60 }}
      gl={{ antialias: true, alpha: true }}
      onPointerMissed={() => onClearSelection?.()}
      className={`h-full w-full ${selectedId ? 'touch-pan-y' : 'touch-none'}`}
    >
      <Suspense fallback={null}>
        <SceneContent
          selectedId={selectedId}
          onSelectPerfume={onSelectPerfume}
          onOpenScatter={onOpenScatter}
        />
      </Suspense>
    </Canvas>
  )
}