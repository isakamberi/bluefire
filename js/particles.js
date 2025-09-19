class ParticlesBackground {
  constructor(container, options = {}) {
    this.container = container;
    this.options = {
      colors: options.colors || ['#ffffff'],
      count: options.count || 200,
      spread: options.spread || 10,
      speed: options.speed || 0.1,
      baseSize: options.baseSize || 100,
      moveOnHover: options.moveOnHover !== false,
      alphaParticles: options.alphaParticles || false,
      disableRotation: options.disableRotation || false,
      cameraDistance: options.cameraDistance || 20,
      sizeRandomness: options.sizeRandomness || 1,
      hoverFactor: options.hoverFactor || 1
    };

    this.init();
  }

  init() {
    // Create scene
    this.scene = new THREE.Scene();
    
    // Create camera
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(15, width / height, 0.1, 1000);
    this.camera.position.z = this.options.cameraDistance;

    // Create renderer
    this.renderer = new THREE.WebGLRenderer({ 
      alpha: true,
      antialias: true
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.container.insertBefore(this.renderer.domElement, this.container.firstChild);

    // Create particles
    this.createParticles();
    
    // Handle resize
    window.addEventListener('resize', this.handleResize.bind(this));
    
    // Handle mouse move for hover effect
    if (this.options.moveOnHover) {
      this.mouse = new THREE.Vector2();
      window.addEventListener('mousemove', this.handleMouseMove.bind(this));
    }
    
    // Start animation
    this.animate();
  }

  createParticles() {
    const { count, colors, spread, baseSize, sizeRandomness } = this.options;
    
    // Create geometry
    const geometry = new THREE.BufferGeometry();
    
    // Create positions, colors, and sizes
    const positions = new Float32Array(count * 3);
    const colorsArray = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    const color = new THREE.Color();
    
    for (let i = 0; i < count; i++) {
      // Position
      const i3 = i * 3;
      const r = Math.cbrt(Math.random()) * spread;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = r * Math.cos(phi);
      
      // Color
      const colorHex = colors[Math.floor(Math.random() * colors.length)];
      color.set(colorHex);
      colorsArray[i3] = color.r;
      colorsArray[i3 + 1] = color.g;
      colorsArray[i3 + 2] = color.b;
      
      // Size
      sizes[i] = baseSize * (1 + (Math.random() - 0.5) * sizeRandomness);
    }
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colorsArray, 3));
    geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));
    
    // Create material
    const material = new THREE.PointsMaterial({
      size: 1,
      vertexColors: true,
      transparent: true,
      opacity: this.options.alphaParticles ? 0.8 : 1,
      alphaTest: 0.01,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    });
    
    // Create points
    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
    
    // Add rotation animation
    this.particles.rotation.x = Math.random() * 0.2 - 0.1;
    this.particles.rotation.y = Math.random() * 0.2 - 0.1;
    
    // Store initial positions for animation
    this.initialPositions = positions.slice();
  }

  handleResize() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }
  
  handleMouseMove(event) {
    const rect = this.container.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    
    // Update particle positions
    const time = Date.now() * 0.001 * this.options.speed;
    
    if (!this.options.disableRotation) {
      this.particles.rotation.x = Math.sin(time * 0.2) * 0.1;
      this.particles.rotation.y = Math.cos(time * 0.3) * 0.15;
      this.particles.rotation.z += 0.001 * this.options.speed;
    }
    
    // Apply hover effect
    if (this.options.moveOnHover && this.mouse) {
      this.particles.position.x = -this.mouse.x * this.options.hoverFactor * 5;
      this.particles.position.y = -this.mouse.y * this.options.hoverFactor * 5;
    }
    
    // Render
    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    window.removeEventListener('resize', this.handleResize);
    if (this.options.moveOnHover) {
      window.removeEventListener('mousemove', this.handleMouseMove);
    }
    
    // Clean up Three.js objects
    this.scene.remove(this.particles);
    this.particles.geometry.dispose();
    this.particles.material.dispose();
    this.renderer.dispose();
    
    if (this.container.contains(this.renderer.domElement)) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}

// Auto-initialize on elements with data-particles attribute
document.addEventListener('DOMContentLoaded', () => {
  const containers = document.querySelectorAll('[data-particles]');
  
  containers.forEach(container => {
    const options = {
      colors: container.dataset.particleColors ? 
        container.dataset.particleColors.split(',').map(c => c.trim()) : 
        ['#ffffff'],
      count: container.dataset.particleCount ? 
        parseInt(container.dataset.particleCount) : 200,
      spread: container.dataset.particleSpread ? 
        parseFloat(container.dataset.particleSpread) : 10,
      speed: container.dataset.speed ? 
        parseFloat(container.dataset.speed) : 0.1,
      baseSize: container.dataset.particleBaseSize ? 
        parseFloat(container.dataset.particleBaseSize) : 100,
      moveOnHover: container.dataset.moveParticlesOnHover !== 'false',
      alphaParticles: container.dataset.alphaParticles === 'true',
      disableRotation: container.dataset.disableRotation === 'true',
      cameraDistance: container.dataset.cameraDistance ? 
        parseFloat(container.dataset.cameraDistance) : 20,
      sizeRandomness: container.dataset.sizeRandomness ? 
        parseFloat(container.dataset.sizeRandomness) : 1,
      hoverFactor: container.dataset.hoverFactor ? 
        parseFloat(container.dataset.hoverFactor) : 1
    };
    
    const particles = new ParticlesBackground(container, options);
    container._particlesInstance = particles;
  });
});
