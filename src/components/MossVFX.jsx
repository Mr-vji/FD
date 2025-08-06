import { useVFX } from "wawa-vfx";
import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";

export default function MossVFX() {
   const emit = useVFX("mossGrow"); // Make sure you create this emitter in your VFX editor
   const { mouse, camera, raycaster } = useThree();
   const planeRef = useRef();

   useFrame(() => {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(planeRef.current);
      if (intersects.length > 0) {
         const point = intersects[0].point;
         emit({ position: point });
      }
   });

   return (
      <mesh ref={planeRef} rotation={[-Math.PI / 2, 0, 0]}>
         <planeGeometry args={[5, 5]} />
         <meshStandardMaterial color="black" />
      </mesh>
   );
}
