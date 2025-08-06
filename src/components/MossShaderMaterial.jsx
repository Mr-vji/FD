import { ShaderMaterial, Vector2 } from "three";
import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Declare shaders outside to avoid re-declaring on every render
const vertexShader = `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

const fragmentShader = `
    uniform float uTime;
    uniform vec2 uHoverPos;
    uniform float uProgress;
    uniform vec3 uMossColor;
    uniform vec3 uBaseColor;
    varying vec2 vUv;

    float circle(vec2 st, vec2 center, float radius) {
        return smoothstep(radius, radius - 0.1, distance(st, center));
    }

    void main() {
        float mask = circle(vUv, uHoverPos, uProgress);
        vec3 color = mix(uBaseColor, uMossColor, mask);
        gl_FragColor = vec4(color, 1.0);
    }
`;

export default function MossShaderMaterial({ hover, hoverPos, baseColor, mossColor }) {
   const material = useMemo(
      () =>
         new ShaderMaterial({
            uniforms: {
               uTime: { value: 0 },
               uHoverPos: { value: new Vector2() },
               uProgress: { value: 0 },
               uBaseColor: { value: baseColor },
               uMossColor: { value: mossColor },
            },
            vertexShader,
            fragmentShader,
         }),
      [baseColor, mossColor]
   );

   useFrame(({ clock }) => {
      material.uniforms.uTime.value = clock.getElapsedTime();
      material.uniforms.uHoverPos.value.copy(hoverPos);
      material.uniforms.uProgress.value = hover
         ? Math.min(material.uniforms.uProgress.value + 0.02 / 3.0, 1.0 / 3.0)
         : Math.max(material.uniforms.uProgress.value - 0.02 / 3.0, 0.0);
   });

   return <primitive object={material} attach="material" />;
}
