import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'

/* ═══════════════════════════════════════════════════
   ORB DATA — tech stack as glowing crystals
   ═══════════════════════════════════════════════════ */
const ORBS = [
  { label: 'Python',      color: '#60A5FA', emissive: '#1D4ED8', pos: [-3.5,  0.8, -1.8] },
  { label: 'Java',        color: '#F87171', emissive: '#DC2626', pos: [ 3.2,  0.5, -1.5] },
  { label: 'ML / AI',     color: '#C084FC', emissive: '#7C3AED', pos: [-1.5,  1.3, -2.5] },
  { label: 'React',       color: '#22D3EE', emissive: '#0891B2', pos: [ 1.8,  1.6, -2.0] },
  { label: 'FastAI',      color: '#FB923C', emissive: '#EA580C', pos: [-4.2,  1.5, -3.5] },
  { label: 'TensorFlow',  color: '#FBBF24', emissive: '#D97706', pos: [ 4.0,  0.9, -3.0] },
  { label: 'OpenCV',      color: '#34D399', emissive: '#059669', pos: [ 0.0,  1.9, -3.5] },
  { label: 'SQL',         color: '#A78BFA', emissive: '#6D28D9', pos: [-2.8,  0.6, -1.2] },
]

/* ═══════════════════════════════════════════════════
   SINGLE ORB
   ═══════════════════════════════════════════════════ */
function Orb({ label, color, emissive, pos, mouseRef }) {
  const groupRef = useRef()

  const seed = useMemo(() => ({
    bobSpeed: 0.42 + Math.random() * 0.52,
    bobAmp:   0.16 + Math.random() * 0.20,
    bobOff:   Math.random() * Math.PI * 2,
    rotY:     (Math.random() - 0.5) * 0.85,
    rotX:     (Math.random() - 0.5) * 0.30,
  }), [])

  const home = useRef(new THREE.Vector3(...pos))
  const vel  = useRef(new THREE.Vector3())
  const cur  = useRef(new THREE.Vector3(...pos))

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    const t   = clock.elapsedTime
    const bob = Math.sin(t * seed.bobSpeed + seed.bobOff) * seed.bobAmp

    // Mouse repulsion in world-space approximation
    const mx = mouseRef.current.x * 4.5
    const my = mouseRef.current.y * 2.8
    const dx = cur.current.x - mx
    const dy = cur.current.y - my
    const d2 = dx * dx + dy * dy
    const R  = 3.0
    let rx = 0, ry = 0
    if (d2 < R * R && d2 > 0.01) {
      const d = Math.sqrt(d2)
      const f = (1 - d / R) * 1.5
      rx = (dx / d) * f
      ry = (dy / d) * f
    }

    // Spring towards home + bob + repulsion
    vel.current.x += (home.current.x + rx - cur.current.x) * 0.036
    vel.current.y += (home.current.y + bob + ry - cur.current.y) * 0.036
    vel.current.z += (home.current.z - cur.current.z) * 0.036
    vel.current.multiplyScalar(0.88)
    cur.current.add(vel.current)

    groupRef.current.position.copy(cur.current)
    groupRef.current.rotation.y += seed.rotY * 0.009
    groupRef.current.rotation.x += seed.rotX * 0.006
  })

  const col = useMemo(() => new THREE.Color(color), [color])
  const emi = useMemo(() => new THREE.Color(emissive), [emissive])

  return (
    <group ref={groupRef} position={pos}>
      {/* Solid crystal */}
      <mesh>
        <octahedronGeometry args={[0.24, 0]} />
        <meshStandardMaterial
          color={col}
          emissive={emi}
          emissiveIntensity={1.1}
          metalness={0.55}
          roughness={0.06}
          transparent
          opacity={0.90}
        />
      </mesh>

      {/* Inner glow shell */}
      <mesh>
        <octahedronGeometry args={[0.38, 0]} />
        <meshBasicMaterial color={col} transparent opacity={0.13} depthWrite={false} />
      </mesh>

      {/* Soft sphere aura */}
      <mesh>
        <sphereGeometry args={[0.55, 8, 8]} />
        <meshBasicMaterial color={col} transparent opacity={0.06} depthWrite={false} />
      </mesh>

      {/* Local point light for scene glow */}
      <pointLight color={color} intensity={0.55} distance={1.8} decay={2} />

      {/* Label */}
      <Text
        position={[0, -0.55, 0]}
        fontSize={0.14}
        color={color}
        anchorX="center"
        anchorY="middle"
        renderOrder={2}
        depthOffset={-1}
      >
        {label}
      </Text>
    </group>
  )
}

/* ═══════════════════════════════════════════════════
   EXPORT
   ═══════════════════════════════════════════════════ */
export default function TechOrbs({ mouseRef }) {
  return (
    <>
      {ORBS.map(orb => (
        <Orb key={orb.label} {...orb} mouseRef={mouseRef} />
      ))}
    </>
  )
}
