import { ContactShadows, Environment, OrbitControls } from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { useControls } from "leva";
import { Object } from "./Object";
import { Uji } from "./Uji";
import { MossMesh } from "./MossMesh";
import HoverMossPlane, { MossShaderMaterial } from "./MossShaderMaterial";
import * as THREE from "three";

export const Experience = () => {
   const { bloom, bloomIntensity } = useControls({
      bloom: { value: true, label: "Enable Bloom" },
      bloomIntensity: {
         value: 0.6,
         min: 0,
         max: 5,
         step: 0.1,
         label: "Bloom Intensity",
      },
   });

   return (
      <>
         {/* <Environment preset="studio" /> */}
         <directionalLight position={[1, 1, 5]} intensity={1} />
         <ContactShadows position={[0, -1.2, 0]} scale={20} blur={1} far={12} opacity={0.2} />
         <Environment preset="city" />

         {/* <Object /> */}
         {/* <Uji /> */}
         {/* <MossMesh /> */}

         {bloom && (
            <EffectComposer>
               <Bloom intensity={bloomIntensity} luminanceThreshold={1} mipmapBlur />
            </EffectComposer>
         )}
      </>
   );
};
