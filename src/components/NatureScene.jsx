import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/* ═══════════════════════════════════════════════════
   SKY — custom GLSL sunset gradient shader
   ═══════════════════════════════════════════════════ */
const SKY_VERT = /* glsl */`
  varying vec3 vPos;
  void main() {
    vPos = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`
const SKY_FRAG = /* glsl */`
  varying vec3 vPos;
  void main() {
    float y = normalize(vPos).y * 0.5 + 0.5;

    vec3 zenith  = vec3(0.03, 0.04, 0.20);   // deep midnight blue
    vec3 upper   = vec3(0.26, 0.08, 0.42);   // deep violet
    vec3 mid     = vec3(0.72, 0.18, 0.10);   // deep crimson
    vec3 horiz   = vec3(1.00, 0.48, 0.08);   // golden orange
    vec3 ground  = vec3(0.55, 0.22, 0.04);   // burnt sienna

    vec3 col;
    if      (y > 0.72) col = mix(upper,  zenith,  (y - 0.72) / 0.28);
    else if (y > 0.52) col = mix(mid,    upper,   (y - 0.52) / 0.20);
    else if (y > 0.36) col = mix(horiz,  mid,     (y - 0.36) / 0.16);
    else               col = mix(ground, horiz,   y / 0.36);

    // Subtle sunray haze near horizon
    float sunRay = max(0.0, 1.0 - abs(y - 0.36) * 12.0);
    col += vec3(0.4, 0.2, 0.0) * sunRay * 0.25;

    gl_FragColor = vec4(col, 1.0);
  }
`

function Sky() {
  const mat = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: SKY_VERT,
    fragmentShader: SKY_FRAG,
    side: THREE.BackSide,
    depthWrite: false,
  }), [])

  return (
    <mesh renderOrder={-1}>
      <sphereGeometry args={[48, 28, 18]} />
      <primitive object={mat} attach="material" />
    </mesh>
  )
}

/* ═══════════════════════════════════════════════════
   SUN — glowing orb with pulsing corona
   ═══════════════════════════════════════════════════ */
function Sun() {
  const lightRef = useRef()
  const corona1Ref = useRef()
  const corona2Ref = useRef()

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    if (lightRef.current)
      lightRef.current.intensity = 1.5 + Math.sin(t * 0.28) * 0.22
    if (corona1Ref.current)
      corona1Ref.current.material.opacity = 0.18 + Math.sin(t * 0.4) * 0.04
    if (corona2Ref.current)
      corona2Ref.current.material.opacity = 0.07 + Math.sin(t * 0.22) * 0.02
  })

  return (
    <group position={[10, 3.0, -19]}>
      {/* Core disc */}
      <mesh>
        <sphereGeometry args={[1.35, 24, 24]} />
        <meshBasicMaterial color="#FFE566" />
      </mesh>
      {/* Inner corona */}
      <mesh ref={corona1Ref}>
        <sphereGeometry args={[2.1, 18, 18]} />
        <meshBasicMaterial color="#FF8800" transparent opacity={0.18} depthWrite={false} />
      </mesh>
      {/* Outer haze */}
      <mesh ref={corona2Ref}>
        <sphereGeometry args={[3.5, 14, 14]} />
        <meshBasicMaterial color="#FF4400" transparent opacity={0.07} depthWrite={false} />
      </mesh>
      {/* God-ray atmosphere ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[4.5, 1.8, 4, 32]} />
        <meshBasicMaterial color="#FF6600" transparent opacity={0.04} depthWrite={false} />
      </mesh>
      <pointLight ref={lightRef} color="#FFD060" intensity={1.5} distance={90} decay={1.2} />
    </group>
  )
}

/* ═══════════════════════════════════════════════════
   HILL — low-poly displaced plane
   ═══════════════════════════════════════════════════ */
function Hill({ w, d, r, amp, color, pos, rotY = 0 }) {
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(w, d, r, r)
    const a = g.attributes.position
    for (let i = 0; i < a.count; i++) {
      const x = a.getX(i), y = a.getY(i)
      const h =
        Math.sin(x * 0.36 + 0.9) * amp * 0.55 +
        Math.sin(x * 0.72 - 1.3) * amp * 0.28 +
        Math.cos(y * 0.44 + 0.3) * amp * 0.22 +
        (Math.random() - 0.5) * amp * 0.12
      a.setZ(i, h)
    }
    g.computeVertexNormals()
    return g
  }, [w, d, r, amp])

  return (
    <mesh geometry={geo} position={pos} rotation={[-Math.PI / 2, rotY, 0]}>
      <meshStandardMaterial color={color} flatShading roughness={0.96} metalness={0.0} />
    </mesh>
  )
}

/* ═══════════════════════════════════════════════════
   TREE — stylised low-poly, 3 cone tiers
   ═══════════════════════════════════════════════════ */
