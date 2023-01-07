import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { infosPlanets } from './data';

console.log(infosPlanets);
let idIntervalMsgInfosPlanets = 0;
let idTimeOut = 0;
let currentIndex = 0;

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

import sunImg from './assets/img/sm_moon.png';
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

const cardBottomInfo = document.querySelector('.card-bottom__info');
const cardBottomDescription = document.querySelector(
  '.card-bottom__description'
);
let scene, camera, renderer, controls, textureLoader, texture, mouse, raycaster;
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
const cardEl = document.querySelector('.card');
const btnCloseCardEl = document.querySelector('.btn-close-card');

mouse = new THREE.Vector2();
raycaster = new THREE.Raycaster();

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
  // Création OrbitControls avec camera + renderer
  controls = new OrbitControls(camera, renderer.domElement);
  // Activation l'amortissement de la rotation + réglage la vitesse
  controls.enableDamping = true;
  // controls.damping = 0.4;
  controls.dampingFactor = 0.5;

  // Définition des paramètres vitesse - rotation - zoom - pan
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

  // creation d'un objet textureLoader
  const textureLoader = new THREE.TextureLoader();

  // chargement image de fond en tant que texture
  texture = textureLoader.load(starsTexture);
  scene.background = texture;
  // creation d'un matériau à partir de la texture
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.DoubleSide,
  });

  const geometry = new THREE.SphereGeometry(7500, 32, 32);
  const mesh = new THREE.Mesh(geometry, material);
  // inversion des faces du maillage pour qu'elles soient visibles de l'intérieur
  mesh.scale.x = -1;

  // ajout de l'objet Mesh background à la scène
  scene.add(mesh);
};

const randPosition = (position) => {
  let randAngle = Math.random() * Math.PI * 2;
  let positionX = Math.cos(randAngle) * position;
  let positionY = Math.sin(randAngle) * position;

  return { x: positionX, z: positionY };
};

const createPlanete = (
  size,
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
  mesh.name = texture.split('/')[3]?.slice(0, -4);
  // console.log(mesh.name);
  // console.log(coord, mesh.name);
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

const initScene = () => {
  // créez un objet textureLoader
  const textureLoader = new THREE.TextureLoader();
  sun = createPlanete(16, sunTexture, 0, false, true);
  mercury = createPlanete(2.6, mercuryTexture, 28);
  venus = createPlanete(5.3, venusTexture, 44);
  earth = createPlanete(6, earthTexture, 78);

  cloud = new THREE.Mesh(
    new THREE.SphereGeometry(6.1, 32, 32),
    new THREE.MeshPhongMaterial({
      map: textureLoader.load(cloudTexture),
      transparent: true,
    })
  );
  earth.mesh.add(cloud);

  moon = createPlanete(1.2, moonTexture, 11);
  earth.mesh.add(moon.mesh);
  mars = createPlanete(3.2, marsTexture, 118);
  jupiter = createPlanete(11, jupiterTexture, 150);
  saturn = createPlanete(9, saturnTexture, 198, {
    innerRadius: 12.2,
    outerRadius: 21,
    texture: saturnRingTexture,
  });
  uranus = createPlanete(8, uranusTexture, 262, {
    innerRadius: 9.5,
    outerRadius: 12,
    texture: uranusRingTexture,
  });
  neptune = createPlanete(7, neptuneTexture, 310);
  pluto = createPlanete(3, plutoTexture, 334);

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
  // console.log(scene.children);
  let planets = scene.children.filter(
    (el) =>
      // el.type == 'Object3D' &&
      el.children.length > 0 && el.children[0].name != ''
  );
  // console.log(planets[9].children[0].name);
  // console.log(planets);
}

renderer.setAnimationLoop(animate);

const getPlaneteSelected = () => {
  let planetSelected;
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children);

  for (let i = 0; i < intersects.length; i++) {
    // const element = array[i];
    console.log(intersects[i].object.name);
    if (intersects[i].object.name.length > 0) {
      planetSelected = intersects[i].object.name;

      // case sun selected and card already displayed => return
      if (planetSelected == 'sun' && cardEl.classList.contains('active'))
        return;
      handleDisplayCard(planetSelected);
      return;
    }
  }

  // planetSelected = intersects.filter((el) => {
  //   el.object.name.length > 0;
  //   console.log(el.object.name.length > 0);
  // });
  console.log('selected >>>', intersects);
  console.log('planet selected >>>', planetSelected);
};

