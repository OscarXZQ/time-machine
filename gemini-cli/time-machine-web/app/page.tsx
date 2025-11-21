"use client";

import React, { useState, useEffect, useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame, useThree, extend } from "@react-three/fiber";
import { Stars, Float, Text, PerspectiveCamera, shaderMaterial, useTexture, Trail, Line, Sparkles } from "@react-three/drei";
import { EffectComposer, Bloom, ChromaticAberration, Noise, Vignette, GodRays, Scanline } from "@react-three/postprocessing";
import { BlendFunction, Resizer, KernelSize } from "postprocessing";
import { motion, AnimatePresence, useSpring, useTransform, useMotionValue } from "framer-motion";
import { Power, Zap, MapPin, Activity, Radio, ShieldCheck, AlertTriangle, Database, Cpu, Crosshair, Play, SkipForward, Rewind } from "lucide-react";
import * as THREE from "three";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

// --- AUDIO SYSTEM ---

class AudioEngine {
  ctx: AudioContext | null = null;
  master: GainNode | null = null;
  drone: OscillatorNode | null = null;
  droneGain: GainNode | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioContext();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.4;
      this.master.connect(this.ctx.destination);
    }
  }

  initDrone() {
    if (!this.ctx || !this.master || this.drone) return;
    this.drone = this.ctx.createOscillator();
    this.droneGain = this.ctx.createGain();
    
    this.drone.type = 'sine';
    this.drone.frequency.value = 50;
    
    // LFO for drone modulation
    const lfo = this.ctx.createOscillator();
    lfo.frequency.value = 0.2;
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.value = 10;
    lfo.connect(lfoGain);
    lfoGain.connect(this.drone.frequency);
    lfo.start();

    this.droneGain.gain.value = 0.0; 
    this.drone.connect(this.droneGain);
    this.droneGain.connect(this.master);
    this.drone.start();
    
    // Fade in
    this.droneGain.gain.linearRampToValueAtTime(0.2, this.ctx.currentTime + 2);
  }

  playSfx(type: 'click' | 'hover' | 'error' | 'success') {
    if (!this.ctx || !this.master) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.connect(gain);
    gain.connect(this.master);

    if (type === 'hover') {
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.05);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.05);
      osc.start();
      osc.stop(now + 0.05);
    } else if (type === 'click') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      osc.start();
      osc.stop(now + 0.1);
    }
  }

  setWarpIntensity(intensity: number) {
    if (!this.ctx || !this.drone || !this.droneGain) return;
    const now = this.ctx.currentTime;
    // Pitch up
    this.drone.frequency.setTargetAtTime(50 + (intensity * 400), now, 0.5);
    // Volume up
    this.droneGain.gain.setTargetAtTime(0.2 + (intensity * 0.3), now, 0.5);
  }
}

// --- CUSTOM SHADERS ---

const WormholeMaterial = shaderMaterial(
  { 
    uTime: 0, 
    uSpeed: 0,
    uColorStart: new THREE.Color("#000000"),
    uColorEnd: new THREE.Color("#00f3ff"),
    uTexture: null
  },
  // Vertex Shader
  `
    varying vec2 vUv;
    varying float vDepth;
    uniform float uTime;
    uniform float uSpeed;

    void main() {
      vUv = uv;
      vec3 pos = position;
      
      // Twist effect
      float angle = pos.z * 0.05 + uTime * 0.5;
      float s = sin(angle);
      float c = cos(angle);
      mat2 rotation = mat2(c, -s, s, c);
      pos.xy = rotation * pos.xy;

      // Expansion breath
      float breath = sin(uTime * 2.0 + pos.z * 0.1) * (0.5 + uSpeed);
      pos.xy *= 1.0 + breath * 0.1;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      vDepth = pos.z;
    }
  `,
  // Fragment Shader
  `
    varying vec2 vUv;
    varying float vDepth;
    uniform float uTime;
    uniform float uSpeed;
    uniform vec3 uColorStart;
    uniform vec3 uColorEnd;

    // Pseudo-random
    float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }

    void main() {
      // Moving grid
      vec2 gridUv = vUv;
      gridUv.y += uTime * (1.0 + uSpeed * 5.0);
      
      float gridLine = step(0.95, fract(gridUv.y * 10.0)) + step(0.98, fract(gridUv.x * 20.0));
      
      // Electric arcs
      float noise = random(floor(gridUv * 20.0));
      float arc = step(0.98, noise) * step(0.5, sin(uTime * 20.0 + gridUv.y));

      // Color mixing
      float depthFactor = smoothstep(-50.0, 0.0, vDepth);
      vec3 finalColor = mix(uColorEnd, uColorStart, depthFactor);
      
      // Add intense glow to lines
      finalColor += vec3(1.0) * gridLine * (0.2 + uSpeed);
      finalColor += vec3(0.5, 1.0, 1.0) * arc * (uSpeed * 2.0);

      float alpha = smoothstep(-100.0, -10.0, vDepth);
      gl_FragColor = vec4(finalColor, alpha);
    }
  `
);

