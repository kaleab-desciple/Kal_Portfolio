// Navigation validation script
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Testing Glassmorphism Navigation Implementation...');
    
    // Test 1: Check if scroll progress element exists
    const scrollProgress = document.getElementById('scroll-progress');
    if (scrollProgress) {
        console.log('✅ Scroll progress indicator element found');
    } else {
        console.error('❌ Scroll progress indicator element missing');
    }
    
    // Test 2: Check if CSS variables are available
    const rootStyles = getComputedStyle(document.documentElement);
    const blurValue = rootStyles.getPropertyValue('--backdrop-blur-xl');
    if (blurValue) {
        console.log('✅ CSS backdrop blur variables available');
    } else {
        console.warn('⚠️ CSS backdrop blur variables may not be loaded');
    }
    
    // Test 3: Check if navigation elements exist
    const header = document.getElementById('header');
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    
    if (header && navMenu) {
        console.log('✅ Core navigation elements found');
    } else {
        console.error('❌ Core navigation elements missing');
    }
    
    // Test 4: Test scroll progress functionality
    function testScrollProgress() {
        const currentWidth = scrollProgress.style.width;
        console.log(`📊 Current scroll progress: ${currentWidth}`);
        
        // Simulate scroll
        window.scrollTo(0, 100);
        setTimeout(() => {
            const newWidth = scrollProgress.style.width;
            console.log(`📊 Scroll progress after scroll: ${newWidth}`);
        }, 100);
    }
    
    if (scrollProgress) {
        testScrollProgress();
    }
    
    // Test 5: Check glassmorphism support
    if (CSS.supports('backdrop-filter', 'blur(10px)') || CSS.supports('-webkit-backdrop-filter', 'blur(10px)')) {
        console.log('✅ Backdrop filter (glassmorphism) is supported');
    } else {
        console.warn('⚠️ Backdrop filter not supported - fallbacks will be used');
    }
    
    // Test 6: Test responsive behavior
    function checkResponsive() {
        const width = window.innerWidth;
        console.log(`📱 Current viewport width: ${width}px`);
        
        if (width < 768) {
            console.log('📱 Mobile view - navigation should be at bottom');
        } else {
            console.log('💻 Desktop view - navigation should be at top');
        }
    }
    
    checkResponsive();
    
    console.log('🎉 Navigation validation complete!');
});

// Add scroll listener for testing
let scrollTestCount = 0;
window.addEventListener('scroll', function() {
    scrollTestCount++;
    if (scrollTestCount % 10 === 0) {
        console.log(`📜 Scroll event #${scrollTestCount} - Progress updated`);
    }
});