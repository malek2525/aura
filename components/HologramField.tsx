import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface HologramFieldProps {
  mood: string;
  moodIntensity?: number;
  isSpeaking?: boolean;
  isListening?: boolean;
}

interface ParticleFieldProps {
  mood: string;
  moodIntensity: number;
  isSpeaking: boolean;
  isListening: boolean;
}

const getMoodColor = (mood: string): THREE.Color => {
  const m = mood.toLowerCase();
  
  if (['calm', 'neutral', 'peaceful'].includes(m)) {
    return new THREE.Color(0.3, 0.6, 0.9);
  }
  if (['happy', 'excited', 'joy'].includes(m)) {
    return new THREE.Color(0.9, 0.4, 0.7);
  }
  if (['playful', 'flirty', 'romantic'].includes(m)) {
    return new THREE.Color(0.8, 0.3, 0.9);
  }
  if (['anxious', 'nervous'].includes(m)) {
    return new THREE.Color(0.9, 0.7, 0.3);
  }
  if (['sad', 'melancholy'].includes(m)) {
    return new THREE.Color(0.4, 0.5, 0.8);
  }
  
  return new THREE.Color(0.6, 0.4, 0.9);
};

const PARTICLE_COUNT = 400;

const ParticleField: React.FC<ParticleFieldProps> = ({ 
  mood, 
  moodIntensity, 
  isSpeaking,
  isListening 
}) => {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.PointsMaterial>(null);
  
  const { positions, originalPositions, velocities } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const originalPositions = new Float32Array(PARTICLE_COUNT * 3);
    const velocities = new Float32Array(PARTICLE_COUNT * 3);
    
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      const radius = 2 + Math.random() * 3;
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta) - 0.5;
      const z = radius * Math.cos(phi) * 0.5;
      
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      
      originalPositions[i * 3] = x;
      originalPositions[i * 3 + 1] = y;
      originalPositions[i * 3 + 2] = z;
      
      velocities[i * 3] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.01;
    }
    
    return { positions, originalPositions, velocities };
  }, []);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [positions]);

  useFrame((state) => {
    if (!pointsRef.current || !materialRef.current) return;
    
    const time = state.clock.getElapsedTime();
    const positionAttr = pointsRef.current.geometry.attributes.position;
    const posArray = positionAttr.array as Float32Array;
    
    const speedMultiplier = 0.3 + moodIntensity * 0.7;
    const speakingPulse = isSpeaking ? Math.sin(time * 8) * 0.15 + 1.1 : 1;
    const listeningPulse = isListening ? Math.sin(time * 4) * 0.08 + 1.05 : 1;
    const pulseScale = speakingPulse * listeningPulse;
    
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      
      const noiseX = Math.sin(time * speedMultiplier + i * 0.1) * 0.3;
      const noiseY = Math.cos(time * speedMultiplier * 0.8 + i * 0.15) * 0.4;
      const noiseZ = Math.sin(time * speedMultiplier * 0.6 + i * 0.2) * 0.2;
      
      posArray[i3] = (originalPositions[i3] + noiseX) * pulseScale;
      posArray[i3 + 1] = (originalPositions[i3 + 1] + noiseY) * pulseScale;
      posArray[i3 + 2] = (originalPositions[i3 + 2] + noiseZ) * pulseScale;
    }
    
    positionAttr.needsUpdate = true;
    
    const targetColor = getMoodColor(mood);
    materialRef.current.color.lerp(targetColor, 0.02);
    
    const baseOpacity = 0.4 + moodIntensity * 0.3;
    const opacityPulse = isSpeaking ? Math.sin(time * 6) * 0.1 + 0.1 : 0;
    materialRef.current.opacity = Math.min(baseOpacity + opacityPulse, 0.8);
    
    pointsRef.current.rotation.y = time * 0.05 * speedMultiplier;
    pointsRef.current.rotation.x = Math.sin(time * 0.1) * 0.1;
  });

  const initialColor = getMoodColor(mood);

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        ref={materialRef}
        size={0.08}
        color={initialColor}
        transparent
        opacity={0.5}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

const InnerGlow: React.FC<{ mood: string; moodIntensity: number; isSpeaking: boolean }> = ({ 
  mood, 
  moodIntensity,
  isSpeaking 
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);

  useFrame((state) => {
    if (!meshRef.current || !materialRef.current) return;
    
    const time = state.clock.getElapsedTime();
    const breathe = Math.sin(time * 0.5) * 0.1 + 1;
    const speakingScale = isSpeaking ? Math.sin(time * 4) * 0.05 + 1.05 : 1;
    
    meshRef.current.scale.setScalar(breathe * speakingScale);
    
    const targetColor = getMoodColor(mood);
    materialRef.current.color.lerp(targetColor, 0.02);
    
    const baseOpacity = 0.08 + moodIntensity * 0.08;
    materialRef.current.opacity = baseOpacity;
  });

  const initialColor = getMoodColor(mood);

  return (
    <mesh ref={meshRef} position={[0, -0.5, -1]}>
      <sphereGeometry args={[2, 32, 32]} />
      <meshBasicMaterial
        ref={materialRef}
        color={initialColor}
        transparent
        opacity={0.1}
        side={THREE.BackSide}
      />
    </mesh>
  );
};

const HologramField: React.FC<HologramFieldProps> = ({ 
  mood, 
  moodIntensity = 0.5, 
  isSpeaking = false,
  isListening = false 
}) => {
  return (
    <div className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        style={{ background: 'transparent' }}
        gl={{ 
          alpha: true, 
          antialias: true,
          powerPreference: 'high-performance'
        }}
      >
        <ambientLight intensity={0.3} />
        <InnerGlow mood={mood} moodIntensity={moodIntensity} isSpeaking={isSpeaking} />
        <ParticleField 
          mood={mood} 
          moodIntensity={moodIntensity} 
          isSpeaking={isSpeaking}
          isListening={isListening}
        />
      </Canvas>
    </div>
  );
};

export default HologramField;
