class GPKUltra3D {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        // ... other properties
        this.init();
    }
    
    init() {
        this.setupRenderer();
        this.setupScene();
        // ... other setup methods
    }
    
    // ... other methods
}
setupRenderer() {
    this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });
    // ... configuration
    document.getElementById('scene-container').appendChild(this.renderer.domElement);
    
    window.addEventListener('resize', this.handleResize.bind(this));
}

handleResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
}
async loadAssets() {
    const textureLoader = new THREE.TextureLoader();
    
    this.cardTextures = await Promise.all(
        cardData.map(card => {
            return new Promise((resolve) => {
                textureLoader.load(
                    card.imageUrl,
                    texture => resolve(texture),
                    undefined,
                    () => resolve(null) // Fallback
                );
            });
        })
    );
}
switchScene(newScene) {
    if (this.currentScene === newScene) return;
    
    this.currentScene = newScene;
    
    // Animate camera transition
    gsap.to(this.camera.position, {
        x: newPosition.x,
        y: newPosition.y,
        z: newPosition.z,
        duration: 1
    });
}
animate() {
    requestAnimationFrame(() => this.animate());
    
    const delta = this.clock.getDelta();
    
    if (this.controls) this.controls.update(delta);
    if (this.mixer) this.mixer.update(delta);
    
    this.renderer.render(this.scene, this.camera);
}
class Card3D {
    constructor(data, scene) {
        this.data = data;
        this.scene = scene;
        this.mesh = null;
        this.isFlipped = false;
        this.init();
    }

    async init() {
        // Create card geometry
        const geometry = new THREE.PlaneGeometry(2.8, 3.8);
        geometry.gpuInstancing = true; // For performance if using many cards

        // Load textures with fallback
        const textureLoader = new THREE.TextureLoader();
        const frontTexture = await this.loadTexture(textureLoader, this.data.imageUrl);
        const backTexture = await this.loadTexture(textureLoader, this.data.backImage);

        // Create materials
        const frontMaterial = new THREE.MeshStandardMaterial({
            map: frontTexture,
            roughness: 0.2,
            metalness: 0.1,
            side: THREE.DoubleSide
        });

        const backMaterial = new THREE.MeshStandardMaterial({
            map: backTexture || this.createPatternTexture(),
            roughness: 0.3,
            metalness: 0,
            side: THREE.DoubleSide
        });

        // Create mesh
        this.mesh = new THREE.Mesh(geometry, [frontMaterial, backMaterial]);
        this.mesh.userData.card = this;
        this.mesh.layers.enable(1); // For selective rendering
    }

    async loadTexture(loader, url) {
        return new Promise(resolve => {
            loader.load(
                url,
                texture => resolve(texture),
                undefined,
                () => resolve(null)
            );
        });
    }

    createPatternTexture() {
        // Fallback GPK stripe pattern
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        
        // Draw stripe pattern
        ctx.fillStyle = '#ff3e41';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#ffde37';
        for (let i = -50; i < canvas.width; i += 20) {
            ctx.fillRect(i, 0, 50, canvas.height);
        }
        
        return new THREE.CanvasTexture(canvas);
    }

    flip() {
        this.isFlipped = !this.isFlipped;
        gsap.to(this.mesh.rotation, {
            y: this.isFlipped ? Math.PI : 0,
            duration: 0.6,
            ease: "power2.inOut"
        });
    }

