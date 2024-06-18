import * as THREE from 'three';
import { createWireframeSphere } from '../objects/wireframeSphere.js';
import { createSkySphere } from '../objects/skySphere.js';
import { createCamera, updateCameraPosition } from './cameraControl.js';
import { loadTexture } from './Texture/textureLoader.js';

// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = createCamera();
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('container').appendChild(renderer.domElement);

// Load the texture and set it as the background
loadTexture('./starry_sky.jpg', scene);
// Create an infinite grid
const gridHelper = new THREE.GridHelper(1000, 1000, 0x555555, 0x555555);
scene.add(gridHelper);
camera.position.set(0, 2, 0); // Set the camera at a height to simulate walking on a floor

// Dynamically capture all keyboard input
const keys = {};
document.addEventListener('keydown', (event) => {
    keys[event.code] = true;
});
document.addEventListener('keyup', (event) => {
    keys[event.code] = false;
});

// Create:
const skySphere = createSkySphere();
scene.add(skySphere);
const wireframeSphere = createWireframeSphere(scene, 0xff0000);
const wireframeSphere2 = createWireframeSphere(scene, 0x00ff00);

// Animation loop
const animate = () => {
requestAnimationFrame(animate);
updateCameraPosition(camera, keys);
// Rotate the wireframe sphere
//wireframeSphere.rotation.x += 0.01;
//wireframeSphere.rotation.y += 0.01;
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


//(MOUSE MOVEMENT KEYBOARD)
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
