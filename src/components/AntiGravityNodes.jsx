import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'

const NODES = [
  { text: 'Python', color: '#3776AB', position: [-3, 1, -2] },
  { text: 'Java', color: '#ED8B00', position: [3, 2, -3] },
  { text: 'Machine Learning', color: '#FF4F8B', position: [-2, -2, -1] },
  { text: 'YOLOv8', color: '#00FFFF', position: [2, -1, -2] },
  { text: 'React', color: '#61DAFB', position: [0, -3, -3] }
]

function Node({ data }) {
  const groupRef = useRef()
  const originalPos = useMemo(() => new THREE.Vector3(...data.position), [data.position])
  
  // Random phase for organic floating
  const randomPhase = useMemo(() => Math.random() * Math.PI * 2, [])
  const randomSpeed = useMemo(() => 0.5 + Math.random() * 0.5, [])
  
  // Track if we are currently bouncing to avoid jitter
  const isBouncing = useRef(false)

  useFrame((state) => {
    if (!groupRef.current) return

    // 1. Apply base floating animation if not actively bouncing away
    if (!isBouncing.current) {
      const t = state.clock.elapsedTime
      const floatY = originalPos.y + Math.sin(t * randomSpeed + randomPhase) * 0.5
      const floatX = originalPos.x + Math.cos(t * randomSpeed * 0.8 + randomPhase) * 0.3
      
      // Smoothly return to the floating anchor
      groupRef.current.position.lerp(new THREE.Vector3(floatX, floatY, originalPos.z), 0.05)
    }

    // 2. Continuous rotation
    groupRef.current.rotation.y += 0.01
    groupRef.current.rotation.z += 0.005

    // 3. Fast repulsion from cursor
    if (window.customCursorRef) {
      const cursorObj = window.customCursorRef
      const dist = groupRef.current.position.distanceTo(cursorObj.position)
      
      const threshold = 1.8 // Distance at which repulsion triggers
      
      if (dist < threshold && !isBouncing.current) {
        isBouncing.current = true
        
        // Calculate repulsion vector (away from cursor)
        const repelDir = new THREE.Vector3().subVectors(groupRef.current.position, cursorObj.position).normalize()
        
        // Add some random scatter so they don't just shoot straight out
        repelDir.x += (Math.random() - 0.5) * 0.5
        repelDir.y += (Math.random() - 0.5) * 0.5
        
        const force = 3.5 // How far they bounce
        
        // Target position to bounce to
        const targetPos = {
          x: groupRef.current.position.x + repelDir.x * force,
          y: groupRef.current.position.y + repelDir.y * force,
          z: groupRef.current.position.z + repelDir.z * force
        }

        // Fast, energetic GSAP bounce
        gsap.to(groupRef.current.position, {
          x: targetPos.x,
          y: targetPos.y,
          z: targetPos.z,
          duration: 0.4,
          ease: 'power3.out',
          onComplete: () => {
            // Wait briefly before allowing it to float back
            setTimeout(() => {
              isBouncing.current = false
            }, 200)
          }
        })
        
        // Also spin them rapidly when hit
        gsap.to(groupRef.current.rotation, {
          x: groupRef.current.rotation.x + Math.PI,
          y: groupRef.current.rotation.y + Math.PI,
          duration: 0.6,
          ease: 'power2.out'
        })
      }
    }
  })

  return (
    <group ref={groupRef} position={data.position}>
      {/* The abstract node geometric shape */}
      <mesh>
        <octahedronGeometry args={[0.6, 0]} />
        <meshStandardMaterial 
          color={data.color} 
          wireframe={true} 
          emissive={data.color}
          emissiveIntensity={0.5}
        />
      </mesh>
      
      {/* Inner solid core */}
      <mesh scale={0.3}>
        <octahedronGeometry args={[0.6, 0]} />
        <meshBasicMaterial color={data.color} />
      </mesh>
      
      {/* Text label attached to node */}
      <Text
        position={[0, -1, 0]}
        fontSize={0.3}
        color={data.color}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {data.text}
      </Text>
    </group>
  )
}

export default function AntiGravityNodes() {
  return (
    <group>
      {NODES.map((node, i) => (
        <Node key={i} data={node} />
      ))}
    </group>
  )
}