    addToScene(position, rotation) {
        this.mesh.position.copy(position);
        this.mesh.rotation.copy(rotation);
        this.scene.add(this.mesh);
    }
}class XRManager {
    constructor(renderer, scene, camera) {
        this.renderer = renderer;
        this.scene = scene;
        this.camera = camera;
        this.xrSession = null;
        this.init();
    }

    async init() {
        if (!navigator.xr) {
            console.warn("WebXR not supported");
            return;
        }

        // Check AR support
        const supported = await navigator.xr.isSessionSupported('immersive-ar');
        if (!supported) {
            console.warn("AR not supported");
            return;
        }

        // Add AR button to UI
        this.createARButton();
    }

    createARButton() {
        const button = document.createElement('button');
        button.textContent = 'ENTER AR';
        button.classList.add('nav-button');
        button.style.position = 'absolute';
        button.style.top = '20px';
        button.style.right = '20px';
        button.addEventListener('click', () => this.startAR());
        document.body.appendChild(button);
    }

    async startAR() {
        try {
            const session = await navigator.xr.requestSession('immersive-ar', {
                requiredFeatures: ['hit-test'],
                optionalFeatures: ['dom-overlay']
            });
            
            this.xrSession = session;
            this.renderer.xr.enabled = true;
            this.renderer.xr.setReferenceSpaceType('local');
            
            // Add AR-specific lighting
            const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
            this.scene.add(ambientLight);
            
            // Setup session events
            session.addEventListener('end', () => this.endAR());
            
            // Start AR loop
            this.renderer.setAnimationLoop(() => {
                this.renderer.render(this.scene, this.camera);
            });
            
        } catch (error) {
            console.error("AR session failed:", error);
        }
    }

    endAR() {
        this.renderer.xr.enabled = false;
        this.renderer.setAnimationLoop(null);
        this.xrSession = null;
        
        // Reset camera
        this.camera.position.set(0, 1.6, 5);
        this.camera.rotation.set(0, 0, 0);
    }
}class PhysicsWorld {
    constructor(scene) {
        this.world = new CANNON.World();
        this.scene = scene;
        this.objects = [];
        this.init();
    }

    init() {
        // Setup physics world
        this.world.gravity.set(0, -9.82, 0);
        this.world.broadphase = new CANNON.NaiveBroadphase();
        this.world.solver.iterations = 10;
        
        // Create ground plane
        const groundShape = new CANNON.Plane();
        const groundBody = new CANNON.Body({
            mass: 0,
            shape: groundShape
        });
        groundBody.quaternion.setFromAxisAngle(
            new CANNON.Vec3(1, 0, 0),
            -Math.PI / 2
        );
        this.world.addBody(groundBody);
    }

    addCard(cardMesh) {
        const shape = new CANNON.Box(new CANNON.Vec3(1.4, 0.01, 1.9));
        const body = new CANNON.Body({
            mass: 0.5,
            shape: shape,
            position: new CANNON.Vec3(
                cardMesh.position.x,
                cardMesh.position.y,
                cardMesh.position.z
            ),
            quaternion: new CANNON.Quaternion(
                cardMesh.quaternion.x,
                cardMesh.quaternion.y,
                cardMesh.quaternion.z,
                cardMesh.quaternion.w
            )
        });
        
        this.world.addBody(body);
        this.objects.push({ mesh: cardMesh, body });
    }

    update() {
        this.world.step(1/60);
        
        // Update Three.js meshes to match physics bodies
        for (const obj of this.objects) {
            obj.mesh.position.copy(obj.body.position);
            obj.mesh.quaternion.copy(obj.body.quaternion);
        }
    }
}class SceneManager {
    constructor(scene, camera, renderer) {
        this.scenes = {
            lobby: new LobbyScene(),
            gallery: new GalleryScene(),
            collection: new CollectionScene()
        };
        this.currentScene = null;
        this.init();
    }

    async init() {
        // Preload all scenes
        await Promise.all(
            Object.values(this.scenes).map(scene => scene.load())
        );
        
        // Start with lobby scene
        this.switchTo('lobby');
    }

    async switchTo(sceneName) {
        // Clean up current scene
        if (this.currentScene) {
            await this.currentScene.unload();
        }
        
        // Set up new scene
        this.currentScene = this.scenes[sceneName];
        await this.currentScene.show();
        
        // Update camera position
        this.camera.position.copy(this.currentScene.cameraPosition);
    }
}

class BaseScene {
    constructor() {
        this.objects = [];
        this.cameraPosition = new THREE.Vector3(0, 1.6, 5);
    }
    
    async load() {
        // To be implemented by child classes
    }
    
    async show() {
        // To be implemented by child classes
    }
    
    async unload() {
        // Remove all objects from scene
        for (const obj of this.objects) {
            this.scene.remove(obj);
        }
        this.objects = [];
    }
}

