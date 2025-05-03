// Main 3D Application
let scene, camera, renderer, controls, currentCard;

// Initialize 3D Viewer
function init3DViewer() {
    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x121212);
    
    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    
    // Renderer
    renderer = new THREE.WebGLRenderer({ 
        canvas: document.getElementById('webgl-canvas'),
        antialias: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 3);
    scene.add(directionalLight);
    
    // Controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    
    // Animation Loop
    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }
    animate();
    
    // Handle Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// Open 3D Viewer with Specific Card
function open3DViewer(card) {
    const container = document.getElementById('webgl-container');
    container.style.display = 'flex';
    
    // Clear previous card if exists
    if (currentCard) scene.remove(currentCard);
    
    // Load new card
    const loader = new THREE.GLTFLoader();
    loader.load(
        card.model,
        (gltf) => {
            currentCard = gltf.scene;
            currentCard.scale.set(0.5, 0.5, 0.5);
            scene.add(currentCard);
        },
        undefined,
        (error) => {
            console.error('Error loading 3D card:', error);
        }
    );
}

// Close 3D Viewer
document.getElementById('webgl-close').addEventListener('click', () => {
    document.getElementById('webgl-container').style.display = 'none';
});

// Star Portal to 3D Gallery
document.getElementById('3d-portal').addEventListener('click', () => {
    window.location.href = 'gallery.html';
});

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    init3DViewer();
});
