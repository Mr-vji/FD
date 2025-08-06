import { useRef, useState, useMemo } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import MossShaderMaterial from "./MossShaderMaterial";

export default function HoverMossPlane() {
   const mesh = useRef();
   const [hover, setHover] = useState(false);
   const hoverPos = useMemo(() => new THREE.Vector2(0.5, 0.5), []);
   const { size, viewport } = useThree();

   const onPointerMove = (e) => {
      const uv = e.uv;
      if (uv) hoverPos.set(uv.x, uv.y);
   };

   return (
      <mesh
         ref={mesh}
         onPointerOver={() => setHover(true)}
         onPointerOut={() => setHover(false)}
         onPointerMove={onPointerMove}
      >
         <planeGeometry args={[2, 2, 32, 32]} />
         <MossShaderMaterial
            hover={hover}
            hoverPos={hoverPos}
            baseColor={new THREE.Color(0x444444)}
            mossColor={new THREE.Color(0x66ff66)}
         />
      </mesh>
   );
}
