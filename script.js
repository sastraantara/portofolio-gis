// Preloader Logic
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        // Short artificial delay to let the animation play out beautifully
        setTimeout(() => {
            preloader.style.opacity = '0';
            preloader.style.visibility = 'hidden';
        }, 1200);
    }
});

// Handle Navbar Background on Scroll
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Intersection Observer for scroll reveal animations
function reveal() {
    const reveals = document.querySelectorAll('.reveal');

    for (let i = 0; i < reveals.length; i++) {
        const windowHeight = window.innerHeight;
        const elementTop = reveals[i].getBoundingClientRect().top;
        const elementVisible = 100; // Trigger distance

        if (elementTop < windowHeight - elementVisible) {
            reveals[i].classList.add('active');
        }
    }
}

// Listen to scroll events
window.addEventListener('scroll', reveal);

// Trigger once on load
reveal();

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if(targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            // Adjust offset for fixed navbar
            const offset = 80;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Animated Counters
const counters = document.querySelectorAll('.counter');
const speed = 100;

const runCounter = () => {
    counters.forEach(counter => {
        const updateCount = () => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;
            const inc = target / speed;

            if (count < target) {
                counter.innerText = Math.ceil(count + inc);
                setTimeout(updateCount, 20);
            } else {
                counter.innerText = target;
            }
        };
        
        // Only run when in view
        const windowHeight = window.innerHeight;
        const elementTop = counter.getBoundingClientRect().top;
        if (elementTop < windowHeight - 50 && counter.innerText === '0') {
            updateCount();
        }
    });
};

window.addEventListener('scroll', runCounter);
setTimeout(runCounter, 500); // Trigger once on load just in case

// Initialize Leaflet Map
// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Define basemaps for Light and Dark modes
    const darkTheme = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 20
    });

    const lightTheme = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 20
    });

    // Coordinates to center the map (covering Jakarta, Islands, Bogor, and Sawarna)
    const map = L.map('gisMap', {
        center: [-6.40, 106.60],
        zoom: 9,
        layers: [darkTheme] // Default theme
    });

    // Add Layer Control to switch themes
    const baseMaps = {
        "Dark Map": darkTheme,
        "Light Map": lightTheme
    };
    L.control.layers(baseMaps).addTo(map);

    // Example markers for river mouths & islands (Translated to English)
    const projects = [
        { name: "North Jakarta", coords: [-6.1200, 106.8700] },
        { name: "Lancang Island", coords: [-5.9330, 106.5830] },
        { name: "Untung Jawa Island", coords: [-5.9750, 106.7080] },
        { name: "Tunda Island", coords: [-5.8160, 106.2750] },
        { name: "Bogor City", coords: [-6.5970, 106.7930] },
        { name: "Sawarna Coast", coords: [-6.9850, 106.3150] }
    ];

    // Add markers with custom CSS icon
    const customIcon = L.divIcon({
        className: 'custom-div-icon',
        html: "<div style='background-color: #d4af37; width: 15px; height: 15px; border-radius: 50%; border: 2px solid #fff; box-shadow: 0 0 10px #d4af37;'></div>",
        iconSize: [15, 15],
        iconAnchor: [7.5, 7.5]
    });

    projects.forEach(project => {
        L.marker(project.coords, {icon: customIcon})
            .bindPopup(`<div style="text-align:center;"><b>${project.name}</b><br><span style="color:#94a3b8;font-size:0.9em;">Drone Survey & Spatial Analysis</span></div>`)
            .addTo(map);
    });
    
    // Fix map rendering issue when in hidden/animated container
    setTimeout(() => { map.invalidateSize(); }, 1000);
});

// Custom Cursor Logic
document.addEventListener('DOMContentLoaded', () => {
    const cursorDot = document.querySelector("[data-cursor-dot]");
    const cursorOutline = document.querySelector("[data-cursor-outline]");

    // Only activate cursor tracking if not on a touch device
    if(window.matchMedia("(pointer: fine)").matches) {
        window.addEventListener("mousemove", (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            if (cursorDot) {
                cursorDot.style.left = `${posX}px`;
                cursorDot.style.top = `${posY}px`;
            }

            if (cursorOutline) {
                cursorOutline.animate({
                    left: `${posX}px`,
                    top: `${posY}px`
                }, { duration: 250, fill: "forwards" });
            }
        });

        // Hover effect for interactive elements
        const interactiveElements = document.querySelectorAll("a, .btn, button, .timeline-item, .expertise-card");
        
        interactiveElements.forEach(el => {
            el.addEventListener("mouseenter", () => {
                if(cursorOutline) {
                    cursorOutline.style.width = "60px";
                    cursorOutline.style.height = "60px";
                    cursorOutline.style.backgroundColor = "rgba(212, 175, 55, 0.1)";
                    cursorOutline.style.border = "1px solid rgba(212, 175, 55, 0.5)";
                }
            });
            el.addEventListener("mouseleave", () => {
                if(cursorOutline) {
                    cursorOutline.style.width = "40px";
                    cursorOutline.style.height = "40px";
                    cursorOutline.style.backgroundColor = "transparent";
                    cursorOutline.style.border = "2px solid var(--accent-blue)";
                }
            });
        });
    }
});

// Mobile Menu Logic
document.addEventListener('DOMContentLoaded', () => {
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links li a');

    if(mobileMenu && navLinks) {
        mobileMenu.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileMenu.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });

        navItems.forEach(item => {
            item.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = mobileMenu.querySelector('i');
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            });
        });
    }
});

// =========================================================================
// ELITE UX UPGRADES
// =========================================================================

// 1. Back to Top Button
document.addEventListener('DOMContentLoaded', () => {
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTop.classList.add('show');
            } else {
                backToTop.classList.remove('show');
            }
        });
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});

// 2. Animated Number Counters
document.addEventListener('DOMContentLoaded', () => {
    const statNumbers = document.querySelectorAll('.stat-number');
    let hasAnimated = false;

    if (statNumbers.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !hasAnimated) {
                    hasAnimated = true;
                    statNumbers.forEach(stat => {
                        const target = +stat.getAttribute('data-target');
                        const duration = 2000; // 2 seconds
                        const increment = target / (duration / 16); // ~60fps
                        
                        let current = 0;
                        const updateCounter = () => {
                            current += increment;
                            if (current < target) {
                                stat.innerText = Math.ceil(current).toLocaleString();
                                requestAnimationFrame(updateCounter);
                            } else {
                                stat.innerText = target.toLocaleString();
                            }
                        };
                        updateCounter();
                    });
                }
            });
        }, { threshold: 0.5 });

        const statsSection = document.querySelector('.stats-section');
        if (statsSection) {
            observer.observe(statsSection);
        }
    }
});
