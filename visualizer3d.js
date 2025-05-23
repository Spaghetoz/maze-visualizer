import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const div = "canva-parent";
const container = document.getElementById(div);

let width = container.clientWidth;
let height = container.clientHeight;

/** scene: where all Object3d are placed */
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x22223B);
/** camera: the POV camera */
const camera = new THREE.PerspectiveCamera(75, width / height);
/** renderer: draw all camera and scene onto the screen */
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(width, height);
/** movement */
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// function that find correct geometry / material by its grid number
function finder(x) {
    switch (x) {
        // visited
        case 1: return {
            geometry: new THREE.SphereGeometry(0.7, 32, 32), 
            material: new THREE.MeshStandardMaterial({color: 0xff0000})
        };
        // start
        case 2: return {
            geometry: new THREE.SphereGeometry(0.6, 32, 32), 
            material: new THREE.MeshStandardMaterial({color: 0xff0000})
        };
        // end
        case 3: return {
            geometry: new THREE.TorusGeometry(0.5, 0.2, 16, 100), 
            material: new THREE.MeshStandardMaterial({color: 0xffff00})
        };
        // path
        case 4: return {
            geometry: new THREE.CylinderGeometry(0.5, 0.5, 1, 32), 
            material: new THREE.MeshStandardMaterial({color: 0x0000ff})
        };
        // wall
        case 5: return {
            geometry: new THREE.BoxGeometry(1, 1, 1),
            material: new THREE.MeshNormalMaterial()

            // sonic
            // geometry: new THREE.TorusGeometry(0.5, 0.2, 16, 100), 
            // material: new THREE.MeshStandardMaterial({color: 0xffff00})
        };
        default: return null;
    }
};

function drawMap() {
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(10, 20, 10);
    light.castShadow = true;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;
    light.shadow.camera.near = 0.5;
    light.shadow.camera.far = 50;
    light.shadow.camera.left = -20;
    light.shadow.camera.right = 20;
    light.shadow.camera.top = 20;
    light.shadow.camera.bottom = -20;
    scene.add(light);

    const geometry = new THREE.BoxGeometry(grid.cols, 1, grid.rows);
    const material = new THREE.MeshNormalMaterial();
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 0, 0);
    scene.add(mesh);
}

let end = null;

function drawElement() {
    const offsetX = -grid.cols / 2 + 0.5;
    const offsetZ = -grid.rows / 2 + 0.5;

    for (let i = 0; i < grid.rows; i++) {
        for (let j = 0; j < grid.cols; j++) {
            const element = grid.get(i, j);
            const result = finder(element);
            
            if (!result) continue;

            const { geometry, material } = result;
            const mesh = new THREE.Mesh(geometry, material);
            if (element === 3) end = mesh;
            mesh.position.set(j + offsetX, 1, i + offsetZ)
            scene.add(mesh);
        }
    }
}

function setup() {
    camera.position.set(0, 10, grid.rows * 1.1);
    camera.lookAt(0, 0, 0); 
    controls.target.set(0, 0, 0);
}

// Activate/Deactive 3d canvas
const button = document.getElementById("3dActivate");

let isVisible  = false;

button.addEventListener("click", () => {
    const p5Canvas = container.querySelector("canvas.p5Canvas");
    
    if (!isVisible) {
        p5Canvas.style.display = "none";
        renderer.domElement.style.display = "block";
        find_grid();
        button.textContent = "Deactivate 3D";
    } else {
        p5Canvas.style.display = "block";
        scene.clear();
        renderer.domElement.style.display = "none";
        button.textContent = "Activate 3D";
    }
    
    isVisible = !isVisible;
});

container.appendChild(renderer.domElement);
renderer.domElement.style.display = 'none';

// Resize window
window.addEventListener('resize', () => {
    width = container.clientWidth;
    height = container.clientHeight;
    
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    
    renderer.setSize(width, height);
});

function find_grid() {
    if (grid) {
        drawMap();
        drawElement()
        setup();
    } else {
        requestAnimationFrame(find_grid);
    }
}
// loop function
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    if(end) end.rotation.y += 0.05;
    renderer.render(scene, camera);
};

animate();