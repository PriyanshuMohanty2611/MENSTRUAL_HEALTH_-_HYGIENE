import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Cylinder, RoundedBox } from '@react-three/drei';

const IoT3DStatus = ({ fillLevel = 0, isSpill = false }) => {
  const fillRef = useRef();

  useFrame((state) => {
    if (fillRef.current) {
      // Dynamic height based on fill level (0 - 100)
      const targetHeight = (fillLevel / 100) * 1.8;
      fillRef.current.scale.y = Math.max(0.01, targetHeight);
      fillRef.current.position.y = (targetHeight / 2) - 0.95;
    }
  });

  return (
    <group>
      {/* Bin Outer Shell */}
      <mesh position={[0, 0, 0]}>
        <Cylinder args={[1, 0.8, 2, 32]} openEnded>
          <meshStandardMaterial color="#94a3b8" side={2} transparent opacity={0.4} />
        </Cylinder>
      </mesh>

      {/* Fill Level */}
      <mesh ref={fillRef} position={[0, -0.95, 0]}>
        <Cylinder args={[0.95, 0.75, 1, 32]}>
          <meshStandardMaterial 
            color={fillLevel > 80 ? "#ef4444" : "#ec4899"} 
            emissive={fillLevel > 80 ? "#b91c1c" : "#000"}
            emissiveIntensity={0.5}
          />
        </Cylinder>
      </mesh>

      {/* Floor Spill Signal */}
      {isSpill && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.01, 0]}>
          <circleGeometry args={[2, 32]} />
          <meshStandardMaterial color="#3b82f6" transparent opacity={0.6} distort={0.5} />
        </mesh>
      )}

      {/* Base */}
      <RoundedBox args={[2.2, 0.1, 2.2]} radius={0.05} position={[0, -1.05, 0]}>
        <meshStandardMaterial color="#1e293b" />
      </RoundedBox>
    </group>
  );
};

export default IoT3DStatus;
