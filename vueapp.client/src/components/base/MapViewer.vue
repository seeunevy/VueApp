<script setup>
import { useDraw } from "@/composables/useDraw";
import { onMounted, onBeforeUnmount, ref } from "vue";
import * as THREE from "three";

const canvas = ref(null);
let camera, scene, renderer;

let isMouseDown = false;
let previousMousePosition = { x: 0, y: 0 };
let mouseDelta = { x: 0, y: 0 };

// 🏭 공장 크기 설정 (80m x 40m)
const factoryWidth = 80000;
const factoryHeight = 40000;
const offsetX = 0;
const offsetY = 0;

const layoutWidth = factoryWidth + offsetX;
const layoutHeight = factoryHeight + offsetY;

let resizeObserver;

onMounted(() => {
  init();
  setupResizeObserver();
  setupZoom();
  setupMove();
});

onBeforeUnmount(() => {
  if (renderer) {
    renderer.dispose();
  }
  if (resizeObserver) {
    resizeObserver.disconnect();
  }
});

function setupResizeObserver() {
  const container = document.querySelector(".three-container");

  // Container 크기 변경 감시 설정
  resizeObserver = new ResizeObserver(() => {
    onWindowResize();
  });
  resizeObserver.observe(container);
}

function init() {
  const container = canvas.value;
  if (!container) return;

  let windowWidth = 0;
  let windowHeight = 0;

  const thContainer = document.querySelector(".three-container");
  if (thContainer !== null) {
    windowWidth = thContainer.clientWidth;
    windowHeight = thContainer.clientHeight;
  } else {
    return;
  }

  const aspect = windowWidth / windowHeight;
  const layoutAspect = layoutWidth / layoutHeight;

  let frustumSize;
  if (layoutAspect > aspect) {
    frustumSize = layoutWidth / aspect;
  } else {
    frustumSize = layoutHeight;
  }

  // 📷 카메라 설정
  camera = new THREE.OrthographicCamera(
    (-frustumSize / 2) * aspect,
    (frustumSize / 2) * aspect,
    frustumSize / 2,
    -frustumSize / 2,
    100,
    100000,
  );

  // 🎥 카메라 위치 조정
  const cameraHeight = frustumSize / 2;
  camera.position.set(layoutWidth / 2, cameraHeight, -layoutHeight / 2);
  camera.lookAt(layoutWidth / 2, 0, -layoutHeight / 2);

  const root = document.documentElement;
  const backgroundColor = getComputedStyle(root).getPropertyValue("--light-color");
  const layoutColor = getComputedStyle(root).getPropertyValue("--white-color");

  scene = new THREE.Scene();
  scene.background = new THREE.Color(backgroundColor);

  useDraw(scene);

  // 조명 추가
  const light = new THREE.DirectionalLight(0xffffff, 5.4);
  light.position.set(1, 1, 1).normalize();
  scene.add(light);

  // 레이아웃 바닥 추가
  const factoryFloor = new THREE.Mesh(
    new THREE.PlaneGeometry(factoryWidth, factoryHeight),
    new THREE.MeshLambertMaterial({ color: backgroundColor, side: THREE.DoubleSide }),
  );
  factoryFloor.rotation.x = -Math.PI / 2;
  factoryFloor.position.set(offsetX + factoryWidth / 2, 0, -offsetY + -factoryHeight / 2);
  scene.add(factoryFloor);

  //// 예시 (빨간색 박스)
  //const machine = new THREE.Mesh(
  //  new THREE.BoxGeometry(150, 2000, 2000),
  //  new THREE.MeshLambertMaterial({ color: 0xff0000 })
  //);
  //machine.position.set(offsetX, 0, offsetY * -1);
  //scene.add(machine);

  // 원점 그리기 => 수평, 수직 막대 추가
  // 📌 renderOrder : 렌더링 순서를 설정 (작을 수록 먼저 렌더링)
  const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const crossShape = new THREE.Group();

  const horizontalGeometry = new THREE.BoxGeometry(50, 2000, 2000);
  const horizontalBar = new THREE.Mesh(horizontalGeometry, material);
  horizontalBar.renderOrder = 99;
  crossShape.add(horizontalBar);

  const verticalGeometry = new THREE.BoxGeometry(2000, 2000, 50);
  const verticalBar = new THREE.Mesh(verticalGeometry, material);
  horizontalBar.renderOrder = 99;
  crossShape.add(verticalBar);

  crossShape.position.set(offsetX, 0, offsetY * -1);
  scene.add(crossShape);

  if (renderer) {
    renderer.dispose();
    container.innerHTML = "";
  }

  // 렌더러 설정
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(windowWidth, windowHeight);
  renderer.setAnimationLoop(animate);
  container.appendChild(renderer.domElement);

  window.addEventListener("resize", onWindowResize);
}

