import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Sphere, Box, Torus, Octahedron } from '@react-three/drei'
import * as THREE from 'three'

// Tech stack items with colors
const TECH_ITEMS = [
  { label: 'Python',          color: '#3B82F6', emissive: '#1D4ED8', shape: 'sphere',      pos: [-3.5,  1.0, -1.0] },
  { label: 'Java',            color: '#EF4444', emissive: '#991B1B', shape: 'box',         pos: [ 3.2,  0.5,  0.5] },
  { label: 'ML',              color: '#A855F7', emissive: '#6B21A8', shape: 'octahedron',  pos: [-1.5, -2.0, -0.5] },
  { label: 'React',           color: '#06B6D4', emissive: '#0E7490', shape: 'torus',       pos: [ 2.0,  2.2, -1.5] },
  { label: 'SQL',             color: '#F59E0B', emissive: '#B45309', shape: 'box',         pos: [-3.0, -1.5,  0.8] },
  { label: 'TensorFlow',      color: '#FF6B35', emissive: '#C2410C', shape: 'sphere',      pos: [ 0.5,  2.8, -2.0] },
  { label: 'OpenCV',          color: '#10B981', emissive: '#047857', shape: 'octahedron',  pos: [ 3.8, -1.8,  0.0] },
  { label: 'Forensics',       color: '#EC4899', emissive: '#9D174D', shape: 'torus',       pos: [-2.5,  2.5,  1.0] },
  { label: 'Docker',          color: '#0EA5E9', emissive: '#0369A1', shape: 'box',         pos: [ 1.2, -2.8, -1.0] },
  { label: 'Web Dev',         color: '#8B5CF6', emissive: '#5B21B6', shape: 'sphere',      pos: [-0.8,  0.8,  2.0] },
]

function Shape({ shape, color, emissive }) {
  const memoColor = useMemo(() => new THREE.Color(color), [color])
  const memoEmissive = useMemo(() => new THREE.Color(emissive), [emissive])

  const matProps = {
    color: memoColor,
    emissive: memoEmissive,
    emissiveIntensity: 0.3,
    roughness: 0.25,
    metalness: 0.7,
    envMapIntensity: 1.0,
  }

  switch (shape) {
    case 'sphere':
      return (
        <Sphere args={[0.35, 32, 32]}>
          <meshStandardMaterial {...matProps} />
        </Sphere>
      )
    case 'box':
      return (
        <Box args={[0.55, 0.55, 0.55]}>
          <meshStandardMaterial {...matProps} />
        </Box>
      )
    case 'octahedron':
      return (
        <Octahedron args={[0.4]}>
          <meshStandardMaterial {...matProps} />
        </Octahedron>
      )
    case 'torus':
      return (
        <Torus args={[0.28, 0.12, 16, 48]}>
          <meshStandardMaterial {...matProps} />
        </Torus>
      )
    default:
      return (
        <Sphere args={[0.35, 32, 32]}>
          <meshStandardMaterial {...matProps} />
        </Sphere>
      )
  }
}

function FloatingItem({ label, color, emissive, shape, initialPos, mouseRef }) {
  const groupRef = useRef()

  // Unique random seed per item (stable across renders)
  const seed = useMemo(() => ({
    bobSpeed:    0.4 + Math.random() * 0.6,
    bobAmp:      0.15 + Math.random() * 0.2,
    bobOffset:   Math.random() * Math.PI * 2,
    driftSpeed:  0.12 + Math.random() * 0.12,
    driftAmp:    0.08 + Math.random() * 0.08,
    driftOffset: Math.random() * Math.PI * 2,
    rotX:        (Math.random() - 0.5) * 0.4,
    rotY:        (Math.random() - 0.5) * 0.8,
    rotZ:        (Math.random() - 0.5) * 0.3,
  }), [])

  // Current "home" position that slowly drifts
  const home = useRef(new THREE.Vector3(...initialPos))
  const velocity = useRef(new THREE.Vector3())
  const currentPos = useRef(new THREE.Vector3(...initialPos))

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime

    // Bobbing Y offset
    const bob = Math.sin(t * seed.bobSpeed + seed.bobOffset) * seed.bobAmp

    // Gentle drift (circular Lissajous)
    const driftX = Math.sin(t * seed.driftSpeed + seed.driftOffset) * seed.driftAmp * 2
    const driftZ = Math.cos(t * seed.driftSpeed * 0.7 + seed.driftOffset) * seed.driftAmp

    // Target = home + drift + bob
    const targetX = home.current.x + driftX
    const targetY = home.current.y + bob
    const targetZ = home.current.z + driftZ

    // Mouse repulsion
    const mx = mouseRef.current.x
    const my = mouseRef.current.y
    const dx = currentPos.current.x - mx * 5
    const dy = currentPos.current.y - my * 3
    const distSq = dx * dx + dy * dy
    const repulsionRadius = 3.0
    let repX = 0, repY = 0

    if (distSq < repulsionRadius * repulsionRadius && distSq > 0.01) {
      const dist = Math.sqrt(distSq)
      const force = (1 - dist / repulsionRadius) * 1.8
      repX = (dx / dist) * force
      repY = (dy / dist) * force
    }

    // Smooth approach to target + repulsion
    const lerpSpeed = 0.04
    velocity.current.x += (targetX + repX - currentPos.current.x) * lerpSpeed
    velocity.current.y += (targetY + repY - currentPos.current.y) * lerpSpeed
    velocity.current.z += (targetZ - currentPos.current.z) * lerpSpeed

    // Damping
    velocity.current.multiplyScalar(0.88)
    currentPos.current.addVectors(currentPos.current, velocity.current)

    groupRef.current.position.copy(currentPos.current)

    // Slow continuous rotation
    groupRef.current.rotation.x += seed.rotX * 0.01
    groupRef.current.rotation.y += seed.rotY * 0.01
    groupRef.current.rotation.z += seed.rotZ * 0.008
  })

  return (
    <group ref={groupRef} position={initialPos}>
      <Shape shape={shape} color={color} emissive={emissive} />
      <Text
        position={[0, -0.55, 0]}
        fontSize={0.18}
        color={color}
        anchorX="center"
        anchorY="middle"
        font="https://fonts.gstatic.com/s/outfit/v11/QGYyz_MVcBeNP4NjuGObqx1XmO1I4TC0C4G-EiAou6Y.woff2"
        maxWidth={1.5}
        textAlign="center"
      >
        {label}
      </Text>
    </group>
  )
}

export default function FloatingObjects({ mouseRef }) {
  return (
    <>
      {TECH_ITEMS.map((item) => (
        <FloatingItem
          key={item.label}
          label={item.label}
          color={item.color}
          emissive={item.emissive}
          shape={item.shape}
          initialPos={item.pos}
          mouseRef={mouseRef}
        />
      ))}
    </>
  )
}

export { TECH_ITEMS }