class GalleryScene extends BaseScene {
    async load() {
        // Load gallery-specific assets
        this.cards = await this.loadCards();
    }
    
    async show() {
        // Display gallery layout
        this.setupGalleryLayout();
    }
    
    setupGalleryLayout() {
        // Arrange cards in a circular pattern
        const radius = 5;
        const count = this.cards.length;
        
        this.cards.forEach((card, i) => {
            const angle = (i / count) * Math.PI * 2;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            
            card.mesh.position.set(x, 1.5, z);
            card.mesh.lookAt(0, 1.5, 0);
            this.scene.add(card.mesh);
            this.objects.push(card.mesh);
        });
        
        this.cameraPosition.set(0, 2, 8);
    }
}class PerformanceManager {
    constructor(renderer, scene, camera) {
        this.renderer = renderer;
        this.scene = scene;
        this.camera = camera;
        this.stats = new Stats();
        this.init();
    }

    init() {
        // Setup stats.js panel
        this.stats.showPanel(0);
        document.body.appendChild(this.stats.dom);
        
        // Adaptive quality
        this.setAdaptiveQuality();
        
        // Visibility culling
        this.setupVisibilityCulling();
    }

    setAdaptiveQuality() {
        let quality = 1;
        const maxQuality = 1;
        const minQuality = 0.5;
        
        const updateQuality = () => {
            const fps = this.stats.getFps();
            
            if (fps < 50 && quality > minQuality) {
                quality -= 0.1;
            } else if (fps > 55 && quality < maxQuality) {
                quality += 0.1;
            }
            
            this.applyQualitySettings(quality);
            requestAnimationFrame(updateQuality);
        };
        
        updateQuality();
    }

    applyQualitySettings(quality) {
        // Adjust renderer settings
        this.renderer.antialias = quality > 0.8;
        this.renderer.pixelRatio = Math.min(window.devicePixelRatio, quality * 2);
        
        // Adjust shadow quality
        this.scene.traverse(child => {
            if (child.isLight && child.shadow) {
                child.shadow.mapSize.width = 1024 * quality;
                child.shadow.mapSize.height = 1024 * quality;
                child.shadow.needsUpdate = true;
            }
        });
    }

    setupVisibilityCulling() {
        // Frustum culling helper
        const frustum = new THREE.Frustum();
        const cameraViewProjectionMatrix = new THREE.Matrix4();
        
        const checkVisibility = () => {
            cameraViewProjectionMatrix.multiplyMatrices(
                this.camera.projectionMatrix,
                this.camera.matrixWorldInverse
            );
            frustum.setFromProjectionMatrix(cameraViewProjectionMatrix);
            
            this.scene.traverse(child => {
                if (child.isMesh) {
                    child.visible = frustum.intersectsObject(child);
                }
            });
            
            requestAnimationFrame(checkVisibility);
        };
        
        checkVisibility();
    }
}class GPKUltra3D {
    constructor() {
        // Core systems
        this.renderer = null;
        this.scene = null;
        this.camera = null;
        this.controls = null;
        
        // Subsystems
        this.xrManager = null;
        this.physicsWorld = null;
        this.sceneManager = null;
        this.performanceManager = null;
        
        // Initialize
        this.init();
    }

    async init() {
        // Setup core Three.js components
        this.setupRenderer();
        this.setupScene();
        this.setupCamera();
        
        // Initialize subsystems
        this.physicsWorld = new PhysicsWorld(this.scene);
        this.xrManager = new XRManager(this.renderer, this.scene, this.camera);
        this.sceneManager = new SceneManager(this.scene, this.camera, this.renderer);
        this.performanceManager = new PerformanceManager(this.renderer, this.scene, this.camera);
        
        // Start animation loop
        this.animate();
        
        // Hide loading screen
        document.getElementById('loading-screen').style.display = 'none';
    }

    animate() {
        this.stats.begin();
        
        // Update physics
        this.physicsWorld.update();
        
        // Render scene
        this.renderer.render(this.scene, this.camera);
        
        this.stats.end();
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize when ready
document.addEventListener('DOMContentLoaded', () => {
    const app = new GPKUltra3D();
});