function setupZoom() {
  // 줌의 최소, 최대 비율 설정
  const minZoom = 0.8;
  const maxZoom = 5;

  const thContainer = document.querySelector(".three-container");

  // 마우스 휠로 줌 설정
  thContainer.addEventListener("wheel", (event) => {
    event.preventDefault();

    const zoomSpeed = 1.1;
    if (event.deltaY < 0) {
      camera.zoom *= zoomSpeed; // ➕ Zoom In
    } else {
      camera.zoom /= zoomSpeed; // ➖ Zoom Out
    }

    // 줌 범위 제한
    if (camera.zoom < minZoom) {
      camera.zoom = minZoom;
    }
    if (camera.zoom > maxZoom) {
      camera.zoom = maxZoom;
    }

    camera.updateProjectionMatrix();
  });
}

function setupMove() {
  const thContainer = document.querySelector(".three-container");

  // 이동의 최소/최대 범위 설정 (예시로 80,000 x 40,000 크기의 공장에 맞춰 설정)
  const minX = 0;
  const maxX = factoryWidth;
  const minZ = -factoryHeight; // Y축을 세로로 변경
  const maxZ = 0; // 세로 범위

  let isMouseDown = false;
  let startMouseX = 0;
  let startMouseY = 0;
  let startCameraX = 0;
  let startCameraZ = 0; // 세로 이동을 위해 z값 저장

  // 이동 속도 조절 비율
  const scaleFactor = 30; // 값을 높이면 더 빠르게 이동

  // 마우스 다운 이벤트 (드래그 시작)
  thContainer.addEventListener("mousedown", (event) => {
    isMouseDown = true;
    startMouseX = event.clientX;
    startMouseY = event.clientY;
    startCameraX = camera.position.x;
    startCameraZ = camera.position.z; // 세로 이동 시작점 저장
  });

  // 마우스 이동 이벤트 (드래그 중)
  thContainer.addEventListener("mousemove", (event) => {
    if (!isMouseDown) return;

    const dx = event.clientX - startMouseX;
    const dy = event.clientY - startMouseY;

    // 카메라 이동
    camera.position.x = startCameraX - dx * scaleFactor;
    camera.position.z = startCameraZ + dy * scaleFactor * -1;

    // 이동 범위 제한
    if (camera.position.x < minX) {
      camera.position.x = minX;
    }
    if (camera.position.x > maxX) {
      camera.position.x = maxX;
    }
    if (camera.position.z < minZ) {
      camera.position.z = minZ;
    }
    if (camera.position.z > maxZ) {
      camera.position.z = maxZ;
    }
  });

  // 마우스 업 이벤트 (드래그 종료)
  thContainer.addEventListener("mouseup", () => {
    isMouseDown = false;
  });

  // 마우스 아웃 이벤트 (드래그 종료)
  thContainer.addEventListener("mouseleave", () => {
    isMouseDown = false;
  });
}

function onWindowResize() {
  let windowWidth = 0;
  let windowHeight = 0;

  const thContainer = document.querySelector(".three-container");
  if (thContainer !== null) {
    windowWidth = thContainer.clientWidth;
    windowHeight = thContainer.clientHeight - 10; // 세로 스크롤바 생겨서 그냥 -10 함 (해결불가)
  } else {
    return;
  }

  const aspect = windowWidth / windowHeight;
  const layoutAspect = layoutWidth / layoutHeight;

  let frustumSize;
  if (layoutAspect > aspect) {
    frustumSize = layoutWidth / aspect;
  } else {
    frustumSize = layoutHeight;
  }

  // 카메라 업데이트
  camera.left = (-frustumSize / 2) * aspect;
  camera.right = (frustumSize / 2) * aspect;
  camera.top = frustumSize / 2;
  camera.bottom = -frustumSize / 2;
  camera.updateProjectionMatrix();

  renderer.setSize(windowWidth, windowHeight);
}

function animate() {
  render();
}

function render() {
  renderer.render(scene, camera);
}
</script>

<template>
  <div ref="canvas" class="three-container"></div>
</template>

<style scoped>
.three-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;
}
</style>
