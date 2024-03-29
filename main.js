import * as THREE from '/node_modules/three';
import { OrbitControls } from '/node_modules/three/examples/jsm/controls/OrbitControls.js';
import { infosPlanets } from './data';

import starsTexture from './assets/img/space-stars.jpg';
import sunTexture from './assets/img/sun.jpg';
import mercuryTexture from './assets/img/mercury.jpg';
import venusTexture from './assets/img/venus.jpg';
import earthTexture from './assets/img/earth.jpg';
import cloudTexture from './assets/img/fair_clouds.png';
import moonTexture from './assets/img/moon.jpg';
import marsTexture from './assets/img/mars.jpg';
import jupiterTexture from './assets/img/jupiter.jpg';
import saturnTexture from './assets/img/saturn.jpg';
import saturnRingTexture from './assets/img/saturn-ring.png';
import uranusTexture from './assets/img/uranus.jpg';
import uranusRingTexture from './assets/img/uranus-ring.png';
import neptuneTexture from './assets/img/neptune.jpg';
import plutoTexture from './assets/img/pluto.jpg';

import sunImg from './assets/img/sm_sun.png';
import mercuryImg from './assets/img/sm_mercury.png';
import venusImg from './assets/img/sm_venus.png';
import earthImg from './assets/img/sm_earth.png';
import moonImg from './assets/img/sm_moon.png';
import marsImg from './assets/img/sm_mars.png';
import jupiterImg from './assets/img/sm_jupiter.png';
import saturnImg from './assets/img/sm_saturn.png';
import uranusImg from './assets/img/sm_uranus.png';
import neptuneImg from './assets/img/sm_neptune.png';
import plutoImg from './assets/img/sm_pluto.png';
const pathImg = {
  sunImg,
  mercuryImg,
  venusImg,
  earthImg,
  moonImg,
  marsImg,
  jupiterImg,
  saturnImg,
  uranusImg,
  neptuneImg,
  plutoImg,
};
let currentIndex = 0;
let idIntervalMsgInfosPlanets = 0;
let timerSetActiveContentCard,
  timerSetActiveCard,
  timerSetActiveImg,
  timerSetActiveTitle;
let scene, camera, renderer, controls, texture;
let sun,
  mercury,
  venus,
  earth,
  cloud,
  moon,
  mars,
  jupiter,
  saturn,
  uranus,
  neptune,
  pluto;
let mouse = new THREE.Vector2();
let raycaster = new THREE.Raycaster();

const cardBottomInfo = document.querySelector('.card-bottom__info');
const cardBottomDescription = document.querySelector(
  '.card-bottom__description'
);
const cardEl = document.querySelector('.card');
const btnCloseCardEl = document.querySelector('.btn-close-card');

/** Handle loader **/

const containerProgressBar = document.querySelector('.container-progress-bar');
const progressBarValue = document.getElementById('progress-bar-value');

const progressBar = document.getElementById('progress-bar');

THREE.DefaultLoadingManager.onProgress = function (
  url,
  itemsLoaded,
  itemsTotal
) {
  progressBar.value = (itemsLoaded / itemsTotal) * 100;
  progressBarValue.textContent = Math.floor(progressBar.value) + '%';
};

THREE.DefaultLoadingManager.onLoad = function () {
  containerProgressBar.style.display = 'none';
};

THREE.DefaultLoadingManager.onError = function (url) {
  console.log('There was an error loading ' + url);
};

/** Init scene + orbitcontrols **/
const init = () => {
  renderer = new THREE.WebGLRenderer({
    antialias: true,
  });

  renderer.setSize(window.innerWidth, window.innerHeight);

  document.body.appendChild(renderer.domElement);

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    8000
  );
  // Creation OrbitControls with camera + renderer
  controls = new OrbitControls(camera, renderer.domElement);
  // Activation of damping (l'amortissement de la rotation + réglage la vitesse)
  controls.enableDamping = true;
  // controls.damping = 0.4;
  controls.dampingFactor = 0.5;

  // Definition of speed / rotation / zoom / pan parameters
  controls.autoRotate = true;
  controls.autoRotateSpeed = -0.069; // 30
  controls.rotateSpeed = 0.3;
  controls.zoomSpeed = 0.5;
  controls.minPolarAngle = 0.8;
  controls.maxPolarAngle = 2.4;
  controls.minDistance = 120;
  controls.maxDistance = 500;
  controls.enablePan = false;

  // Set camera position
  camera.position.set(90, 25, 110);

  // Ambient Light
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.85, 10);
  scene.add(ambientLight);

  // Creation of textureLoader
  const textureLoader = new THREE.TextureLoader();

  // Loading background texture
  texture = textureLoader.load(starsTexture);
  scene.background = texture;
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.DoubleSide,
  });

  const geometry = new THREE.SphereGeometry(7500, 32, 32);
  const mesh = new THREE.Mesh(geometry, material);
  // (inversion des faces du maillage pour qu'elles soient visibles de l'intérieur)
  mesh.scale.x = -1;

  scene.add(mesh);
};

