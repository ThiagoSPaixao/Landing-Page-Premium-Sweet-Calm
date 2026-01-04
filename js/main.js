const animatedElements = document.querySelectorAll(
    '.card, .benefit, .product, blockquote'
);

let hasAnimatedAll = false;

animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
});

function animateOnScroll() {
    if (hasAnimatedAll) {
        window.removeEventListener('scroll', animateOnScroll);
        return;
    }

    let allAnimated = true;
    const windowHeight = window.innerHeight;
    const triggerOffset = 80;

    animatedElements.forEach(el => {
        if (el.style.opacity === '1') return;

        const elementPosition = el.getBoundingClientRect().top;
        
        if (elementPosition < windowHeight - triggerOffset) {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        } else {
            allAnimated = false;
        }
    });

    hasAnimatedAll = allAnimated;
    
    if (hasAnimatedAll) {
        window.removeEventListener('scroll', animateOnScroll);
    }
}

window.addEventListener('scroll', animateOnScroll);

window.addEventListener('load', animateOnScroll);

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(animateOnScroll, 100);
});

let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(animateOnScroll, 250);
});