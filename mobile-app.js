// Mobile 3D Viewer
let scene, camera, renderer, card;
let isDragging = false;
let previousTouch = { x: 0, y: 0 };
let currentZoom = 1;

// Initialize Scene
function init() {
    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x121212);
    
    // Camera (closer for mobile)
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 3;
    
    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.getElementById('canvas-container').appendChild(renderer.domElement);
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 2);
    scene.add(directionalLight);
    
    // Load GPK Card
    loadCard();
    
    // Event Listeners
    setupTouchControls();
    
    // Handle Resize
    window.addEventListener('resize', onWindowResize);
    
    // Start Animation Loop
    animate();
}

// Load 3D Card Model
function loadCard() {
    const loader = new THREE.GLTFLoader();
    loader.load(
        'assets/models/gpk-card.glb',
        (gltf) => {
            card = gltf.scene;
            card.scale.set(0.8, 0.8, 0.8);
            scene.add(card);
        },
        undefined,
        (error) => {
            console.error('Error loading card:', error);
        }
    );
}

// Touch Controls
function setupTouchControls() {
    const canvas = renderer.domElement;
    
    // Rotate via touch drag
    canvas.addEventListener('touchstart', (e) => {
        isDragging = true;
        previousTouch = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
        };
        e.preventDefault();
    });
    
    canvas.addEventListener('touchmove', (e) => {
        if (!isDragging || !card) return;
        
        const deltaX = e.touches[0].clientX - previousTouch.x;
        const deltaY = e.touches[0].clientY - previousTouch.y;
        
        card.rotation.y += deltaX * 0.02;
        card.rotation.x += deltaY * 0.02;
        
        previousTouch = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
        };
        e.preventDefault();
    });
    
    canvas.addEventListener('touchend', () => {
        isDragging = false;
    });
    
    // Button controls
    document.getElementById('rotate-btn').addEventListener('touchstart', () => {
        if (card) {
            gsap.to(card.rotation, { y: card.rotation.y + Math.PI/2, duration: 0.5 });
        }
    });
    
    document.getElementById('zoom-in-btn').addEventListener('touchstart', () => {
        currentZoom = Math.min(currentZoom + 0.2, 3);
        camera.position.z = 3 / currentZoom;
    });
    
    document.getElementById('zoom-out-btn').addEventListener('touchstart', () => {
        currentZoom = Math.max(currentZoom - 0.2, 0.5);
        camera.position.z = 3 / currentZoom;
    });
    
    document.getElementById('flip-btn').addEventListener('touchstart', () => {
        if (card) {
            gsap.to(card.rotation, { y: card.rotation.y + Math.PI, duration: 0.5 });
        }
    });
    
    // AR Button
    document.getElementById('ar-button').addEventListener('click', async () => {
        try {
            const xrSession = await navigator.xr.requestSession("immersive-ar");
            renderer.xr.enabled = true;
            renderer.setAnimationLoop(() => {
                renderer.render(scene, camera);
            });
        } catch (error) {
            alert("AR not supported on your device");
        }
    });
}

// Handle Resize
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

// Initialize
init();
