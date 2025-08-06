// Grass.js
import * as THREE from 'three';
import { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';

export default function Grass() {
  const uniforms = useMemo(() => ({
    time: { value: 0 },
  }), []);

  useFrame((state) => {
    uniforms.time.value = state.clock.elapsedTime;
  });

  const vertexShader = `
    varying vec2 vUv;
    uniform float time;

    vec4 computeNoise(vec3 x0, vec3 x1, vec3 x2, vec3 x3, vec4 p0, vec4 p1, vec4 p2, vec4 p3, vec4 m) {
        vec4 G0 = vec4(x0.x, x0.y, x0.z, 0.0);
        vec4 G1 = vec4(x1.x, x1.y, x1.z, 0.0);
        vec4 G2 = vec4(x2.x, x2.y, x2.z, 0.0);
        vec4 G3 = vec4(x3.x, x3.y, x3.z, 0.0);

        vec4 v0 = G0 * (m.x * dot(G0, p0));
        vec4 v1 = G1 * (m.y * dot(G1, p1));
        vec4 v2 = G2 * (m.z * dot(G2, p2));
        vec4 v3 = G3 * (m.w * dot(G3, p3));

        float noise = 60.0 * (v0.x + v1.x + v2.x + v3.x);
        return vec4(noise);
    }

    void main() {
        vUv = uv;
        vec3 transformed = position;

        // Example wave-like deformation
        transformed.y += sin(position.x * 10.0 + time) * 0.1;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
    }
  `;

  const fragmentShader = `
    varying vec2 vUv;

    void main() {
        gl_FragColor = vec4(0.1, 0.8, 0.2, 1.0); // Green grass color
    }
  `;

  return (
    <mesh>
      <planeGeometry args={[2, 2, 32, 32]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
