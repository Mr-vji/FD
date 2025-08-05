import { Environment, Float, OrbitControls, useGLTF, useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { DoubleSide } from "three";
import { VFXEmitter, VFXParticles } from "wawa-vfx";
import * as THREE from "three";
import { degToRad } from "three/src/math/MathUtils.js";
import { FD } from "./FD";

export const Object = () => {
   const mouseAnimationRef = useRef();
   const model = useRef();
   const tmpVec = new THREE.Vector3();
   const viewport = useThree((state) => state.viewport);
   const [isHovering, setIsHovering] = useState(false);

   useFrame(({ pointer }) => {
      tmpVec.set((pointer.x * viewport.width) / 2, (pointer.y * viewport.height) / 2, 0);
      if (mouseAnimationRef.current && isHovering) {
         mouseAnimationRef.current.position.copy(tmpVec);
      }
   });
   const texture = useTexture("/images/two.png");
   const { nodes } = useGLTF("/models/vji.glb");

   useEffect(() => {
      texture.repeat.set(1, 1);
   }, [texture]);

   return (
      <>
         <VFXS nodes={nodes} texture={texture} />
         <Spells mouseAnimationRef={mouseAnimationRef} isHovering={isHovering} />
         {/* <OrbitControls enableZoom={false} /> */}
         <OrbitControls
            enableZoom={false}
            minPolarAngle={Math.PI / 3} // lower vertical angle limit (e.g. 60°)
            maxPolarAngle={Math.PI / 2} // upper vertical angle limit (e.g. 90°)
            minAzimuthAngle={-Math.PI / 4} // left limit (e.g. -45°)
            maxAzimuthAngle={Math.PI / 4} // right limit (e.g. +45°)
         />
         <Environment preset="city" />
         {/* <mesh
            visible={false}
            position={[-0.3, -0.1, 0]}
            onPointerEnter={() => setIsHovering(true)}
            onPointerLeave={() => setIsHovering(false)}
         >
            <planeGeometry args={[5.6, 3, 1]} />
            <meshStandardMaterial roughness={1} metalness={1} color={"pink"} />
         </mesh> */}

         <FD
            ref={model}
            scale={5}
            onPointerEnter={() => setIsHovering(true)}
            onPointerLeave={() => setIsHovering(false)}
         />
      </>
   );
};

const VFXS = ({ nodes, texture }) => {
   return (
      <>
         <VFXParticles
            name="sparks"
            geometry={<primitive object={nodes.Plant_7.geometry} />}
            settings={{
               nbParticles: 1000,
               //    renderMode: "billboard",
               intensity: 4,
               fadeSize: [0.9, 0.1],
            }}
            material={<meshStandardMaterial roughness={1} metalness={1} color={"white"} />}
         />

         {/* <VFXParticles
            name="sparks"
            // geometry={<coneGeometry args={[0.5, 1, 8, 1]} />}
            geometry={<planeGeometry args={[1, 1]} />}
            settings={{
               nbParticles: 100000,
               renderMode: "billboard",
               intensity: 10,
               fadeSize: [0.1, 0.1],
            }}
         /> */}
      </>
   );
};

const Spells = ({ mouseAnimationRef, isHovering }) => {
   return <>{isHovering && <Void mouseAnimationRef={mouseAnimationRef} />}</>;
};

const Void = ({ mouseAnimationRef, ...props }) => {
   return (
      <group {...props}>
         <VFXEmitter
            ref={mouseAnimationRef}
            emitter="sparks"
            debug
            settings={{
               duration: 1.5,
               delay: 0,
               nbParticles: 500,
               spawnMode: "time",
               loop: true,
               startPositionMin: [-0.5, -0.0, -0.5],
               startPositionMax: [0.5, 0.0, 1],
               startRotationMin: [Math.PI, 0, 0], // Changed to [0, 0, 0] for no initial rotation
               startRotationMax: [-Math.PI, 0, 0], // Changed to [0, 0, 0] for no initial rotation
               particlesLifetime: [0.5, 2.0],
               speed: [0, 1],
               directionMin: [-0.1, 0.05, -0.1],
               directionMax: [0.1, -0.1, 0.1],
               rotationSpeedMin: [0, 0, 0],
               rotationSpeedMax: [0, 0, 0],
               colorStart: ["#3fba4e"],
               colorEnd: ["#2f52c3"],
               size: [0.5, 0.8],
            }}
         />
      </group>
   );
};
