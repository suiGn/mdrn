// src/js/textureLoader.js
import * as THREE from 'three';
export function loadTexture(path, scene) {
    const loader = new THREE.TextureLoader();
    loader.load(
        path,
        (texture) => {
            scene.background = texture;
        },
        undefined,
        (error) => {
            console.error('An error occurred loading the texture:', error);
        }
    );
}
