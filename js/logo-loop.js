class LogoLoop {
  constructor(container, options = {}) {
    this.container = typeof container === 'string' 
      ? document.querySelector(container) 
      : container;
    
    this.options = {
      speed: 1,
      direction: 'left',
      gap: 40,
      pauseOnHover: true,
      ...options
    };
    
    this.track = this.container.querySelector('.logo-loop__track');
    this.items = Array.from(this.track.children);
    this.animationId = null;
    this.lastTime = null;
    this.position = 0;
    this.isPaused = false;
    
    this.init();
  }
  
  init() {
    // Remove any existing fade elements (clean up from previous runs)
    const existingFades = this.container.querySelectorAll('.logo-loop__fade');
    existingFades.forEach(fade => fade.remove());
    
    // Duplicate items enough times to create a seamless loop
    // We need enough duplicates to cover the container width plus some buffer
    const containerWidth = this.container.offsetWidth;
    const itemWidth = this.items[0].offsetWidth + this.options.gap;
    const itemsNeeded = Math.ceil(containerWidth / itemWidth) * 2 + 2; // Extra buffer
    
    // Clear existing items
    this.track.innerHTML = '';
    
    // Add the original items and duplicates
    for (let i = 0; i < itemsNeeded; i++) {
      this.items.forEach(item => {
        const clone = item.cloneNode(true);
        this.track.appendChild(clone);
      });
    }
    
    // Update items reference
    this.items = Array.from(this.track.children);
    
    // Set initial position
    this.track.style.transform = `translateX(${this.position}px)`;
    
    // Add event listeners
    if (this.options.pauseOnHover) {
      this.container.addEventListener('mouseenter', () => this.pause());
      this.container.addEventListener('mouseleave', () => this.resume());
    }
    
    // Handle window resize
    window.addEventListener('resize', () => this.handleResize());
    
    // Start animation
    this.animate();
  }
  
  animate(currentTime = 0) {
    if (!this.lastTime) this.lastTime = currentTime;
    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;
    
    if (!this.isPaused) {
      // Calculate dimensions
      const itemWidth = this.items[0].offsetWidth + this.options.gap;
      const totalWidth = itemWidth * this.items.length;
      const visibleWidth = this.container.offsetWidth;
      
      // Move the track
      this.position += (this.options.speed * deltaTime / 16) * (this.options.direction === 'left' ? -1 : 1);
      
      // Seamless loop - when we've scrolled one complete set of items, 
      // reset position to create infinite scroll
      const scrollThreshold = this.options.direction === 'left' 
        ? -itemWidth * (this.items.length / 2)
        : itemWidth * (this.items.length / 2);
      
      if ((this.options.direction === 'left' && this.position <= scrollThreshold) ||
          (this.options.direction === 'right' && this.position >= Math.abs(scrollThreshold))) {
        this.position = 0;
      }
      
      this.track.style.transform = `translateX(${this.position}px)`;
    }
    
    this.animationId = requestAnimationFrame(this.animate.bind(this));
  }
  
  pause() {
    this.isPaused = true;
  }
  
  resume() {
    this.isPaused = false;
    this.lastTime = null;
  }
  
  handleResize() {
    // Adjust position on resize to prevent jumps
    const itemWidth = this.items[0].offsetWidth + this.options.gap;
    const totalWidth = itemWidth * this.items.length;
    this.position = this.position % totalWidth;
  }
  
  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    
    // Remove event listeners
    this.container.removeEventListener('mouseenter', this.pause);
    this.container.removeEventListener('mouseleave', this.resume);
    window.removeEventListener('resize', this.handleResize);
  }
}

// Auto-initialize logo loops
document.addEventListener('DOMContentLoaded', () => {
  const logoLoops = document.querySelectorAll('.logo-loop');
  
  logoLoops.forEach(container => {
    const speed = parseFloat(container.getAttribute('data-speed')) || 1;
    const direction = container.getAttribute('data-direction') || 'left';
    const gap = parseInt(container.getAttribute('data-gap')) || 40;
    const pauseOnHover = container.getAttribute('data-pause-on-hover') !== 'false';
    
    new LogoLoop(container, {
      speed,
      direction,
      gap,
      pauseOnHover
    });
  });
});
