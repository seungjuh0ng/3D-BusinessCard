import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Float, SpotLight, Environment } from "@react-three/drei";
import * as THREE from "three";

const CARD_WIDTH = 3.5;
const CARD_HEIGHT = 2;
const CARD_DEPTH = 0.02;

function BusinessCard() {
  const cardRef = useRef<THREE.Group>(null);
  const spotLightRef = useRef<THREE.SpotLight>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Add smooth rotation animation
  useFrame((_, delta) => {
    if (cardRef.current) {
      // Add a subtle continuous rotation
      cardRef.current.rotation.y += delta * 0.2;
    }
  });

  // Front side content
  const frontContent = {
    name: "Name",
    title: "Title",
    description: "Description",
  };

  // Back side content
  const backContent = {
    skills: ["Stack1", "Stack2", "Stack3"],
    contact: "email@example.com",
    github: "github.com/username",
  };

  const handleGithubClick = () => {
    window.open(`https://${backContent.github}`, "_blank");
  };

  return (
    <>
      {/* Enhanced lighting setup */}
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={0.5}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <SpotLight
        ref={spotLightRef}
        position={[0, 5, 0]}
        angle={0.3}
        penumbra={0.5}
        intensity={0.5}
        castShadow
        color="#ffffff"
      />
      <pointLight position={[-5, 5, -5]} intensity={0.3} color="#ff0000" />
      <pointLight position={[5, 5, -5]} intensity={0.3} color="#0000ff" />

      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.2}>
        <group ref={cardRef}>
          {/* Card base with enhanced material */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[CARD_WIDTH, CARD_HEIGHT, CARD_DEPTH]} />
            <meshPhysicalMaterial
              color="#ffffff"
              metalness={0.1}
              roughness={0.2}
              clearcoat={1}
              clearcoatRoughness={0.1}
              envMapIntensity={1}
            />
          </mesh>

          {/* Front side text */}
          <group position={[0, 0, CARD_DEPTH / 2 + 0.01]}>
            <Text
              position={[0, 0.6, 0]}
              fontSize={0.2}
              color="#000000"
              anchorX="center"
              anchorY="middle"
            >
              {frontContent.name}
            </Text>
            <Text
              position={[0, 0.3, 0]}
              fontSize={0.15}
              color="#666666"
              anchorX="center"
              anchorY="middle"
            >
              {frontContent.title}
            </Text>
            <Text
              position={[0, 0, 0]}
              fontSize={0.1}
              color="#888888"
              anchorX="center"
              anchorY="middle"
            >
              {frontContent.description}
            </Text>
          </group>

          {/* Back side text */}
          <group
            position={[0, 0, -CARD_DEPTH / 2 - 0.01]}
            rotation={[0, Math.PI, 0]}
          >
            <Text
              position={[0, 0.4, 0]}
              fontSize={0.15}
              color="#000000"
              anchorX="center"
              anchorY="middle"
            >
              Skills
            </Text>
            <Text
              position={[0, 0.2, 0]}
              fontSize={0.1}
              color="#666666"
              anchorX="center"
              anchorY="middle"
            >
              {backContent.skills.join(" • ")}
            </Text>
            <Text
              position={[0, -0.1, 0]}
              fontSize={0.1}
              color="#666666"
              anchorX="center"
              anchorY="middle"
            >
              {backContent.contact}
            </Text>
            <Text
              position={[0, -0.3, 0]}
              fontSize={0.1}
              color={isHovered ? "#000000" : "#666666"}
              anchorX="center"
              anchorY="middle"
              onClick={handleGithubClick}
              onPointerOver={() => setIsHovered(true)}
              onPointerOut={() => setIsHovered(false)}
            >
              {backContent.github}
            </Text>
          </group>
        </group>
      </Float>

      {/* Environment map for realistic reflections */}
      <Environment preset="city" />
    </>
  );
}

export default BusinessCard;
