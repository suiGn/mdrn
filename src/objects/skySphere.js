// src/js/skySphere.js
import * as THREE from 'three';

const vertexShaderSky = `
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShaderSky = `
varying vec2 vUv;

float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

void main() {
    vec3 color = vec3(0.0);

    // Create a gradient background
    float y = vUv.y * 2.0 - 1.0; // Map vUv.y from 0.0-1.0 to -1.0-1.0
    color = mix(vec3(0.1, 0.1, 0.2), vec3(0.0, 0.0, 0.0), y * 0.5 + 0.5);

    // Add noise to the background
    float noise = random(vUv * 100.0);
    color += noise * 0.1;

    // Create stars
    float starDensity = 1000.0;
    float brightness = step(0.995, random(vUv * starDensity));
    color += vec3(brightness);

    gl_FragColor = vec4(color, 1.0);
}
`;

export function createSkySphere() {
    const skyGeometry = new THREE.SphereGeometry(500, 32, 32);
    const skyMaterial = new THREE.ShaderMaterial({
        vertexShader: vertexShaderSky,
        fragmentShader: fragmentShaderSky,
        side: THREE.BackSide
    });
    const skyMesh = new THREE.Mesh(skyGeometry, skyMaterial);
    return skyMesh;
}