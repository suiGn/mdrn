// src/js/cameraControl.js
import * as THREE from 'three';

export function createCamera() {
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    return camera;
}

export function updateCameraPosition(camera, keys) {
    const speed = 0.2;
    const direction = new THREE.Vector3();
    if (keys['ArrowUp'] || keys['KeyW']) {
        direction.z -= speed;
    }
    if (keys['ArrowDown'] || keys['KeyS']) {
        direction.z += speed;
    }
    if (keys['ArrowLeft'] || keys['KeyA']) {
        direction.x -= speed;
    }
    if (keys['ArrowRight'] || keys['KeyD']) {
        direction.x += speed;
    }
    camera.position.add(direction);
    // Ensure the camera looks forward
    camera.lookAt(camera.position.x, camera.position.y, camera.position.z - 1);
}
