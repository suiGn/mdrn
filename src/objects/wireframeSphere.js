// mdrn/src/js/wireframeSphere.js
import * as THREE from 'three';

export function createWireframeSphere(scene, color = 0x0000ff) {
    const geometry = new THREE.SphereGeometry(5, 32, 32);
    const wireframeMaterial = new THREE.MeshBasicMaterial({
        //blue color
        color: color,
        wireframe: true,
    });
    const wireframeSphere = new THREE.Mesh(geometry, wireframeMaterial);
    scene.add(wireframeSphere);

    // Return the sphere so we can animate it
    return wireframeSphere;
}
