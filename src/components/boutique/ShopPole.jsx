import { useState } from 'react'
import { Html } from '@react-three/drei'

/**
 * Yellow diamond SHOP pole — opens the infinite scatter layout.
 */
export default function ShopPole({ position = [2.35, 0.02, 0.35], onOpen }) {
  const [hovered, setHovered] = useState(false)

  return (
    <group
      position={position}
      onClick={(e) => {
        e.stopPropagation()
        onOpen?.()
      }}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        setHovered(false)
        document.body.style.cursor = 'auto'
      }}
    >
      {/* Post */}
      <mesh position={[0, 0.95, 0]} castShadow>
        <cylinderGeometry args={[0.035, 0.04, 1.9, 12]} />
        <meshStandardMaterial color="#9a9a9a" metalness={0.7} roughness={0.35} />
      </mesh>

      {/* Diamond sign */}
      <group
        position={[0, 1.95, 0]}
        rotation={[0, 0, Math.PI / 4]}
        scale={hovered ? 1.08 : 1}
      >
        <mesh castShadow>
          <boxGeometry args={[0.72, 0.72, 0.06]} />
          <meshStandardMaterial color="#f5d547" metalness={0.25} roughness={0.45} />
        </mesh>
        <mesh position={[0, 0, 0.035]}>
          <boxGeometry args={[0.62, 0.62, 0.02]} />
          <meshStandardMaterial color="#efc825" metalness={0.2} roughness={0.5} />
        </mesh>
      </group>

      <Html
        position={[0, 1.95, 0.12]}
        center
        style={{ pointerEvents: 'none', userSelect: 'none' }}
      >
        <span
          style={{
            fontFamily: 'Outfit, system-ui, sans-serif',
            fontWeight: 700,
            fontSize: '14px',
            letterSpacing: '0.08em',
            color: '#1a1a1a',
            display: 'block',
          }}
        >
          SHOP
        </span>
      </Html>
    </group>
  )
}
