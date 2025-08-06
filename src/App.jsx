import { Environment, Loader, OrbitControls, PositionalAudio, Stats } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { UI } from "./components/UI";
import HoverEffectCubes from "./Day2/HoverEffect";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { Uji } from "./components/Uji";

function App() {
   return (
      <>
         {/* <Stats /> */}
         {/* <UI /> */}
         <Loader />
         <Canvas gl={{ antialias: true }} shadows camera={{ position: [0, 0, 14], fov: 20 }}>
            {/* <fog attach="fog" args={["#574f5e", 8, 22]} /> */}
            {/* <color attach="background" args={["#574f5e"]} /> */}
            {/* <color attach="background" args={["#1d2b3a"]} /> */}
            <color attach="background" args={["black"]} />
            <Environment preset="city" />
            <ambientLight intensity={1} />
            <OrbitControls />
            <EffectComposer>
               <Bloom intensity={0.3} luminanceThreshold={0.4} mipmapBlur />
            </EffectComposer>

            {/* <HoverMossPlane /> */}
            <HoverEffectCubes />
            {/* <Uji /> */}
         </Canvas>
      </>
   );
}

export default App;
