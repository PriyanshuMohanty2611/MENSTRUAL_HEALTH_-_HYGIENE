import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Float, MeshDistortMaterial } from '@react-three/drei';

const Product3DModel = () => {
  const meshRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(t / 2) / 4;
      meshRef.current.position.y = Math.sin(t / 1.5) / 10;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef}>
        {/* Main Pad Body */}
        <RoundedBox args={[3, 0.2, 1.5]} radius={0.1} smoothness={4}>
          <meshStandardMaterial color="#fff" roughness={0.3} metalness={0.1} />
        </RoundedBox>
        
        {/* Texture Layer */}
        <RoundedBox args={[2.8, 0.22, 1.3]} radius={0.05} smoothness={4} position={[0, 0, 0]}>
          <MeshDistortMaterial
            color="#fdf2f8"
            speed={2}
            distort={0.1}
            radius={1}
          />
        </RoundedBox>

        {/* Decorative Wings (Simplified) */}
        <RoundedBox args={[1, 0.15, 2.5]} radius={0.1} smoothness={4} position={[0, -0.05, 0]}>
          <meshStandardMaterial color="#fce7f3" />
        </RoundedBox>
      </mesh>
    </Float>
  );
};

export default Product3DModel;
