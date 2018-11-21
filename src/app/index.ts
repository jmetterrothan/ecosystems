import * as THREE from 'three';
import 'three/examples/js/controls/PointerLockControls';

const element = document.body;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

// setup
renderer.setClearColor(0x000000);
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
const velocity = new THREE.Vector3();
const speed = 200.0;

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;

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
    }
  };

  window.addEventListener('keydown', e => handleKeyboard(e.key, true));
  window.addEventListener('keyup', e => handleKeyboard(e.key, false));
}

// scene
scene.add(controls.getObject());

scene.fog = new THREE.Fog(0xffffff, 0, 750);

const light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 0.75);
light.position.set(0, 0, 0);
scene.add(light);

const gizmo = new THREE.AxesHelper();
gizmo.position.set(0, 0, 0);
gizmo.scale.set(1, 1, 1);
scene.add(gizmo);

let prevTime = window.performance.now();

// loop
const run = () => {
  const time = window.performance.now();
  const delta = (time - prevTime) / 1000;

  velocity.x -= velocity.x * 10.0 * delta;
  velocity.z -= velocity.z * 10.0 * delta;

  if (moveForward) velocity.z -= speed * delta;
  if (moveBackward) velocity.z += speed * delta;
  if (moveLeft) velocity.x -= speed * delta;
  if (moveRight) velocity.x += speed * delta;

  controls.getObject().translateX(velocity.x * delta);
  controls.getObject().translateY(velocity.y * delta);
  controls.getObject().translateZ(velocity.z * delta);

  prevTime = time;

  renderer.render(scene, camera);
  window.requestAnimationFrame(run);
};

run();
