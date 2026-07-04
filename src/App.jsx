import { Suspense, useState, useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, Stars, Effects } from '@react-three/drei'
import { EffectComposer, Bloom, Noise } from '@react-three/postprocessing'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Download, GraduationCap, Code2, Cpu, Link as LinkIcon, Mail, Phone, Terminal, Globe, Database, Network, CarFront, ShieldAlert, Activity, Send } from 'lucide-react'
import emailjs from '@emailjs/browser'

import KineticText from './components/KineticText'
import SceneManager from './components/SceneManager'
import HTMLCursor from './components/HTMLCursor'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  const [activeSection, setActiveSection] = useState(0)
  const scrollContainerRef = useRef(null)
  const formRef = useRef()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollContainerRef.current) return
      
      const scrollY = scrollContainerRef.current.scrollTop
      const vh = window.innerHeight
      
      const currentSection = Math.round(scrollY / vh)
      setActiveSection(currentSection)
    }

    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true })
    }
    
    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll)
      }
    }
  }, [])

  const sendEmail = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    emailjs.sendForm('service_x0dhyjg', 'template_6106e9q', formRef.current, 'HKklavsjP2lODb-LJ')
      .then((result) => {
          setSubmitMessage('TRANSMISSION_SUCCESSFUL');
          setIsSubmitting(false);
          e.target.reset();
      }, (error) => {
          setSubmitMessage('TRANSMISSION_FAILED');
          setIsSubmitting(false);
      });
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-background text-white">
      <HTMLCursor />
      
      {/* 3D BACKGROUND LAYER */}
      <div className="canvas-container fixed inset-0 w-full h-full pointer-events-none z-0">
        <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
          <color attach="background" args={['#050505']} />
          <ambientLight intensity={0.5} />
          
          <Suspense fallback={null}>
            <group position={[0, 1.5, -2]}>
               {/* Kinetic Text removed for clarity, moved to HTML UI */}
            </group>
            
            {/* Map pages to scenes */}
            <SceneManager activeSection={activeSection} />
          </Suspense>

          {/* Post Processing for the Sci-Fi Look */}
          <EffectComposer>
            <Bloom intensity={1.5} luminanceThreshold={0.2} luminanceSmoothing={0.9} />
          </EffectComposer>
        </Canvas>
      </div>

      {/* UI OVERLAY LAYER (SCROLLABLE) */}
      <div 
        ref={scrollContainerRef}
        className="ui-overlay h-full overflow-y-auto overflow-x-hidden"
      >
        {/* Navigation / Header */}
        <nav className="fixed top-0 w-full p-6 flex justify-between items-center z-50 pointer-events-auto text-primary">
          <div className="font-mono font-bold tracking-widest text-2xl drop-shadow-[0_0_10px_rgba(0,255,204,0.8)]">VK_SYS<span className="text-white">.OS</span></div>
          <div className="flex gap-8 font-mono text-[10px] tracking-[0.3em] uppercase bg-black/40 px-6 py-2 rounded-full border border-primary/30 backdrop-blur-md">
            <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div> ONLINE</span>
            <span className="text-gray-400">NOMINAL</span>
          </div>
        </nav>

        {/* PAGE 1: Hero Section */}
        <section className="scroll-section min-h-screen w-full flex flex-col justify-center p-12 pointer-events-auto relative z-10">
          <div className="max-w-3xl ml-12 lg:ml-24">
            <h2 className="text-secondary font-mono text-sm tracking-[0.4em] mb-4 flex items-center gap-3 opacity-80">
              <Cpu size={16} className="animate-pulse" /> INTIALIZING_SEQUENCE
            </h2>
            
            <h1 className="text-7xl md:text-9xl font-black mb-2 uppercase tracking-tighter leading-none drop-shadow-[0_0_25px_rgba(0,255,204,0.6)]">
              <span className="text-white">VINAY </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">KETHA</span>
            </h1>
            
            <h2 className="text-3xl md:text-5xl font-bold mb-6 uppercase tracking-tight leading-tight text-gray-300">
              Software & Machine Learning Developer
            </h2>
            <p className="text-gray-400 max-w-lg mb-10 text-lg leading-relaxed font-light">
              Building highly efficient software solutions, dynamic web experiences, and intelligent deep learning architectures.
            </p>
            <div className="flex flex-wrap gap-5">
              <a href="/Vinay_Ketha_Resume.pdf" download="Vinay_Ketha_Resume.pdf" className="group flex items-center gap-3 bg-gradient-to-r from-primary to-primary/80 text-black font-bold px-8 py-3 rounded-none hover:shadow-[0_0_30px_rgba(0,255,204,0.6)] transition-all duration-300">
                <Download size={18} className="group-hover:-translate-y-1 transition-transform" /> RESUME_DL
              </a>
              <a href="https://www.linkedin.com/in/vinay-ketha-451643397" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 bg-black/40 border border-secondary text-secondary font-bold px-8 py-3 hover:bg-secondary hover:text-white hover:shadow-[0_0_30px_rgba(191,0,255,0.6)] transition-all duration-300 backdrop-blur-sm">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="group-hover:rotate-12 transition-transform"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg> LINKEDIN
              </a>
              <a href="https://github.com/vinaykethaa-pixel" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 bg-black/40 border border-white/50 text-white font-bold px-8 py-3 hover:bg-white hover:text-black hover:shadow-[0_0_30px_rgba(255,255,255,0.6)] transition-all duration-300 backdrop-blur-sm">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg> GITHUB
              </a>
            </div>
          </div>
        </section>

        {/* PAGE 2: Education Section */}
        <section className="scroll-section min-h-screen w-full flex flex-col justify-center items-end p-12 pointer-events-auto relative z-10">
          <div className="max-w-4xl mr-4 lg:mr-16 text-right">
            <h2 className="text-primary font-mono text-lg tracking-[0.4em] mb-10 flex items-center justify-end gap-3 opacity-90 drop-shadow-md">
               EDUCATION_LOGS <GraduationCap size={24} />
            </h2>
            
            <div className="mb-16 border-r-4 border-primary/70 pr-8 hover:border-primary transition-colors drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)]">
              <h3 className="text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight mb-4 leading-tight">Master of Computer Applications</h3>
              <p className="text-primary font-mono text-lg md:text-xl mb-6">Swarnandhra College of Engineering Technology</p>
              <div className="inline-block bg-primary/20 text-primary font-bold px-6 py-3 font-mono text-lg md:text-xl border-2 border-primary/50 shadow-[0_0_25px_rgba(0,255,204,0.3)]">
                CGPA: 7.9
              </div>
            </div>

            <div className="border-r-4 border-secondary/70 pr-8 hover:border-secondary transition-colors drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)]">
              <h3 className="text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight mb-4 leading-tight">Bachelor of Business Admin</h3>
              <p className="text-secondary font-mono text-lg md:text-xl mb-6">Sri ASNM Degree College</p>
              <div className="flex justify-end flex-wrap gap-4">
                <span className="bg-secondary/20 text-secondary font-bold px-6 py-3 font-mono text-lg md:text-xl border-2 border-secondary/50 shadow-[0_0_25px_rgba(191,0,255,0.3)]">
                  CGPA: 8.0
                </span>
                <span className="bg-accent/20 text-accent font-bold px-6 py-3 font-mono text-lg md:text-xl border-2 border-accent/50 shadow-[0_0_25px_rgba(255,0,85,0.3)]">
                  2nd Place Merit: Digital Marketing
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* PAGE 3: Technical Skills */}
        <section className="scroll-section min-h-screen w-full flex flex-col justify-center p-12 pointer-events-auto relative z-10">
          <div className="max-w-6xl mx-auto w-full">
            <h2 className="text-accent font-mono text-sm tracking-[0.4em] mb-12 flex items-center gap-3 opacity-80 justify-center">
               <Cpu size={16} /> TECH_SKILLS_MATRIX
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { title: 'Programming', skills: 'Python, Java', color: 'primary', icon: Terminal },
                { title: 'Web Dev', skills: 'HTML5, CSS3', color: 'secondary', icon: Globe },
                { title: 'Core CS', skills: 'Data Structures, OOP, Algorithms', color: 'white', icon: Network },
                { title: 'Databases', skills: 'SQL, MongoDB', color: 'primary', icon: Database },
                { title: 'Technologies', skills: 'Machine Learning, Deep Learning', color: 'accent', icon: Cpu },
              ].map((skill, i) => {
                const Icon = skill.icon
                return (
                  <div key={i} className={`p-8 bg-black/40 backdrop-blur-xl border-t border-l border-${skill.color === 'white' ? 'white/20' : skill.color+'/30'} rounded-3xl hover:bg-black/60 transition-all duration-500 transform hover:-translate-y-2 shadow-[10px_10px_30px_rgba(0,0,0,0.8)] hover:shadow-[0_0_40px_rgba(var(--color-${skill.color}),0.2)] group relative overflow-hidden`}>
                    <div className={`absolute -right-10 -top-10 w-32 h-32 bg-${skill.color === 'white' ? 'white' : skill.color}/10 rounded-full blur-3xl group-hover:bg-${skill.color === 'white' ? 'white' : skill.color}/20 transition-all duration-500`}></div>
                    
                    <div className={`w-14 h-14 rounded-2xl border border-${skill.color === 'white' ? 'white/50' : skill.color+'/50'} bg-${skill.color === 'white' ? 'white' : skill.color}/10 flex items-center justify-center mb-6 text-${skill.color === 'white' ? 'white' : skill.color} shadow-[0_0_15px_rgba(var(--color-${skill.color}),0.2)] group-hover:scale-110 transition-transform duration-500`}>
                      <Icon size={24} className="drop-shadow-[0_0_8px_currentColor]" />
                    </div>
                    
                    <h3 className="text-xl font-bold text-white uppercase tracking-widest mb-3">{skill.title}</h3>
                    <p className={`text-${skill.color === 'white' ? 'gray-300' : skill.color} font-mono text-sm leading-relaxed opacity-90 group-hover:opacity-100 transition-opacity`}>{skill.skills}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* PAGE 4: Projects Section */}
        <section className="scroll-section min-h-screen w-full flex flex-col justify-center p-12 pointer-events-auto relative z-10">
          <h2 className="text-white font-mono text-sm tracking-[0.4em] mb-12 flex items-center gap-3 opacity-80 justify-center">
            <Code2 size={16} /> PROJECT_ARCHIVES
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto w-full">
            {/* Project 1 */}
            <div className="p-8 bg-black/50 backdrop-blur-2xl border-t border-l border-primary/40 rounded-3xl hover:bg-black/70 transition-all duration-500 transform hover:-translate-y-4 shadow-[10px_10px_30px_rgba(0,0,0,0.9)] hover:shadow-[0_0_50px_rgba(0,255,204,0.3)] group flex flex-col h-full relative overflow-hidden">
              <div className="absolute -right-20 -top-20 w-48 h-48 bg-primary/20 rounded-full blur-[60px] group-hover:bg-primary/30 transition-colors duration-500"></div>
              
              <div className="w-16 h-16 rounded-2xl border border-primary/50 bg-primary/10 flex items-center justify-center mb-6 text-primary shadow-[0_0_20px_rgba(0,255,204,0.3)] group-hover:scale-110 transition-transform duration-500">
                <CarFront size={32} className="drop-shadow-[0_0_10px_rgba(0,255,204,0.8)]" />
              </div>
              
              <h3 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-white mb-4 tracking-tight drop-shadow-md">Traffic Violation Detection</h3>
              <p className="text-gray-300 mb-8 font-mono text-sm leading-relaxed flex-grow opacity-90 group-hover:opacity-100 transition-opacity">
                Developed using Python, OpenCV, and YOLOv8. Achieved 87% detection accuracy on a 5000+ image dataset.
              </p>
              
              <div className="flex flex-col gap-5 mt-auto">
                <div className="flex flex-wrap gap-2">
                  {['Python', 'OpenCV', 'YOLOv8'].map(tag => (
                    <span key={tag} className="text-xs font-bold font-mono bg-primary/10 border border-primary/40 px-3 py-1.5 text-primary rounded-full drop-shadow-[0_0_5px_rgba(0,255,204,0.5)]">{tag}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Project 2 */}
            <div className="p-8 bg-black/50 backdrop-blur-2xl border-t border-l border-secondary/40 rounded-3xl hover:bg-black/70 transition-all duration-500 transform hover:-translate-y-4 shadow-[10px_10px_30px_rgba(0,0,0,0.9)] hover:shadow-[0_0_50px_rgba(191,0,255,0.3)] group flex flex-col h-full relative overflow-hidden">
              <div className="absolute -right-20 -top-20 w-48 h-48 bg-secondary/20 rounded-full blur-[60px] group-hover:bg-secondary/30 transition-colors duration-500"></div>
              
              <div className="w-16 h-16 rounded-2xl border border-secondary/50 bg-secondary/10 flex items-center justify-center mb-6 text-secondary shadow-[0_0_20px_rgba(191,0,255,0.3)] group-hover:scale-110 transition-transform duration-500">
                <ShieldAlert size={32} className="drop-shadow-[0_0_10px_rgba(191,0,255,0.8)]" />
              </div>
              
              <h3 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-secondary to-white mb-4 tracking-tight drop-shadow-md">Digital Forensic Toolkit</h3>
              <p className="text-gray-300 mb-8 font-mono text-sm leading-relaxed flex-grow opacity-90 group-hover:opacity-100 transition-opacity">
                Built a machine learning-based forensic analysis system for file classification with modular Python components.
              </p>
              
              <div className="flex flex-col gap-5 mt-auto">
                <div className="flex flex-wrap gap-2">
                  {['Machine Learning', 'Python'].map(tag => (
                    <span key={tag} className="text-xs font-bold font-mono bg-secondary/10 border border-secondary/40 px-3 py-1.5 text-secondary rounded-full drop-shadow-[0_0_5px_rgba(191,0,255,0.5)]">{tag}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Project 3 */}
            <div className="p-8 bg-black/50 backdrop-blur-2xl border-t border-l border-accent/40 rounded-3xl hover:bg-black/70 transition-all duration-500 transform hover:-translate-y-4 shadow-[10px_10px_30px_rgba(0,0,0,0.9)] hover:shadow-[0_0_50px_rgba(255,0,85,0.3)] group flex flex-col h-full relative overflow-hidden">
              <div className="absolute -right-20 -top-20 w-48 h-48 bg-accent/20 rounded-full blur-[60px] group-hover:bg-accent/30 transition-colors duration-500"></div>
              
              <div className="w-16 h-16 rounded-2xl border border-accent/50 bg-accent/10 flex items-center justify-center mb-6 text-accent shadow-[0_0_20px_rgba(255,0,85,0.3)] group-hover:scale-110 transition-transform duration-500">
                <Activity size={32} className="drop-shadow-[0_0_10px_rgba(255,0,85,0.8)]" />
              </div>
              
              <h3 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accent to-white mb-4 tracking-tight drop-shadow-md">Liver CT Segmentation</h3>
              <p className="text-gray-300 mb-8 font-mono text-sm leading-relaxed flex-grow opacity-90 group-hover:opacity-100 transition-opacity">
                Developed a deep learning model using U-Net architecture and FastAI framework for efficient training.
              </p>
              
              <div className="flex flex-col gap-5 mt-auto">
                <a href="https://maajor-project-4nta.onrender.com/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-accent/10 border border-accent/50 text-accent font-mono px-4 py-3 hover:bg-accent hover:text-black transition-all duration-300 text-sm font-bold rounded-xl shadow-[0_0_15px_rgba(255,0,85,0.2)]">
                  <LinkIcon size={16} /> VIEW LIVE PROJECT
                </a>
                <div className="flex flex-wrap gap-2">
                  {['Deep Learning', 'FastAI'].map(tag => (
                    <span key={tag} className="text-xs font-bold font-mono bg-accent/10 border border-accent/40 px-3 py-1.5 text-accent rounded-full drop-shadow-[0_0_5px_rgba(255,0,85,0.5)]">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PAGE 5: Contact Section */}
        <section className="scroll-section min-h-screen w-full flex flex-col justify-center items-center p-12 pointer-events-auto relative z-10">
          <div className="max-w-4xl w-full">
            <h2 className="text-secondary font-mono text-sm tracking-[0.4em] mb-8 flex items-center justify-center gap-3 opacity-80 text-center">
               <Mail size={16} /> COMM_CHANNELS
            </h2>
            
            <div className="bg-black/50 backdrop-blur-2xl border border-white/20 p-8 md:p-12 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.8)] hover:border-primary/50 transition-all duration-500 hover:shadow-[0_0_50px_rgba(0,255,204,0.15)] relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-accent"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Left Side: Contact Details */}
                <div className="flex flex-col justify-center text-center md:text-left">
                  <h3 className="text-4xl font-black text-white mb-8 tracking-wide">INITIALIZE <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">CONTACT</span></h3>
                  
                  <div className="flex flex-col gap-8 font-mono text-xl items-center md:items-start">
                    <a href="mailto:vinayketha@gmail.com" className="flex items-center gap-5 text-white font-bold hover:text-primary transition-colors group/link drop-shadow-md">
                      <span className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/50 group-hover/link:bg-primary group-hover/link:text-black transition-all shadow-[0_0_20px_rgba(0,255,204,0.3)]">
                        <Mail size={24} />
                      </span>
                      vinayketha@gmail.com
                    </a>
                    
                    <a href="tel:+919030964037" className="flex items-center gap-5 text-white font-bold hover:text-secondary transition-colors group/link drop-shadow-md">
                      <span className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center border border-secondary/50 group-hover/link:bg-secondary group-hover/link:text-black transition-all shadow-[0_0_20px_rgba(191,0,255,0.3)]">
                        <Phone size={24} />
                      </span>
                      +91 90309 64037
                    </a>
                  </div>
                  
                  <div className="flex justify-center md:justify-start gap-6 mt-12">
                    <a href="https://www.linkedin.com/in/vinay-ketha-451643397" target="_blank" rel="noopener noreferrer" className="text-secondary hover:text-white hover:scale-110 transition-all drop-shadow-[0_0_10px_rgba(191,0,255,0.5)]">
                      <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                    </a>
                    <a href="https://github.com/vinaykethaa-pixel" target="_blank" rel="noopener noreferrer" className="text-white hover:text-primary hover:scale-110 transition-all drop-shadow-[0_0_10px_rgba(0,255,204,0.5)]">
                      <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                    </a>
                  </div>
                </div>

                {/* Right Side: Contact Form */}
                <form ref={formRef} onSubmit={sendEmail} className="flex flex-col gap-5 border-t md:border-t-0 md:border-l border-white/10 pt-8 md:pt-0 md:pl-12">
                  <div>
                    <label className="text-xs font-mono text-primary tracking-widest mb-2 block">SENDER_NAME</label>
                    <input type="text" name="user_name" required className="w-full bg-black/40 border border-white/20 rounded-lg px-4 py-3 text-white font-mono focus:outline-none focus:border-primary focus:shadow-[0_0_15px_rgba(0,255,204,0.3)] transition-all" placeholder="Enter your name" />
                  </div>
                  <div>
                    <label className="text-xs font-mono text-secondary tracking-widest mb-2 block">SENDER_EMAIL</label>
                    <input type="email" name="user_email" required className="w-full bg-black/40 border border-white/20 rounded-lg px-4 py-3 text-white font-mono focus:outline-none focus:border-secondary focus:shadow-[0_0_15px_rgba(191,0,255,0.3)] transition-all" placeholder="Enter your email" />
                  </div>
                  <div>
                    <label className="text-xs font-mono text-accent tracking-widest mb-2 block">PAYLOAD_MESSAGE</label>
                    <textarea name="message" required rows="4" className="w-full bg-black/40 border border-white/20 rounded-lg px-4 py-3 text-white font-mono resize-none focus:outline-none focus:border-accent focus:shadow-[0_0_15px_rgba(255,0,85,0.3)] transition-all" placeholder="Type your message here..."></textarea>
                  </div>
                  
                  <button type="submit" disabled={isSubmitting} className="w-full mt-2 bg-gradient-to-r from-primary to-secondary text-black font-bold font-mono tracking-widest px-6 py-4 rounded-lg hover:shadow-[0_0_30px_rgba(0,255,204,0.5)] hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3">
                    {isSubmitting ? 'TRANSMITTING...' : <>TRANSMIT <Send size={18} /></>}
                  </button>

                  {submitMessage && (
                    <div className={`text-center font-mono text-sm mt-4 p-3 rounded-lg border ${submitMessage === 'TRANSMISSION_SUCCESSFUL' ? 'bg-primary/20 text-primary border-primary/50' : 'bg-red-500/20 text-red-400 border-red-500/50'}`}>
                      {submitMessage}
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Scroll Indicator (Animated Mouse Button) */}
        <button 
          onClick={() => {
            if (scrollContainerRef.current) {
              scrollContainerRef.current.scrollBy({ top: window.innerHeight, behavior: 'smooth' })
            }
          }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-auto cursor-pointer text-primary/70 hover:text-primary transition-colors z-50"
        >
          <div className="w-[26px] h-[40px] rounded-full border-2 border-current flex justify-center pt-2 mb-2">
            <div className="w-[4px] h-[8px] rounded-full bg-current" style={{ animation: 'scrollWheel 1.5s ease-in-out infinite' }}></div>
          </div>
          <span className="font-mono text-[10px] tracking-widest">SCROLL</span>
        </button>
      </div>
    </div>
  )
}