const TREE_PALETTES = [
  { c1: '#1B3A0F', c2: '#243D14', c3: '#2D5016', trunk: '#5C3017' },
  { c1: '#0F2D15', c2: '#183D1C', c3: '#1F4D22', trunk: '#4A2510' },
  { c1: '#24400F', c2: '#2D4D14', c3: '#385E1A', trunk: '#6B3A1C' },
]

function Tree({ position, scale = 1, variant = 0 }) {
  const p = TREE_PALETTES[variant % TREE_PALETTES.length]
  return (
    <group position={position} scale={scale}>
      {/* Trunk */}
      <mesh position={[0, 0.45, 0]}>
        <cylinderGeometry args={[0.06, 0.11, 0.9, 6]} />
        <meshStandardMaterial color={p.trunk} flatShading />
      </mesh>
      {/* Bottom foliage */}
      <mesh position={[0, 1.06, 0]}>
        <coneGeometry args={[0.58, 0.88, 7]} />
        <meshStandardMaterial color={p.c1} flatShading />
      </mesh>
      {/* Mid foliage */}
      <mesh position={[0, 1.58, 0]}>
        <coneGeometry args={[0.42, 0.76, 6]} />
        <meshStandardMaterial color={p.c2} flatShading />
      </mesh>
      {/* Top foliage */}
      <mesh position={[0, 1.99, 0]}>
        <coneGeometry args={[0.26, 0.65, 5]} />
        <meshStandardMaterial color={p.c3} flatShading />
      </mesh>
    </group>
  )
}

/* ═══════════════════════════════════════════════════
   BIRDS — V-shape silhouettes in animated flocks
   ═══════════════════════════════════════════════════ */
function BirdV({ wingAngle = 0.48 }) {
  return (
    <group>
      <mesh position={[-0.08, 0, 0]} rotation={[0, 0, wingAngle]}>
        <boxGeometry args={[0.15, 0.016, 0.01]} />
        <meshBasicMaterial color="#12051E" />
      </mesh>
      <mesh position={[0.08, 0, 0]} rotation={[0, 0, -wingAngle]}>
        <boxGeometry args={[0.15, 0.016, 0.01]} />
        <meshBasicMaterial color="#12051E" />
      </mesh>
    </group>
  )
}

const FLOCKS_DEF = [
  { y: 4.4,  z: -8,  speed: 0.040, offset: 0.00, count: 5, wingBase: 0.45 },
  { y: 5.6,  z: -13, speed: 0.031, offset: 0.33, count: 4, wingBase: 0.50 },
  { y: 3.7,  z: -6,  speed: 0.048, offset: 0.66, count: 6, wingBase: 0.42 },
  { y: 6.2,  z: -17, speed: 0.026, offset: 0.17, count: 3, wingBase: 0.55 },
]

function Flock({ y, z, speed, offset, count, wingBase }) {
  const groupRef = useRef()
  const wingsRef = useRef([])

  const birdOffsets = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      x: (i - (count - 1) / 2) * 0.38,
      y: (i % 2 === 0) ? 0 : 0.15,
      z: i * 0.08,
      phaseOff: i * 0.7,
    })),
  [count])

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    const t = clock.elapsedTime
    const progress = (t * speed + offset) % 1
    const x = progress * 28 - 14           // travel left→right, off-screen to off-screen
    const yWave = Math.sin(progress * Math.PI * 6) * 0.28
    groupRef.current.position.set(x, y + yWave, z)

    // Wing flap on each bird group
    wingsRef.current.forEach((ref, i) => {
      if (ref) {
        const flap = wingBase + Math.sin(t * 4.5 + birdOffsets[i]?.phaseOff) * 0.22
        // Children 0 and 1 are the two wing meshes
        if (ref.children[0]) ref.children[0].rotation.z = flap
        if (ref.children[1]) ref.children[1].rotation.z = -flap
      }
    })
  })

  return (
    <group ref={groupRef}>
      {birdOffsets.map((o, i) => (
        <group
          key={i}
          ref={el => wingsRef.current[i] = el}
          position={[o.x, o.y, o.z]}
        >
          <BirdV wingAngle={wingBase} />
        </group>
      ))}
    </group>
  )
}

/* ═══════════════════════════════════════════════════
   FIREFLIES — warm golden particles
   ═══════════════════════════════════════════════════ */
function Fireflies() {
  const COUNT = 100
  const posAttr = useRef()

  const { positions, speeds, phases } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3)
    const speeds    = new Float32Array(COUNT)
    const phases    = new Float32Array(COUNT)
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 20
      positions[i * 3 + 1] = Math.random() * 4.5 - 0.8
      positions[i * 3 + 2] = (Math.random() - 0.5) * 16 - 5
      speeds[i] = 0.12 + Math.random() * 0.38
      phases[i] = Math.random() * Math.PI * 2
    }
    return { positions, speeds, phases }
  }, [])

  useFrame(({ clock }) => {
    if (!posAttr.current) return
    const t = clock.elapsedTime
    const pos = posAttr.current.array
    for (let i = 0; i < COUNT; i++) {
      pos[i * 3 + 1] += speeds[i] * 0.0030
      if (pos[i * 3 + 1] > 4.5) pos[i * 3 + 1] = -0.8
      pos[i * 3]     += Math.sin(t * 0.55 + phases[i]) * 0.0018
      pos[i * 3 + 2] += Math.cos(t * 0.35 + phases[i]) * 0.0008
    }
    posAttr.current.needsUpdate = true
  })

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          ref={posAttr}
          attach="attributes-position"
          array={positions}
          count={COUNT}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#FFE066" transparent opacity={0.72} sizeAttenuation />
    </points>
  )
}

