import * as THREE from 'three';
import 'three/examples/js/controls/PointerLockControls';

import statsJs from 'stats.js';

import Terrain from './World/Terrain';

const stats = new statsJs();
stats.showPanel(0);
stats.showPanel(2);
document.body.appendChild(stats.dom);

const element = document.body;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, Terrain.VIEW_DISTANCE);
const renderer = new THREE.WebGLRenderer({ antialias: true });

// setup
renderer.setClearColor(0x000000);
renderer.domElement.id = 'main';
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
});

element.appendChild(renderer.domElement);

// movement
const controls = new THREE.PointerLockControls(camera);
controls.getObject().position.set(0, 250, 0);
const velocity = new THREE.Vector3();
const speed = 5000.0;

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let moveUp = false;
let moveDown = false;

const pointerLockAvailable = 'pointerLockElement' in document ||
  'mozPointerLockElement' in document ||
  'webkitPointerLockElement' in document;

if (pointerLockAvailable) {
  // handle pointer lock authorization
  const pointerlockchange = (e) => {
    if (document.pointerLockElement === element ||
      document.mozPointerLockElement === element ||
      document.webkitPointerLockElement === element) {
      controls.enabled = true;
    } else {
      controls.enabled = false;
    }
  };

  const pointerlockerror = (e) => {};

  document.addEventListener('pointerlockchange', pointerlockchange, false);
  document.addEventListener('mozpointerlockchange', pointerlockchange, false);
  document.addEventListener('webkitpointerlockchange', pointerlockchange, false);
  document.addEventListener('pointerlockerror', pointerlockerror, false);
  document.addEventListener('mozpointerlockerror', pointerlockerror, false);
  document.addEventListener('webkitpointerlockerror', pointerlockerror, false);

  element.addEventListener('click', () => {
    element.requestPointerLock = element.requestPointerLock ||
      element.mozRequestPointerLock ||
      element.webkitRequestPointerLock;

    element.requestPointerLock();
  });

  // handle keyboard inputs
  const handleKeyboard = (key : string, active : bool) => {
    switch (key) {
      case 'z': moveForward = active && controls.enabled; break;
      case 's': moveBackward = active && controls.enabled; break;
      case 'q': moveLeft = active && controls.enabled; break;
      case 'd': moveRight = active && controls.enabled; break;
      case 'a': moveUp = active && controls.enabled; break;
      case 'e': moveDown = active && controls.enabled; break;
    }
  };

  window.addEventListener('keydown', e => handleKeyboard(e.key, true));
  window.addEventListener('keyup', e => handleKeyboard(e.key, false));
}

// scene
scene.add(controls.getObject());

scene.fog = new THREE.Fog(0x000000, 400, Terrain.VIEW_DISTANCE);

const light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 0.35);
light.position.set(0, 1000, 0);
scene.add(light);

const sunlight = new THREE.DirectionalLight(0xffffff, 0.35);
sunlight.position.set(0, 1000, 5);
scene.add(sunlight);

const gizmo = new THREE.AxesHelper();
gizmo.position.set(0, 0, 0);
gizmo.scale.set(1, 1, 1);
scene.add(gizmo);

const terrain = new Terrain({
  octaves: 6,
  persistence: 0.5,
  scale: 0.0004,
  low: -100,
  high: 500,
  lacunarity: 1.87
});

const frustum = new THREE.Frustum();

let prevTime = window.performance.now();

// loop
const run = () => {
  stats.begin();

  const time = window.performance.now();
  const delta = (time - prevTime) / 1000;

  if (controls.enabled) {
    velocity.x -= velocity.x * 10.0 * delta;
    velocity.y -= velocity.y * 10.0 * delta;
    velocity.z -= velocity.z * 10.0 * delta;

    if (moveForward) velocity.z -= speed * delta;
    if (moveBackward) velocity.z += speed * delta;
    if (moveUp) velocity.y -= speed * delta;
    if (moveDown) velocity.y += speed * delta;
    if (moveLeft) velocity.x -= speed * delta;
    if (moveRight) velocity.x += speed * delta;

    controls.getObject().translateX(velocity.x * delta);
    controls.getObject().translateY(velocity.y * delta);
    controls.getObject().translateZ(velocity.z * delta);
  }

  frustum.setFromMatrix(new THREE.Matrix4().multiplyMatrices(
    camera.projectionMatrix,
    camera.matrixWorldInverse)
  );

  terrain.update(scene, frustum, controls.getObject().position);

  prevTime = time;

  renderer.render(scene, camera);
  stats.end();

  window.requestAnimationFrame(run);
};

run();
