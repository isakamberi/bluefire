class ClickSpark {
  constructor(options = {}) {
    this.sparkColor = options.sparkColor || '#00a8ff';
    this.sparkSize = options.sparkSize || 8;
    this.sparkRadius = options.sparkRadius || 25;
    this.sparkCount = options.sparkCount || 12;
    this.duration = options.duration || 600;
    this.easing = options.easing || 'cubic-bezier(0.4, 0, 0.2, 1)';
    this.extraScale = options.extraScale || 1.2;
    this.colorPalette = options.colorPalette || [
      '#00a8ff', '#0088ff', '#0099ff', '#00d4ff', '#4cc9f0'
    ];
    this.canvas = null;
    this.ctx = null;
    this.sparks = [];
    this.animationId = null;
    this.container = null;
  }

  init(container, excludeSelectors = []) {
    this.container = container || document.body;
    this.excludeSelectors = excludeSelectors;
    
    // Create canvas element
    this.canvas = document.createElement('canvas');
    this.canvas.style.position = 'absolute';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '9999';
    
    // Insert canvas as first child of container
    this.container.style.position = 'relative';
    this.container.insertBefore(this.canvas, this.container.firstChild);
    
    this.ctx = this.canvas.getContext('2d');
    this.resizeCanvas();
    
    // Add event listeners
    window.addEventListener('resize', this.handleResize.bind(this));
    
    // Create a wrapped click handler to handle exclusions
    this.boundHandleClick = this.handleClick.bind(this);
    this.container.addEventListener('click', this.boundHandleClick, true); // Use capture phase
    
    // Start animation loop
    this.animate();
  }
  
  resizeCanvas() {
    const rect = this.container.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
  }
  
  handleResize() {
    this.resizeCanvas();
  }
  
  easeFunc(t) {
    switch (this.easing) {
      case 'linear':
        return t;
      case 'ease-in':
        return t * t;
      case 'ease-in-out':
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      default: // ease-out
        return t * (2 - t);
    }
  }
  
  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    const now = performance.now();
    const deltaTime = now - (this.lastTime || 0);
    this.lastTime = now;
    
    // Update and draw sparks
    this.sparks = this.sparks.filter(spark => {
      this.updateSpark(spark, deltaTime);
      this.drawSpark(spark);
      return spark.alpha > 0;
    });
    
    this.animationId = requestAnimationFrame(this.animate.bind(this));
  }
  
  updateSpark(spark, deltaTime) {
    // Update position with easing
    spark.x += spark.vx * deltaTime * 60;
    spark.y += spark.vy * deltaTime * 60;
    
    // Apply gravity with easing
    spark.vy += 0.05;
    
    // Update rotation
    spark.rotation += spark.rotationSpeed;
    
    // Pulsing effect
    const pulse = Math.sin(Date.now() * 0.01) * 0.1 + 0.9;
    spark.size = spark.baseSize * pulse;
    
    // Fade out with easing
    spark.alpha -= deltaTime * (1000 / this.duration) * (0.8 + Math.random() * 0.4);
  }
  
  drawSpark(spark) {
    this.ctx.save();
    this.ctx.translate(spark.x, spark.y);
    this.ctx.rotate(spark.rotation);
    
    // Create a gradient for each spark
    const gradient = this.ctx.createRadialGradient(
      0, 0, 0,
      0, 0, spark.size / 2
    );
    
    const color = new THREE.Color(spark.color);
    gradient.addColorStop(0, `rgba(${Math.round(color.r * 255)}, ${Math.round(color.g * 255)}, ${Math.round(color.b * 255)}, ${spark.alpha})`);
    gradient.addColorStop(1, `rgba(${Math.round(color.r * 150)}, ${Math.round(color.g * 200)}, ${Math.round(color.b * 255)}, 0)`);
    
    this.ctx.fillStyle = gradient;
    this.ctx.beginPath();
    this.ctx.ellipse(0, 0, spark.size / 2, spark.size / 1.5, 0, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Add a subtle glow
    this.ctx.shadowColor = spark.color;
    this.ctx.shadowBlur = spark.size * 0.8;
    this.ctx.shadowOffsetX = 0;
    this.ctx.shadowOffsetY = 0;
    
    this.ctx.restore();
  }
  
  handleClick(e) {
    // Check if click is on an excluded element
    if (this.excludeSelectors && this.excludeSelectors.length > 0) {
      let target = e.target;
      const isExcluded = this.excludeSelectors.some(selector => {
        return target.matches(selector) || target.closest(selector);
      });
      
      if (isExcluded) return;
    }
    
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Only proceed if the click is within the canvas bounds
    if (x < 0 || y < 0 || x > rect.width || y > rect.height) return;
    
    this.createSpark(x, y);
  }
  
  createSpark(x, y) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 0.8 + Math.random() * 1.5;
    const size = this.sparkSize * (0.6 + Math.random() * 0.8);
    const color = this.colorPalette[Math.floor(Math.random() * this.colorPalette.length)];
    
    this.sparks.push({
      x,
      y,
      size,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      alpha: 0.9 + Math.random() * 0.1,
      color,
      baseSize: size,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.1
    });
  }
  
  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    
    window.removeEventListener('resize', this.handleResize);
    if (this.container) {
      this.container.removeEventListener('click', this.boundHandleClick, true);
      if (this.canvas && this.canvas.parentNode) {
        this.canvas.parentNode.removeChild(this.canvas);
        this.canvas = null;
      }
    }
  }
}

// Function to get spark color based on theme
function getSparkColor() {
  const theme = document.documentElement.getAttribute('data-theme') || 'dark';
  return theme === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)';
}

// Initialize global click spark
document.addEventListener('DOMContentLoaded', () => {
  // Initialize on specific elements with data-click-spark
  const elements = document.querySelectorAll('[data-click-spark]');
  elements.forEach(element => {
    const options = {
      sparkColor: element.dataset.sparkColor || getSparkColor(),
      sparkSize: element.dataset.sparkSize ? parseInt(element.dataset.sparkSize) : 10,
      sparkRadius: element.dataset.sparkRadius ? parseInt(element.dataset.sparkRadius) : 15,
      sparkCount: element.dataset.sparkCount ? parseInt(element.dataset.sparkCount) : 8,
      duration: element.dataset.duration ? parseInt(element.dataset.duration) : 400,
      easing: element.dataset.easing || 'ease-out',
      extraScale: element.dataset.extraScale ? parseFloat(element.dataset.extraScale) : 1.0
    };
    
    const clickSpark = new ClickSpark(options);
    clickSpark.init(element);
    element._clickSparkInstance = clickSpark;
  });

  // Initialize global click spark on body if not already initialized
  if (!document.body._clickSparkInitialized) {
    document.body._clickSparkInitialized = true;
    
    const globalSpark = new ClickSpark({
      sparkColor: getSparkColor(),
      sparkSize: 8,
      sparkRadius: 25,
      sparkCount: 10,
      duration: 500,
      easing: 'ease-out',
      extraScale: 1.0
    });
    
    // Initialize on body but exclude form elements and buttons
    globalSpark.init(document.body, ['input', 'button', 'a', 'select', 'textarea']);
    
    // Update spark color when theme changes
    const observer = new MutationObserver(() => {
      globalSpark.sparkColor = getSparkColor();
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });
  }
});
