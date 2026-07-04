import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import gsap from 'gsap'

export default function SceneManager({ activeSection = 0 }) {
  const { camera } = useThree()

  useEffect(() => {
    // Fast zoom effect on section change
    gsap.fromTo(
      camera.position,
      { z: 8 },
      { z: 5, duration: 0.5, ease: "power4.out" }
    )
  }, [activeSection, camera])

  // Reusable Rings component for the "Quantum" aesthetic
  const QuantumRings = ({ color }) => {
    const rings = useRef([])
    useFrame((state, delta) => {
      rings.current.forEach((ring, i) => {
        if (ring) {
          ring.rotation.x += delta * (i % 2 === 0 ? 1 : -1) * 0.8
          ring.rotation.y += delta * 0.5
        }
      })
    })
    return (
      <group>
        {[1, 2, 3].map((v, i) => (
          <mesh key={i} ref={el => rings.current[i] = el}>
            <torusGeometry args={[2.5 + i * 0.5, 0.02, 16, 100]} />
            <meshBasicMaterial color={color} transparent opacity={0.5} />
          </mesh>
        ))}
      </group>
    )
  }

  // --- Scene 0: Quantum Core (Hero) ---
  const Scene0 = () => {
    const coreRef = useRef()
    useFrame((state, delta) => {
      if (coreRef.current && activeSection === 0) {
        coreRef.current.rotation.y += delta * 0.5
        coreRef.current.rotation.x += delta * 0.2
      }
    })
    return (
      <group visible={activeSection === 0}>
        <group ref={coreRef}>
          <mesh>
            <icosahedronGeometry args={[2, 1]} />
            <meshStandardMaterial color="#bf00ff" wireframe emissive="#bf00ff" emissiveIntensity={1} />
          </mesh>
        </group>
        <QuantumRings color="#00ffcc" />
      </group>
    )
  }

  // --- Scene 1: Quantum Torus (Education) ---
  const Scene1 = () => {
    const coreRef = useRef()
    useFrame((state, delta) => {
      if (coreRef.current && activeSection === 1) {
        coreRef.current.rotation.y += delta * 0.4
        coreRef.current.rotation.z += delta * 0.3
      }
    })
    return (
      <group visible={activeSection === 1}>
        <group ref={coreRef}>
          <mesh>
            <torusKnotGeometry args={[1.2, 0.4, 100, 16]} />
            <meshStandardMaterial color="#00ffcc" wireframe emissive="#00ffcc" emissiveIntensity={1} />
          </mesh>
        </group>
        <QuantumRings color="#ff0055" />
      </group>
    )
  }

  // --- Scene 2: Quantum Diamond (Tech Skills) ---
  const Scene2 = () => {
    const coreRef = useRef()
    useFrame((state, delta) => {
      if (coreRef.current && activeSection === 2) {
        coreRef.current.rotation.y -= delta * 0.6
        coreRef.current.rotation.x -= delta * 0.2
      }
    })
    return (
      <group visible={activeSection === 2}>
        <group ref={coreRef}>
          <mesh>
            <octahedronGeometry args={[2, 0]} />
            <meshStandardMaterial color="#ff0055" wireframe emissive="#ff0055" emissiveIntensity={1.5} />
          </mesh>
        </group>
        <QuantumRings color="#bf00ff" />
      </group>
    )
  }

  // --- Scene 3: Quantum Prism (Projects) ---
  const Scene3 = () => {
    const coreRef = useRef()
    useFrame((state, delta) => {
      if (coreRef.current && activeSection === 3) {
        coreRef.current.rotation.x += delta * 0.3
        coreRef.current.rotation.y -= delta * 0.5
      }
    })
    return (
      <group visible={activeSection === 3}>
        <group ref={coreRef}>
          <mesh>
            <dodecahedronGeometry args={[2, 0]} />
            <meshStandardMaterial color="#ffffff" wireframe emissive="#ffffff" emissiveIntensity={1} />
          </mesh>
        </group>
        <QuantumRings color="#00ffcc" />
      </group>
    )
  }

  // --- Scene 4: Quantum Sphere (Contact) ---
  const Scene4 = () => {
    const coreRef = useRef()
    useFrame((state, delta) => {
      if (coreRef.current && activeSection === 4) {
        coreRef.current.rotation.y += delta * 0.2
        coreRef.current.rotation.x += delta * 0.5
      }
    })
    return (
      <group visible={activeSection === 4}>
        <group ref={coreRef}>
          <mesh>
            <sphereGeometry args={[1.5, 32, 32]} />
            <meshStandardMaterial color="#ffffff" wireframe emissive="#00ffcc" emissiveIntensity={0.5} />
          </mesh>
        </group>
        <QuantumRings color="#ff0055" />
      </group>
    )
  }

  return (
    <>
      <Scene0 />
      <Scene1 />
      <Scene2 />
      <Scene3 />
      <Scene4 />
    </>
  )
}
