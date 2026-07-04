import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Particle count
const COUNT = 120

export default function Particles() {
  const meshRef = useRef()

  // Generate random positions
  const positions = new Float32Array(COUNT * 3)
  const speeds = new Float32Array(COUNT)
  for (let i = 0; i < COUNT; i++) {
    positions[i * 3 + 0] = (Math.random() - 0.5) * 14
    positions[i * 3 + 1] = (Math.random() - 0.5) * 10
    positions[i * 3 + 2] = (Math.random() - 0.5) * 8 - 4
    speeds[i] = 0.05 + Math.random() * 0.15
  }

  const posAttr = useRef(new THREE.BufferAttribute(positions, 3))

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const pos = posAttr.current.array
    for (let i = 0; i < COUNT; i++) {
      pos[i * 3 + 1] += speeds[i] * 0.008
      // Reset when too high
      if (pos[i * 3 + 1] > 5.5) {
        pos[i * 3 + 1] = -5.5
      }
    }
    posAttr.current.needsUpdate = true
  })

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          ref={posAttr}
          attach="attributes-position"
          array={positions}
          count={COUNT}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        color="#6C63FF"
        transparent
        opacity={0.5}
        sizeAttenuation
      />
    </points>
  )
}
