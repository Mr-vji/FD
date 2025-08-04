import { Loader, PositionalAudio, Stats } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/Experience";
import { UI } from "./components/UI";

function App() {
   return (
      <>
         {/* <Stats /> */}
         {/* <UI /> */}
         {/* <Loader /> */}
         <Canvas gl={{ antialias: true }} shadows camera={{ position: [4, 3, 14], fov: 25 }}>
            {/* <fog attach="fog" args={["#574f5e", 8, 22]} /> */}
            {/* <color attach="background" args={["#574f5e"]} /> */}
            {/* <color attach="background" args={["#1d2b3a"]} /> */}
            <Experience />
         </Canvas>
      </>
   );
}

export default App;
