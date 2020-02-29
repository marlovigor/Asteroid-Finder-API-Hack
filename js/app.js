console.log("app.js loaded...");

let renderer, camera, scene, sphere, clouds, controls;
const width = window.innerWidth;
const height = window.innerHeight;
const container = $('#container')
// calls the init function
init();

// begins the scene and calls each create function
function init() {
  scene = new THREE.Scene();
  createCamera();
  createLight();
  createEarth();
  createClouds();
  createUniverse();
  createRenderer();
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableKeys = true;
  controls.keys = {
    LEFT: 65, //A button
    UP: 87, // W button
    RIGHT: 68, // D button
    BOTTOM: 83, // down arrow
  };
}
// establishs camera angle and perspective 
function createCamera() {
  const fieldOfView = 45;
  const aspect = width / height;
  const near = 0.01;
  const far = 1000;
  camera = new THREE.PerspectiveCamera(fieldOfView, aspect, near, far);
  camera.position.set(0, 0, 20); // x | y | z
  scene.add(camera);
}

// add ambient and directional light
// ambient light: basic global (literally) light
// directional light: light designed to look like light from the sun.
function createLight() {
  const ambientLight = new THREE.AmbientLight(0x333333);
  const directionalLight = new THREE.DirectionalLight(0xeeeeee, 1);
  directionalLight.position.set(5, 3, 5); // x | y | z
  scene.add(ambientLight);
  scene.add(directionalLight);
}

// create model of Earth using sphere geometry and material (or mesh)
function createEarth() {
  const geometry = new THREE.SphereGeometry(5, 32, 32);
  const map = new THREE.TextureLoader().load("images/earth_no_clouds.jpg");
  const bumpMap = new THREE.TextureLoader().load("images/earth_elevation.jpg");
  const specularMap = new THREE.TextureLoader().load("images/earth_water.png");
  const material = new THREE.MeshPhongMaterial({
    map: map,
    bumpMap: bumpMap,
    bumpScale: 0.005,
    specularMap: specularMap,
    specular: new THREE.Color("grey"),
  });
  sphere = new THREE.Mesh(geometry, material);
  scene.add(sphere);
}

// creates a sphere of clouds that is slightly larger than the earth, giving the illusion of depth
function createClouds() {
  const geometry = new THREE.SphereGeometry(5.03, 32, 32);
  const map = new THREE.TextureLoader().load("/images/clouds_earth.png");
  const material = new THREE.MeshPhongMaterial({
    map: map,
    transparent: true,
    depthWrite: false,
    opacity: 0.8,
  });
  clouds = new THREE.Mesh(geometry, material);
  scene.add(clouds);
}

// creates a larger sphere to house the universe
function createUniverse() {
  const geometry = new THREE.SphereGeometry(90, 64, 64);
  const map = new THREE.TextureLoader().load("/images/universe.png");
  const material = new THREE.MeshBasicMaterial({
    map: map,
    side: THREE.BackSide,
  });
  const universe = new THREE.Mesh(geometry, material)
  scene.add(universe)
}

// establishes the renderer and pushes it to the DOM
function createRenderer() {
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(width, height);
  container.append(renderer.domElement)
}

// makes sure to dynamically resize the window if a user changes the size of their window
function onWindowResize() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

// add event listener to resize renderer when browser window changes
window.addEventListener("resize", onWindowResize);

// this is where the animations will go, right now the earth and clouds are slowly rotating on the y axis
function update() {
  sphere.rotation.y += 0.0005;
  clouds.rotation.y += 0.0003;
}
// renders the scene and camera
function render() {
  controls.update();
  renderer.render(scene, camera);
}
// IFFE that starts an infinite game loop
(function animate() {
  requestAnimationFrame(animate);
  update();
  render();
})();
