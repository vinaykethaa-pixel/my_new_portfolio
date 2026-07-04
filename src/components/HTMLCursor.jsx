import { useEffect, useRef } from 'react'

export default function HTMLCursor() {
  const cursorRef = useRef(null)

  useEffect(() => {
    const onMouseMove = (e) => {
      if (cursorRef.current) {
        // Use translate3d for hardware acceleration and zero lag
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`
      }
    }
    
    window.addEventListener('mousemove', onMouseMove)
    return () => window.removeEventListener('mousemove', onMouseMove)
  }, [])

  return (
    <div 
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[100] mix-blend-difference"
      style={{
        width: '32px',
        height: '32px',
        marginLeft: '-16px', // center the cursor
        marginTop: '-16px',
        border: '2px solid #00ffcc',
        borderRadius: '50%',
        backgroundColor: 'transparent',
        transition: 'transform 0.05s linear',
        boxShadow: '0 0 10px #00ffcc'
      }}
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[6px] h-[6px] bg-[#00ffcc] rounded-full shadow-[0_0_8px_#00ffcc]"></div>
    </div>
  )
}
