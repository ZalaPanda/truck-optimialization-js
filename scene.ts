import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const [width, height] = [window.innerWidth, window.innerHeight]; // [400, 400];
const clock = new THREE.Clock();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, width / height, 100, 20000);
camera.position.set(-9000, 6000, 7000);

const board = document.createElement("div");
board.style.position = "absolute";
board.style.margin = "10px";
board.style.color = "#888888";
board.style.userSelect = "none";
document.body.appendChild(board);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // NOTE: smmoth camera
controls.target = new THREE.Vector3(0, 1000, 6800);
// controls.autoRotate = true; // HINT: turn this to false

const grid = new THREE.GridHelper(20000, 20, 0x1b8bd4, 0x115887);
grid.geometry.translate(2500 / 2, 0, 13600 / 2);
scene.add(grid);

(async () => {
  interface Box { name: string, color: number, w: number, h: number, l: number, x: number, y: number, z: number };
  const response = await fetch("./output.json");
  const boxes = await response.json() as Box[];
  const objects = boxes.map(box => {
    if (box.color) {
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(box.w, box.h, box.l),
        new THREE.MeshBasicMaterial({ color: box.color, transparent: true, opacity: 0.5 }));
      mesh.geometry.translate(box.w / 2, box.h / 2, box.l / 2);
      mesh.name = box.name;
      mesh.add(new THREE.LineSegments(
        new THREE.EdgesGeometry(mesh.geometry),
        new THREE.LineBasicMaterial({ color: 0xffffff })));
      mesh.position.set(box.x, box.y, box.z);
      scene.add(mesh);
      return mesh;
    } else {
      const edge = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.BoxGeometry(box.w, box.h, box.l)),
        new THREE.LineBasicMaterial({ color: 0x666666 }));
      edge.geometry.translate(box.w / 2, box.h / 2, box.l / 2);
      edge.position.set(box.x, box.y, box.z);
      scene.add(edge);
      return null;
    }
  }).filter(Boolean) as THREE.Object3D[];
  renderer.render(scene, camera);

  const hover = {
    actual: undefined as THREE.Object3D | undefined,
    coming: undefined as THREE.Object3D | undefined,
    update: (): Boolean => {
      if (hover.actual === hover.coming) return false;
      if (hover.actual instanceof THREE.Mesh) hover.actual.material.opacity = 0.5;
      if (hover.coming instanceof THREE.Mesh) hover.coming.material.opacity = 0.9;
      hover.actual = hover.coming;
      board.textContent = hover.coming?.name ?? null;
      return true;
    }
  };
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  renderer.domElement.addEventListener("mousemove", (event) => {
    mouse.x = (event.clientX / width) * 2 - 1; // HINT: normalize coordinates to range from -1 to 1
    mouse.y = - (event.clientY / height) * 2 + 1;
    // console.log("mouse", mouse.x, mouse.y);
    raycaster.setFromCamera(mouse, camera);
    hover.coming = raycaster.intersectObjects(objects).at(0)?.object;
  }, false);

  const animate = () => {
    const delta = clock.getDelta();
    const hasControlsUpdated = controls.update(delta);
    const hasHoverUpdated = hover.update();
    requestAnimationFrame(animate);
    if (hasControlsUpdated || hasHoverUpdated) renderer.render(scene, camera);
    // const { x, y, z } = camera.position;
    // console.log("perspective", x.toFixed(2), y.toFixed(2), z.toFixed(2));
  };
  animate();
})();