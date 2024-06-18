// mdrn/src/js/wireframeBox.js
import * as THREE from 'three';

export function createWireframeBox(scene, color = 0x0000ff) {
    const geometry = new THREE.BoxGeometry(5, 5, 5);
    const wireframeMaterial = new THREE.MeshBasicMaterial({
        color: color,
        wireframe: true,
    });
    const wireframeBox = new THREE.Mesh(geometry, wireframeMaterial);
    scene.add(wireframeBox);

    // Return the box so we can animate it
    return wireframeBox;
}