/* ═══════════════════════════════════════════════════
   CAMERA PARALLAX CONTROLLER
   ═══════════════════════════════════════════════════ */
function CameraController({ mouseRef }) {
  useFrame((state) => {
    const mx = mouseRef.current.x
    const my = mouseRef.current.y
    const tx = mx * 1.2
    const ty = my * 0.6 + 2.0
    state.camera.position.x += (tx - state.camera.position.x) * 0.020
    state.camera.position.y += (ty - state.camera.position.y) * 0.020
    state.camera.lookAt(0, 0.6, 0)
  })
  return null
}

/* ═══════════════════════════════════════════════════
   TREE PLACEMENT DATA
   ═══════════════════════════════════════════════════ */
const TREE_DATA = [
  // Near-left grove
  { position: [-4.5, -1.0, -2.5], scale: 1.00, variant: 0 },
  { position: [-3.2, -1.1, -3.8], scale: 1.20, variant: 1 },
  { position: [-5.8, -1.0, -4.5], scale: 0.80, variant: 2 },
  { position: [-2.5, -1.1, -5.0], scale: 0.70, variant: 0 },
  // Near-right grove
  { position: [ 3.8, -1.0, -2.8], scale: 1.00, variant: 2 },
  { position: [ 5.2, -1.1, -4.0], scale: 1.30, variant: 0 },
  { position: [ 4.2, -1.0, -5.5], scale: 0.90, variant: 1 },
  { position: [ 6.2, -1.1, -3.0], scale: 0.72, variant: 2 },
  // Far clusters
  { position: [-7.5, -1.5, -8.0], scale: 1.10, variant: 1 },
  { position: [-6.0, -1.5, -9.0], scale: 0.85, variant: 0 },
  { position: [ 7.0, -1.5, -7.5], scale: 1.00, variant: 2 },
  { position: [ 8.5, -1.5, -9.0], scale: 0.90, variant: 1 },
  // Mid accents
  { position: [-1.5, -1.2, -6.0], scale: 0.70, variant: 0 },
  { position: [ 1.8, -1.2, -7.0], scale: 0.76, variant: 2 },
  { position: [-0.5, -1.3, -8.5], scale: 0.65, variant: 1 },
]

/* ═══════════════════════════════════════════════════
   MAIN EXPORT
   ═══════════════════════════════════════════════════ */
export default function NatureScene({ mouseRef }) {
  return (
    <>
      <CameraController mouseRef={mouseRef} />

      {/* Warm atmospheric fog */}
      <fog attach="fog" color="#5C1A00" near={24} far={50} />

      {/* Sky gradient dome */}
      <Sky />

      {/* ── Cinematic lighting ── */}
      <ambientLight color="#FF7733" intensity={0.28} />
      {/* Key: golden sun light */}
      <directionalLight position={[10, 8, -16]} color="#FFB347" intensity={2.1} />
      {/* Fill: cool purple from opposite side */}
      <directionalLight position={[-8, 4, 2]} color="#A855F7" intensity={0.42} />
      {/* Hemisphere: warm sky / cool ground */}
      <hemisphereLight args={['#FF8C00', '#0F2D07', 0.55]} />

      {/* Sun orb */}
      <Sun />

      {/* ── Hills (3 depth layers) ── */}
      {/* Far — deep purple */}
      <Hill w={58} d={30} r={16} amp={2.6} color="#3D1A5C" pos={[0, -3.2, -22]} />
      {/* Mid — olive green */}
      <Hill w={46} d={22} r={14} amp={1.8} color="#617A30" pos={[0, -2.4, -13]} />
      {/* Near — forest green */}
      <Hill w={36} d={16} r={12} amp={1.2} color="#2D5016" pos={[0, -1.6, -6]}  />

      {/* Ground plane (closest) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.6, 2]}>
        <planeGeometry args={[44, 14, 1, 1]} />
        <meshStandardMaterial color="#1B3A0F" />
      </mesh>

      {/* ── Trees ── */}
      {TREE_DATA.map((t, i) => <Tree key={i} {...t} />)}

      {/* ── Birds ── */}
      {FLOCKS_DEF.map((f, i) => <Flock key={i} {...f} />)}

      {/* ── Fireflies ── */}
      <Fireflies />
    </>
  )
}