/** Function used to generate random positions for all planets after reloading **/
const randPosition = (position) => {
  let randAngle = Math.random() * Math.PI * 2;
  let positionX = Math.cos(randAngle) * position;
  let positionY = Math.sin(randAngle) * position;

  return { x: positionX, z: positionY };
};

/** Function used to create a planet mesh + obj + ring if necessary**/
const createPlanete = (
  size,
  namePlanet,
  texture,
  position,
  ring = false,
  isSun = false
) => {
  let mat = {};
  let ringMesh = {};
  const textureLoader = new THREE.TextureLoader();

  const geo = new THREE.SphereGeometry(size, 36, 36);
  if (isSun) {
    mat = new THREE.MeshBasicMaterial({
      map: textureLoader.load(texture),
    });
  } else {
    mat = new THREE.MeshStandardMaterial({
      map: textureLoader.load(texture),
    });
  }
  const obj = new THREE.Object3D();
  const mesh = new THREE.Mesh(geo, mat);
  const coord = randPosition(position);
  mesh.position.x = coord.x;
  mesh.position.z = coord.z;
  // mesh.name = texture.split('/')[-1]?.slice(0, -4);
  mesh.name = namePlanet;
  obj.add(mesh);

  if (ring) {
    const ringGeo = new THREE.RingGeometry(
      ring.innerRadius,
      ring.outerRadius,
      50
    );
    const ringMat = new THREE.MeshStandardMaterial({
      map: textureLoader.load(ring.texture),
      side: THREE.DoubleSide,
      color: 0xffffff,
      transparent: true,
    });
    ringMesh = new THREE.Mesh(ringGeo, ringMat);
    obj.add(ringMesh);
    ringMesh.position.x = coord.x;
    ringMesh.position.z = coord.z;
    ringMesh.rotation.x = -Math.PI * 0.5;
  }

  scene.add(obj);

  return { mesh, obj, ringMesh };
};

/** Function which define all planets + cloud + light for the scene **/
const initScene = () => {
  sun = createPlanete(16, 'sun', sunTexture, 0, false, true);
  mercury = createPlanete(2.6, 'mercury', mercuryTexture, 28);
  venus = createPlanete(5.3, 'venus', venusTexture, 44);
  earth = createPlanete(6, 'earth', earthTexture, 78);

  const textureLoader = new THREE.TextureLoader();
  cloud = new THREE.Mesh(
    new THREE.SphereGeometry(6.1, 32, 32),
    new THREE.MeshPhongMaterial({
      map: textureLoader.load(cloudTexture),
      transparent: true,
    })
  );
  earth.mesh.add(cloud);

  moon = createPlanete(1.2, 'moon', moonTexture, 11);
  earth.mesh.add(moon.mesh);
  mars = createPlanete(3.2, 'mars', marsTexture, 118);
  jupiter = createPlanete(11, 'jupiter', jupiterTexture, 150);
  saturn = createPlanete(9, 'saturn', saturnTexture, 198, {
    innerRadius: 12.2,
    outerRadius: 21,
    texture: saturnRingTexture,
  });
  uranus = createPlanete(8, 'uranus', uranusTexture, 262, {
    innerRadius: 9.5,
    outerRadius: 12,
    texture: uranusRingTexture,
  });
  neptune = createPlanete(7, 'neptune', neptuneTexture, 310);
  pluto = createPlanete(3, 'pluto', plutoTexture, 334);

  // Point Light
  const pointLight = new THREE.PointLight(0xffffff, 1.4, 600);
  scene.add(pointLight);
};

// init
init();
initScene();

// Animation
function animate() {
  // Self Rotation
  sun.mesh.rotateY(0.002);
  mercury.mesh.rotateY(0.006);
  venus.mesh.rotateY(0.006);
  earth.mesh.rotateY(0.01);
  cloud.rotateY(0.014);
  mars.mesh.rotateY(0.009);
  jupiter.mesh.rotateY(0.02);
  saturn.mesh.rotateY(0.019);
  uranus.mesh.rotateY(0.015);
  neptune.mesh.rotateY(0.016);
  pluto.mesh.rotateY(0.004);

  // Rotation around sun
  mercury.obj.rotateY(0.01);
  venus.obj.rotateY(0.0038);
  earth.obj.rotateY(0.0025);
  mars.obj.rotateY(0.002);
  jupiter.obj.rotateY(0.00045);
  saturn.obj.rotateY(0.00022);
  uranus.obj.rotateY(0.00021);
  neptune.obj.rotateY(0.00018);
  pluto.obj.rotateY(0.00014);

  // Rotation ring
  saturn.ringMesh.rotateZ(0.42);
  uranus.ringMesh.rotateZ(0.41);

  controls.update();
  renderer.render(scene, camera);
  let planets = scene.children.filter(
    (el) => el.children.length > 0 && el.children[0].name != ''
  );
}

