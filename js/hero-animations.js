// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, TextPlugin);

document.addEventListener('DOMContentLoaded', () => {
    // Hero section elements
    const heroContent = document.querySelector('.hero-content');
    const heroTitle = document.querySelector('.hero-content h1');
    const heroSubtitle = document.querySelector('.hero-content h2');
    const heroText = document.querySelector('.hero-content p');
    const heroButtons = document.querySelector('.hero-buttons');

    // Make sure elements exist before animating
    if (!heroTitle || !heroSubtitle || !heroText || !heroButtons) {
        console.error('Hero elements not found!');
        return;
    }

    // Reset any inline styles that might be hiding elements
    gsap.set([heroTitle, heroSubtitle, heroText, heroButtons], {
        opacity: 1,
        y: 0
    });

    // Create a timeline for the hero section animations
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Set initial state
    gsap.set([heroTitle, heroSubtitle, heroText, heroButtons], {
        y: 30,
        opacity: 0
    });

    // Animate the hero elements in sequence
    heroTl.to(heroTitle, {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out'
    });

    heroTl.to(heroSubtitle, {
        y: 0,
        opacity: 1,
        duration: 0.8
    }, '-=0.7');

    heroTl.to(heroText, {
        y: 0,
        opacity: 1,
        duration: 0.8
    }, '-=0.6');

    heroTl.to(heroButtons, {
        y: 0,
        opacity: 1,
        duration: 0.8
    }, '-=0.5');

    // Add a subtle scale animation to the highlight text
    if (heroTitle.querySelector('.highlight')) {
        gsap.to(heroTitle.querySelector('.highlight'), {
            scale: 1.05,
            duration: 2,
            yoyo: true,
            repeat: -1,
            ease: 'sine.inOut',
            delay: 1
        });

        // Add a subtle glow effect to the highlight text
        gsap.to(heroTitle.querySelector('.highlight'), {
            textShadow: '0 0 10px rgba(0, 168, 255, 0.7)',
            duration: 2,
            yoyo: true,
            repeat: -1,
            ease: 'sine.inOut',
            delay: 1
        });
    }

    // Add a subtle floating animation to the hero content
    gsap.to(heroTitle, {
        y: '+=5',
        duration: 3,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
        delay: 2
    });

    gsap.to(heroSubtitle, {
        y: '+=3',
        duration: 3.5,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
        delay: 2.5
    });
});
