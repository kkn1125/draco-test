import * as THREE from "three";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import { TextureLoader } from "three/examples/jsm/loaders/TextureLoader";
// console.log(THREE);

// three.js globals.
var camera, scene, renderer;

// Create the Draco loader.
var dracoLoader = new DRACOLoader();

// Specify path to a folder containing WASM/JS decoding libraries.
// It is recommended to always pull your Draco JavaScript and WASM decoders
// from the below URL. Users will benefit from having the Draco decoder in
// cache as more sites start using the static URL.
dracoLoader.setDecoderPath(
  "https://www.gstatic.com/draco/versioned/decoders/1.5.5/"
);

// load WATER texture
var bumpTexture = new THREE.TextureLoader().load("./textures/map.png");
bumpTexture.wrapS = bumpTexture.wrapT = THREE.RepeatWrapping;

var grassTexture = new THREE.TextureLoader().load("./textures/grass-512.jpg");
grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;

const customUniforms = {
  bumpTexture: { type: "t", value: bumpTexture },
  bumpScale: { type: "f", value: bumpScale },
  grassTexture: { type: "t", value: grassTexture },
  grass2Texture: { type: "t", value: grassTexture },
};

var bumpScale = 2000.0;

let controls = null;

function initThreejs() {
  camera = new THREE.PerspectiveCamera(
    35,
    window.innerWidth / window.innerHeight,
    0.1,
    3000
  );
  camera.position.set(1, 1, 1);
  camera.lookAt(new THREE.Vector3(0, 0.1, 0));

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x443333);
  scene.fog = new THREE.Fog(0x443333, 1, 4);

  /* shader */
  var customMaterial = new THREE.ShaderMaterial({
    uniforms: customUniforms,
    vertexShader: document.getElementById("vertexShader").textContent,
    fragmentShader: document.getElementById("fragmentShader").textContent,
  });

  // Ground
  // var plane = new THREE.Mesh(
  //   new THREE.PlaneBufferGeometry(8, 8),
  //   new THREE.MeshPhongMaterial({ color: 0x999999, specular: 0x101010 })
  // );
  let planeGeo = new THREE.PlaneGeometry(1000, 1000, 100, 100);
  let plane = new THREE.Mesh(planeGeo, customMaterial);
  plane.rotation.x = -Math.PI / 2;
  plane.position.y = 0.03;
  plane.receiveShadow = true;
  scene.add(plane);

  // Lights
  var light = new THREE.HemisphereLight(0x443333, 0x111122);
  scene.add(light);

  var light = new THREE.SpotLight();
  light.angle = Math.PI / 16;
  light.penumbra = 0.5;
  light.castShadow = true;
  light.position.set(-1, 1, 1);
  scene.add(light);

  // renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;

  controls = new OrbitControls(camera, renderer.domElement);
  controls.update();

  const container = document.getElementById("container");
  container.appendChild(renderer.domElement);

  window.addEventListener("resize", onWindowResize, false);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  render();
  controls.update();

  requestAnimationFrame(animate);
}

function render() {
  var timer = Date.now() * 0.0003;

  // camera.position.x = Math.sin(timer) * 0.5;
  // camera.position.z = Math.cos(timer) * 0.5;
  // camera.lookAt(new THREE.Vector3(0, 0.1, 0));

  renderer.render(scene, camera);
}

function loadDracoMesh(dracoFile) {
  dracoLoader.load(dracoFile, function (geometry) {
    geometry.computeVertexNormals();

    var material = new THREE.MeshStandardMaterial({
      vertexColors: THREE.VertexColors,
    });
    var mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);
  });
}

window.onload = function () {
  initThreejs();
  animate();
  loadDracoMesh("bunny.drc");
};