const handleDisplayCard = (planetSelected) => {
  const cardHeaderTitleEl = document.querySelector('.card-top__header-title');

  // reset infos of the bottom card
  [cardBottomInfo, cardBottomDescription].forEach(
    (el) => (el.textContent = '')
  );

  // display card
  cardEl.classList.add('active');

  // display planet png according planet selected
  const cardTopImgPlanetEl = document.querySelector('.card-top__img');

  cardTopImgPlanetEl.src = `./assets/img/sm_${planetSelected}.png`;

  cardTopImgPlanetEl.classList.remove('active');
  setTimeout(() => {
    cardTopImgPlanetEl.classList.add('active');
  }, 300);

  // change title of card
  cardHeaderTitleEl.classList.remove('active');
  [cardBottomInfo, cardBottomDescription].forEach((el) =>
    el.classList.remove('active')
  );
  handleInfosPlanets(planetSelected, currentIndex);

  setTimeout(() => {
    cardHeaderTitleEl.innerText = planetSelected;
    cardHeaderTitleEl.classList.add('active');
  }, 300);

  // handle infos of planet selected: label + info
};

const handleInfosPlanets = (planetSelected, currentIndex) => {
  // reset index + clear previous interval
  currentIndex = 0;
  clearInterval(idIntervalMsgInfosPlanets);
  clearTimeout(idTimeOut);

  // Get data according to the planet selected
  // const infos = infosPlanets;
  let dataPlanetSelected;
  for (const planet in infosPlanets) {
    if (planet == planetSelected) {
      dataPlanetSelected = infosPlanets[planet];
      console.log('///', dataPlanetSelected.size);
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
    [cardBottomInfo, cardBottomDescription].forEach((el) =>
      el.classList.remove('inactive')
    );
    // cardBottomInfo.textContent = infosPlanets.items[currentIndex];
    cardBottomInfo.textContent = labels[currentIndex];
    cardBottomDescription.textContent =
      dataPlanetSelected[keysInfo[currentIndex]];
    // currentIndex = (currentIndex + 1) % infosPlanets.items.length;
    currentIndex = currentIndex > 3 ? 0 : currentIndex + 1;
    idTimeOut = setTimeout(() => {
      [cardBottomInfo, cardBottomDescription].forEach((el) =>
        el.classList.remove('active')
      );
      [cardBottomInfo, cardBottomDescription].forEach((el) =>
        el.classList.add('inactive')
      );
    }, 2300);
  }, 2600);
};

const onPointerClick = (e) => {
  // calculate pointer position in normalized device coordinates
  // (-1 to +1) for both components

  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  console.log(mouse.x, mouse.y);
  getPlaneteSelected();
};

const handleCloseCard = () => {
  const cardEl = document.querySelector('.card');
  cardEl.classList.remove('active');
  clearInterval(idIntervalMsgInfosPlanets);
  clearTimeout(idTimeOut);
};

// handle close card when btn close clicked
btnCloseCardEl.addEventListener('click', handleCloseCard);

// pointer raycaster
window.addEventListener('click', onPointerClick, false);

// Resize Canvas
window.addEventListener('resize', () => {
  // remove card
  const cardEl = document.querySelector('.card');
  cardEl.classList.remove('active');

  console.log([window.innerWidth, window.innerHeight]);
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.render(scene, camera);
});
