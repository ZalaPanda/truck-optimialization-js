import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const [width, height] = [window.innerWidth, window.innerHeight]; // [400, 400];
const clock = new THREE.Clock();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, width / height, 100, 20000);
camera.position.set(-9000, 6000, 7000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // NOTE: smmoth camera
controls.target = new THREE.Vector3(0, 1000, 6800);
controls.autoRotate = true; // HINT: turn this to false

const grid = new THREE.GridHelper(20000, 20, 0x1b8bd4, 0x115887);
grid.geometry.translate(2500 / 2, 0, 13600 / 2);
scene.add(grid);

(async () => {
  interface Box { name: string, color: number, w: number, h: number, l: number, x: number, y: number, z: number };
  const response = await fetch("./output.json");
  const boxes = await response.json() as Box[];
  boxes.map(box => {
    if (box.color) {
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(box.w, box.h, box.l),
        new THREE.MeshBasicMaterial({ color: box.color, transparent: true, opacity: 0.5 }));
      mesh.geometry.translate(box.w / 2, box.h / 2, box.l / 2);
      mesh.add(new THREE.LineSegments(
        new THREE.EdgesGeometry(mesh.geometry),
        new THREE.LineBasicMaterial({ color: 0xffffff })));
      mesh.position.set(box.x, box.y, box.z);
      scene.add(mesh);
    } else {
      const edge = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.BoxGeometry(box.w, box.h, box.l)),
        new THREE.LineBasicMaterial({ color: 0x666666 }));
      edge.geometry.translate(box.w / 2, box.h / 2, box.l / 2);
      edge.position.set(box.x, box.y, box.z);
      scene.add(edge);
    }
  });
  renderer.render(scene, camera);

  const animate = () => {
    const delta = clock.getDelta();
    const hasControlsUpdated = controls.update(delta);
    requestAnimationFrame(animate);
    if (hasControlsUpdated) renderer.render(scene, camera);
    // const { x, y, z } = camera.position;
    // console.log(x.toFixed(2), y.toFixed(2), z.toFixed(2));
  };
  animate();
})();