renderer.setAnimationLoop(animate);

/** Function which return the planet selected with raycaster **/
const getPlaneteSelected = () => {
  let planetSelected;
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children);

  for (let i = 0; i < intersects.length; i++) {
    // console.log(intersects[i].object.name);
    if (intersects[i].object.name?.length > 0) {
      planetSelected = intersects[i].object.name;

      // Case sun selected and card already displayed => return
      if (planetSelected == 'sun' && cardEl.classList.contains('active'))
        return;
      handleDisplayCard(planetSelected);
      return;
    }
  }
};

/************************************************************* */
/** Function which handle the display of planet card (img + txt) **/
const handleDisplayCard = (planetSelected) => {
  const cardHeaderTitleEl = document.querySelector('.card-top__header-title');

  // Reset infos of the bottom card
  [cardBottomInfo, cardBottomDescription].forEach(
    (el) => (el.textContent = '')
  );

  // Display card
  cardEl.style.display = 'block';
  // Added timeout to preserve effect of opacity when card displayed
  timerSetActiveCard = setTimeout(() => {
    cardEl.classList.add('active');
  }, 20);

  // Display planet png according planet selected
  const cardTopImgPlanetEl = document.querySelector('.card-top__img');
  cardTopImgPlanetEl.src = `./assets/img/sm_${planetSelected}.png`;
  // cardTopImgPlanetEl.src = eval(planetSelected + 'Img');
  cardTopImgPlanetEl.src = pathImg[planetSelected + 'Img'];

  cardTopImgPlanetEl.classList.remove('active');
  timerSetActiveImg = setTimeout(() => {
    cardTopImgPlanetEl.classList.add('active');
  }, 300);

  // Change title of card
  cardHeaderTitleEl.classList.remove('active');
  [cardBottomInfo, cardBottomDescription].forEach((el) =>
    el.classList.remove('active')
  );
  handleInfosPlanets(planetSelected, currentIndex);

  timerSetActiveTitle = setTimeout(() => {
    cardHeaderTitleEl.innerText = planetSelected;
    cardHeaderTitleEl.classList.add('active');
  }, 450);
};

/** Function which handle information + description of planet selected for the planet card **/
const handleInfosPlanets = (planetSelected, currentIndex) => {
  // Reset index + clear previous interval
  currentIndex = 0;
  clearInterval(idIntervalMsgInfosPlanets);
  clearTimeout(timerSetActiveContentCard);

  // Get data according to the planet selected
  let dataPlanetSelected;
  for (const planet in infosPlanets) {
    if (planet == planetSelected) {
      dataPlanetSelected = infosPlanets[planet];
    }
  }
  const labels = [
    'Size (diameter)',
    'Distance of sun',
    'Length of year',
    'Length of day',
    'Temperature',
  ];
  const keysInfo = [
    'size',
    'distanceSun',
    'lengthYear',
    'lengthDay',
    'temperature',
  ];

  idIntervalMsgInfosPlanets = setInterval(() => {
    [cardBottomInfo, cardBottomDescription].forEach((el) =>
      el.classList.add('active')
    );
    // cardBottomInfo.textContent = infosPlanets.items[currentIndex];
    cardBottomInfo.textContent = labels[currentIndex];
    cardBottomDescription.textContent =
      dataPlanetSelected[keysInfo[currentIndex]];
    // currentIndex = (currentIndex + 1) % infosPlanets.items.length;
    currentIndex = currentIndex > 3 ? 0 : currentIndex + 1;
    timerSetActiveContentCard = setTimeout(() => {
      [cardBottomInfo, cardBottomDescription].forEach((el) =>
        el.classList.remove('active')
      );
    }, 2300);
  }, 2600);
};

// Calculate pointer position in normalized device coordinates
// (-1 to +1) for both components
const onPointerClick = (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  getPlaneteSelected();
};

const handleCloseCard = () => {
  const cardEl = document.querySelector('.card');
  cardEl.classList.remove('active');

  setTimeout(() => {
    cardEl.style.display = 'none';
  }, 500);

  // Reset timeout + interval in case close card activated
  clearTimeout(timerSetActiveCard);
  clearTimeout(timerSetActiveTitle);
  clearTimeout(timerSetActiveImg);
  clearTimeout(timerSetActiveContentCard);
  clearInterval(idIntervalMsgInfosPlanets);
};

// Handle close card when btn close clicked
btnCloseCardEl.addEventListener('click', handleCloseCard);

// Pointer raycaster
window.addEventListener('click', onPointerClick, false);

const handleResize = () => {
  // Remove card
  const cardEl = document.querySelector('.card');
  cardEl.classList.remove('active');

  // console.log(window.innerWidth, window.innerHeight);
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.render(scene, camera);
};

// Events listener
window.addEventListener('orientationchange', handleResize);
window.addEventListener('resize', handleResize);
