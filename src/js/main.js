import * as THREE from 'three';
import { createWireframeSphere } from './wireframeSphere.js';

// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('container').appendChild(renderer.domElement);

// Load the texture and set it as the background
const loader = new THREE.TextureLoader();
loader.load('starry_sky.jpg', (texture) => {
    scene.background = texture;
});

// Create an infinite grid
const gridHelper = new THREE.GridHelper(1000, 1000, 0x555555, 0x555555);
scene.add(gridHelper);

camera.position.set(0, 2, 0); // Set the camera at a height to simulate walking on a floor

// Handle keyboard input
const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
    KeyW: false,
    KeyA: false,
    KeyS: false,
    KeyD: false,
};

document.addEventListener('keydown', (event) => {
    keys[event.code] = true;
});

document.addEventListener('keyup', (event) => {
    keys[event.code] = false;
});

const updateCameraPosition = () => {
    const speed = 0.2;
    const direction = new THREE.Vector3();

    if (keys.ArrowUp || keys.KeyW) {
        direction.z -= speed;
    }
    if (keys.ArrowDown || keys.KeyS) {
        direction.z += speed;
    }
    if (keys.ArrowLeft || keys.KeyA) {
        direction.x -= speed;
    }
    if (keys.ArrowRight || keys.KeyD) {
        direction.x += speed;
    }

    camera.position.add(direction);

    // Ensure the camera looks forward
    camera.lookAt(camera.position.x, camera.position.y, camera.position.z - 1);
};

// Create a large sphere for the sky with custom shaders
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

const skyGeometry = new THREE.SphereGeometry(500, 32, 32);
const skyMaterial = new THREE.ShaderMaterial({
    vertexShader: vertexShaderSky,
    fragmentShader: fragmentShaderSky,
    side: THREE.BackSide
});
const skyMesh = new THREE.Mesh(skyGeometry, skyMaterial);
scene.add(skyMesh);

// Create the wireframe sphere
const wireframeSphere = createWireframeSphere(scene);

// Animation loop
const animate = () => {
    requestAnimationFrame(animate);
    updateCameraPosition();

    // Rotate the wireframe sphere
    wireframeSphere.rotation.x += 0.01;
    wireframeSphere.rotation.y += 0.01;

    renderer.render(scene, camera);
};

animate();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Append this code at the end of main.js

let draggedItem = null;
let offsetX = 0, offsetY = 0;

document.querySelector('.button-circle').addEventListener('mousedown', function (e) {
    e.preventDefault();
    const rect = this.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    draggedItem = this;
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
});

function onMouseMove(e) {
    if (draggedItem) {
        let newLeft = e.clientX - offsetX;
        let newTop = e.clientY - offsetY;

        // Ensure the button stays within the viewport
        const rect = draggedItem.getBoundingClientRect();
        if (newLeft < 0) newLeft = 0;
        if (newTop < 0) newTop = 0;
        if (newLeft + rect.width > window.innerWidth) newLeft = window.innerWidth - rect.width;
        if (newTop + rect.height > window.innerHeight) newTop = window.innerHeight - rect.height;

        draggedItem.style.left = newLeft + 'px';
        draggedItem.style.top = newTop + 'px';
    }
}

function onMouseUp() {
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
    draggedItem = null;
}