extend({ WormholeMaterial });

// --- 3D COMPONENTS ---

function WormholeTunnel({ isWarping }: { isWarping: boolean }) {
  const ref = useRef<any>(null);
  const tubeRef = useRef<THREE.Mesh>(null);
  
  // Create a curved path
  const path = useMemo(() => {
    const points = [];
    for (let i = 0; i < 50; i++) {
      const t = i / 50;
      const angle = t * Math.PI * 4;
      points.push(new THREE.Vector3(
        Math.sin(angle) * 10, 
        Math.cos(angle) * 10, 
        -i * 10
      ));
    }
    return new THREE.CatmullRomCurve3(points);
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.uTime = state.clock.elapsedTime;
      ref.current.uSpeed = THREE.MathUtils.lerp(ref.current.uSpeed, isWarping ? 2.0 : 0.1, 0.05);
    }
    if (tubeRef.current) {
      // Rotate entire tunnel slightly
      tubeRef.current.rotation.z = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <mesh ref={tubeRef}>
      <tubeGeometry args={[path, 64, 4, 16, false]} />
      {/* @ts-ignore */}
      <wormholeMaterial 
        ref={ref} 
        side={THREE.BackSide} 
        transparent 
        blending={THREE.AdditiveBlending}
        uColorStart={new THREE.Color("#0a001f")}
        uColorEnd={new THREE.Color("#00f3ff")}
      />
    </mesh>
  );
}

function WarpParticles({ count = 1000, isWarping }: { count?: number, isWarping: boolean }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  // Initial random positions
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        x: (Math.random() - 0.5) * 50,
        y: (Math.random() - 0.5) * 50,
        z: (Math.random() - 0.5) * 100,
        speed: 0.1 + Math.random() * 0.5
      });
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    if (!mesh.current) return;
    const speedMult = isWarping ? 10 : 1;
    
    particles.forEach((p, i) => {
      p.z += p.speed * speedMult;
      if (p.z > 20) p.z = -100;
      
      dummy.position.set(p.x, p.y, p.z);
      
      // Stretch based on speed
      const scaleZ = isWarping ? 5 + Math.random() * 5 : 1;
      dummy.scale.set(1, 1, scaleZ);
      
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <boxGeometry args={[0.05, 0.05, 0.5]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
    </instancedMesh>
  );
}

function FloatingUI() {
  return (
    <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
      <group position={[0, -2, -4]} rotation={[-0.5, 0, 0]}>
        <mesh>
           <planeGeometry args={[6, 2]} />
           <meshBasicMaterial color="#00f3ff" transparent opacity={0.05} wireframe />
        </mesh>
        <mesh position={[0, 0, -0.1]}>
           <planeGeometry args={[6, 2]} />
           <meshBasicMaterial color="#000" transparent opacity={0.8} />
        </mesh>
      </group>
    </Float>
  )
}

// --- 2D UI COMPONENTS (DIEGETIC-STYLE) ---

const HolographicCard = ({ children, className, animate = true }: any) => (
  <div className={cn(
    "relative bg-black/30 backdrop-blur-xl border border-white/10 overflow-hidden group transition-all duration-300 hover:bg-black/50 hover:border-neon-cyan/50",
    className
  )}>
    {animate && <div className="absolute inset-0 bg-gradient-to-tr from-neon-cyan/5 via-transparent to-neon-magenta/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />}
    <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-white/40" />
    <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-white/40" />
    <div className="absolute bottom-0 left-0 w-2 h-2 border-l border-b border-white/40" />
    <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-white/40" />
    {children}
  </div>
);

function DateScroller({ year, label, onChange }: any) {
  return (
    <div className="flex flex-col items-center gap-2">
       <span className="text-xs text-neon-cyan tracking-widest uppercase opacity-70">{label}</span>
       <div className="flex items-center gap-4">
          <button onClick={() => onChange(-1)} className="p-2 hover:bg-white/10 rounded transition text-white/50 hover:text-white"><Rewind size={20} /></button>
          <div className="text-6xl font-bold font-mono text-white tabular-nums relative">
             {year}
             <div className="absolute inset-0 bg-neon-cyan/20 blur-xl rounded-full opacity-20" />
          </div>
          <button onClick={() => onChange(1)} className="p-2 hover:bg-white/10 rounded transition text-white/50 hover:text-white"><SkipForward size={20} /></button>
       </div>
    </div>
  )
}

// --- MAIN PAGE ---

export default function TimeMachine() {
  const [year, setYear] = useState(2085);
  const [status, setStatus] = useState<'IDLE' | 'CHARGING' | 'WARPING' | 'COOLING'>('IDLE');
  const [audio, setAudio] = useState<AudioEngine | null>(null);
  
  // Initialize Audio on first interaction
  useEffect(() => {
    const initAudio = () => {
      if (!audio) {
        const eng = new AudioEngine();
        eng.initDrone();
        setAudio(eng);
      }
    };
    window.addEventListener('click', initAudio);
    return () => window.removeEventListener('click', initAudio);
  }, [audio]);

  // Warp Logic
  const handleJump = () => {
    if (status !== 'IDLE') return;
    audio?.playSfx('click');
    setStatus('CHARGING');
    
    // Charging Sequence
    let charge = 0;
    const interval = setInterval(() => {
      charge += 0.02;
      audio?.setWarpIntensity(charge); // Pitch rises
      if (charge >= 1) {
        clearInterval(interval);
        startWarp();
      }
    }, 30);
  };

  const startWarp = () => {
    setStatus('WARPING');
    audio?.setWarpIntensity(2.0); // Max intensity
    
    setTimeout(() => {
      setStatus('COOLING');
      audio?.setWarpIntensity(0); // Drop
      setTimeout(() => setStatus('IDLE'), 2000);
    }, 6000);
  };

  return (
    <main className="relative w-full h-screen bg-black text-white overflow-hidden font-rajdhani">
      
      {/* 3D SCENE */}
      <div className="absolute inset-0 z-0">
        <Canvas dpr={[1, 2]} gl={{ antialias: false }}>
           <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={70} />
           <color attach="background" args={['#020205']} />
           
           {/* Effects */}
           <WormholeTunnel isWarping={status === 'WARPING'} />
           <WarpParticles isWarping={status === 'WARPING'} />
           <FloatingUI />
           
           {/* Post Processing */}
           <EffectComposer disableNormalPass>
             <Bloom luminanceThreshold={0.1} mipmapBlur intensity={1.5} radius={0.5} />
             <ChromaticAberration 
               blendFunction={BlendFunction.NORMAL}
               offset={new THREE.Vector2(status === 'WARPING' ? 0.02 : 0.002, status === 'WARPING' ? 0.02 : 0.002)} 
               radialModulation={true}
               modulationOffset={0.5}
             />
             <Noise opacity={0.08} />
             <Vignette eskil={false} offset={0.1} darkness={1.1} />
             <Scanline density={1.5} opacity={0.1} />
           </EffectComposer>
           
           <ambientLight intensity={0.5} />
        </Canvas>
      </div>
      
      {/* UI OVERLAY */}
      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between p-8 md:p-12">
         
         {/* Header */}
         <header className="flex justify-between pointer-events-auto">
            <div className="glass-panel px-6 py-3 rounded-br-2xl border-l-4 border-neon-cyan">
               <h1 className="text-2xl font-bold tracking-widest">CHRONO<span className="text-neon-cyan">VISOR</span></h1>
               <div className="text-[10px] opacity-60 tracking-[0.5em]">TEMPORAL SYSTEMS INC.</div>
            </div>
            <div className="flex gap-2">
               <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
               <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse delay-100" />
               <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse delay-200" />
            </div>
         </header>

         {/* Main Controls */}
         <div className="flex flex-col items-center pointer-events-auto">
            <HolographicCard className="p-12 flex flex-col gap-8 items-center rounded-xl bg-black/60">
               <div className="flex gap-12">
                 <DateScroller label="TARGET YEAR" year={year} onChange={(d: number) => { audio?.playSfx('hover'); setYear(y => y + d); }} />
               </div>
               
               <button 
                 onClick={handleJump}
                 disabled={status !== 'IDLE'}
                 className={cn(
                   "relative group w-64 h-16 flex items-center justify-center overflow-hidden border transition-all duration-500",
                   status === 'IDLE' ? "border-neon-cyan bg-neon-cyan/5 hover:bg-neon-cyan/20" : "border-gray-500 bg-black opacity-50"
                 )}
               >
                  <div className={cn("absolute inset-0 bg-neon-cyan/20 transition-transform duration-1000", status === 'CHARGING' ? "translate-x-0" : "-translate-x-full")} />
                  <span className="relative z-10 font-bold text-xl tracking-[0.2em] flex items-center gap-2">
                     {status === 'IDLE' && <><Zap size={18} /> ENGAGE</>}
                     {status === 'CHARGING' && "CHARGING..."}
                     {status === 'WARPING' && "TRAVELLING"}
                     {status === 'COOLING' && "ARRIVED"}
                  </span>
               </button>
            </HolographicCard>
         </div>

         {/* Footer */}
         <footer className="flex justify-between items-end text-xs font-mono opacity-60 pointer-events-auto">
            <div className="flex gap-4">
               <div>
                  <div className="uppercase tracking-widest mb-1">Coordinates</div>
                  <div>40.7128° N, 74.0060° W</div>
               </div>
               <div>
                  <div className="uppercase tracking-widest mb-1">Flux</div>
                  <div className="text-neon-cyan">STABLE</div>
               </div>
            </div>
            <div>SYS.VER.9.2 // ONLINE</div>
         </footer>
      </div>
      
      {/* Fullscreen Flash */}
      <div className={cn("absolute inset-0 bg-white z-50 pointer-events-none transition-opacity duration-[2000ms]", status === 'COOLING' ? "opacity-100 duration-75" : "opacity-0")} />

    </main>
  );
}