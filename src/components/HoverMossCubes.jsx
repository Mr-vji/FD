import { useRef, useState, useMemo } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const CUBE_COUNT = 100;

export default function HoverMossCubes() {
   const instancedRef = useRef();
   const { viewport, mouse, camera, raycaster, scene } = useThree();

   const [positions] = useState(() => new Array(CUBE_COUNT).fill().map(() => new THREE.Vector3()));

   const dummy = useMemo(() => new THREE.Object3D(), []);
   const planeRef = useRef();

   const mossTargets = useRef([]);

   useFrame(() => {
      // Raycast mouse to plane
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(planeRef.current);
      if (intersects.length > 0) {
         const point = intersects[0].point;

         // Add new moss target if under max count
         if (mossTargets.current.length < CUBE_COUNT) {
            mossTargets.current.push({ pos: point.clone(), scale: 0.01 });
         }
      }

      // Animate moss cubes
      mossTargets.current.forEach((moss, i) => {
         if (i >= CUBE_COUNT) return;

         moss.scale = THREE.MathUtils.lerp(moss.scale, 1, 0.05);

         dummy.position.copy(moss.pos);
         dummy.scale.setScalar(moss.scale);
         dummy.updateMatrix();
         instancedRef.current.setMatrixAt(i, dummy.matrix);
      });

      instancedRef.current.instanceMatrix.needsUpdate = true;
   });

   return (
      <>
         {/* Plane base */}
         <mesh ref={planeRef} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[5, 5]} />
            <meshBasicMaterial color="#222" />
         </mesh>

         {/* Growing cubes */}
         <instancedMesh ref={instancedRef} args={[null, null, CUBE_COUNT]}>
            <boxGeometry args={[0.1, 0.1, 0.1]} />
            <meshStandardMaterial color="green" />
         </instancedMesh>
      </>
   );
}
