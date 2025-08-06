import * as THREE from "three";
import React, { useRef, useState } from "react";
import { useFrame, extend } from "@react-three/fiber";
import { shaderMaterial, useGLTF, useTexture } from "@react-three/drei";
import { VFXEmitter, VFXParticles } from "wawa-vfx";

// ShaderMaterial without noise
const HoverShaderMaterial = shaderMaterial(
   {
      uTime: 0,
      uMouse: new THREE.Vector2(0.5, 0.5),
      uRadius: 0,
      uColor: new THREE.Color(0x6cbf6c),
   },
   `
   varying vec2 vUv;
   void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
   }
   `,
   `
   precision mediump float;
   uniform float uTime;
   uniform vec2 uMouse;
   uniform float uRadius;
   uniform vec3 uColor;
   varying vec2 vUv;

   void main() {
      float dist = distance(vUv, uMouse);
      float circle = 1.0 - smoothstep(uRadius - 0.1, uRadius, dist);
      float alpha = circle;
      if (alpha < 0.01) discard;
      gl_FragColor = vec4(uColor, alpha);
   }
   `
);

extend({ HoverShaderMaterial });

function uvToSpherePosition(uv, radius = 1) {
   const theta = uv.x * 2 * Math.PI;
   const phi = uv.y * Math.PI;
   const x = -radius * Math.sin(phi) * Math.cos(theta);
   const y = -radius * Math.cos(phi);
   const z = radius * Math.sin(phi) * Math.sin(theta);
   return new THREE.Vector3(x, y, z);
}

function MossRevealSphere({ hovering, mouseUv }) {
   const shaderRef = useRef();

   useFrame((_, delta) => {
      if (shaderRef.current) {
         shaderRef.current.uTime += delta;
         shaderRef.current.uRadius = THREE.MathUtils.lerp(
            shaderRef.current.uRadius,
            hovering ? 0.1 : 0.0,
            0.1
         );
         shaderRef.current.uMouse.set(mouseUv.x, mouseUv.y);
      }
   });

   return (
      <mesh position={[0, 0, 0.01]}>
         <sphereGeometry args={[1, 64, 64]} />
         <hoverShaderMaterial ref={shaderRef} transparent />
      </mesh>
   );
}

export default function HoverEffect() {
   const [hovering, setHovering] = useState(false);
   const [mouseUv, setMouseUv] = useState(new THREE.Vector2(0.5, 0.5));
   const [particlePosition, setParticlePosition] = useState(new THREE.Vector3());

   const texture = useTexture("/images/two.png");
   const { nodes } = useGLTF("/models/vji.glb");

   const onPointerMove = (e) => {
      if (e.uv) {
         setMouseUv(e.uv);
         setHovering(true);
         const worldPos = uvToSpherePosition(e.uv, 1);
         setParticlePosition(worldPos);
      }
   };

   return (
      <>
         {/* Base Sphere */}
         <mesh
            onPointerMove={onPointerMove}
            onPointerOut={() => setHovering(false)}
            position={[0, 0, 0]}
            visible={true}
         >
            <sphereGeometry args={[1, 64, 64]} />
            <meshStandardMaterial color="red" roughness={0.5} metalness={0.5} />
         </mesh>

         {/* Moss Reveal Shader Layer */}
         <MossRevealSphere hovering={hovering} mouseUv={mouseUv} />

         {/* VFX Particles */}
         <VFXS nodes={nodes} />
         <Spells particlePosition={particlePosition} showParticles={hovering} />

         <ambientLight intensity={0.5} />
         <directionalLight position={[1, 1, 1]} intensity={1} />
      </>
   );
}

const VFXS = ({ nodes }) => {
   return (
      <>
         <VFXParticles
            name="sparks"
            geometry={<primitive object={nodes.Plant_7.geometry} />}
            settings={{
               nbParticles: 1000,
               intensity: 2,
               fadeSize: [0.9, 0.1],
            }}
         />
      </>
   );
};

const Spells = ({ particlePosition, showParticles }) => {
   return showParticles && <Void position={particlePosition} />;
};

const Void = ({ position }) => {
   return (
      <group position={position}>
         <VFXEmitter
            emitter="sparks"
            settings={{
               duration: 0.2,
               delay: 0,
               nbParticles: 100,
               spawnMode: "time",
               loop: true,
               startPositionMin: [-0.3, -0.1, -0.1],
               startPositionMax: [0.3, 0.1, 0.5],
               startRotationMin: [Math.PI, 0, 0],
               startRotationMax: [-Math.PI, 0, 0],
               particlesLifetime: [0.5, 1.5],
               speed: [0.1, 0.3],
               directionMin: [-1, -1, -1],
               directionMax: [1, 1, 1],
               rotationSpeedMin: [0, 0, 0],
               rotationSpeedMax: [0, 0, 0],
               colorStart: ["#7CFC00"],
               colorEnd: ["#6C8E68"],
               size: [0.1, 0.8],
            }}
         />
      </group>
   );
};
