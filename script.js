document.addEventListener('DOMContentLoaded', () => {

    // 1. Loading Screen
    const loader = document.getElementById('loader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }, 1500);
    });

    // 2. Custom Cursor Glow
    const cursor = document.querySelector('.cursor-glow');
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    // 3. Scroll Progress Indicator
    window.onscroll = function () {
        updateScrollProgress();
        handleNavbarScroll();
    };

    function updateScrollProgress() {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        document.getElementById("scrollBar").style.width = scrolled + "%";
    }

    // 4. Sticky Navbar
    const navbar = document.querySelector('.navbar');
    function handleNavbarScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('sticky');
        } else {
            navbar.classList.remove('sticky');
        }
    }

    // 5. Typing Effect
    const typingSpan = document.getElementById('typing-text');
    const professions = ['AI & Software Developer'];
    let profIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
        const currentProf = professions[profIndex];

        if (isDeleting) {
            typingSpan.textContent = currentProf.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 50;
        } else {
            typingSpan.textContent = currentProf.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 150;
        }

        if (!isDeleting && charIndex === currentProf.length) {
            isDeleting = true;
            typeSpeed = 2000; // Pause at end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            profIndex = (profIndex + 1) % professions.length;
            typeSpeed = 500;
        }

        setTimeout(type, typeSpeed);
    }
    type();

    // 6. Tech Grid Canvas Animation
    const canvas = document.getElementById('techGrid');
    const ctx = canvas.getContext('2d');
    let width, height, particles;

    function initCanvas() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        particles = [];
        for (let i = 0; i < 80; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                size: Math.random() * 1.5
            });
        }
    }

    function draw() {
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = 'rgba(138, 43, 226, 0.4)';
        ctx.strokeStyle = 'rgba(138, 43, 226, 0.08)';

        particles.forEach((p, i) => {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();

            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 150) {
                    ctx.lineWidth = 1 - (dist / 150);
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }
        });
        requestAnimationFrame(draw);
    }

    window.addEventListener('resize', initCanvas);
    initCanvas();
    draw();

    // 7. Scroll Animations (Intersection Observer)
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const animation = entry.target.getAttribute('data-animation');
                const delay = entry.target.getAttribute('data-delay') || 0;

                setTimeout(() => {
                    entry.target.classList.add(animation);
                    entry.target.style.opacity = '1';
                }, delay);

                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });

    // 8. Mobile Nav Toggle
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.querySelector('.nav-links');

    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        navToggle.classList.toggle('open');
    });

    // 9. Contact Form Handling removed

    // Smooth scrolling for all navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });

                // Update active link if it's in nav
                if (this.closest('.nav-links')) {
                    document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
                    this.classList.add('active');
                }

                // Close mobile menu if open
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    navToggle.classList.remove('open');
                }
            }
        });
    });

    // 10. Music Toggle Logic
    const musicToggle = document.getElementById('musicToggle');
    const bgMusic = document.getElementById('bgMusic');
    let isPlaying = false;

    musicToggle.addEventListener('click', () => {
        if (isPlaying) {
            bgMusic.pause();
            musicToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
        } else {
            bgMusic.play().catch(e => console.log("Audio play failed: ", e));
            musicToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
            musicToggle.style.background = 'var(--primary)';
        }
        isPlaying = !isPlaying;
    });

    // 11. Project Cards Tilt Effect
    const projectCards = document.querySelectorAll('.project-card');

    projectCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const cardRect = card.getBoundingClientRect();
            const cardWidth = cardRect.width;
            const cardHeight = cardRect.height;
            const centerX = cardRect.left + cardWidth / 2;
            const centerY = cardRect.top + cardHeight / 2;
            const mouseX = e.clientX - centerX;
            const mouseY = e.clientY - centerY;

            const rotateX = (mouseY / (cardHeight / 2)) * -10; // Max 10 degrees
            const rotateY = (mouseX / (cardWidth / 2)) * 10; // Max 10 degrees

            card.style.transform = `translateY(-10px) scale(1.02) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `translateY(0) scale(1) rotateX(0) rotateY(0)`;
        });
    });

    // 12. Interactive Gallery Slider
    const galleryImages = [
        {
            url: "digital parking.jpeg",
            title: "Digital Parking Spot",
            desc: "Smart parking solution focused on urban mobility, AI-powered parking insights, AEIOU analysis, empathy mapping, and prototype-driven design.",
            tags: ["AEIOU", "Prototype", "UX Research", "Smart Parking", "Empathy Mapping"],
            buttons: [
                { label: "View PDF", href: "/pdfs/digital-parking-case-study.pdf" },
                { label: "Case Study", href: "/pdfs/digital-parking-case-study.pdf" }
            ]
        },
        {
            url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1200&auto=format&fit=crop",
            title: "Space Probes Research",
            desc: "Research presentation exploring space probes, Voyager missions, Chandrayaan-3, Perseverance Rover, interstellar exploration, and future space technologies.",
            tags: ["NASA", "ISRO", "Voyager", "Research", "Innovation"],
            buttons: [
                { label: "View Presentation", href: "/pdfs/space-probes-research.pdf" },
                { label: "Research Slides", href: "/pdfs/space-probes-research.pdf" }
            ]
        },
        {
            url: "https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?q=80&w=1200&auto=format&fit=crop",
            title: "Drone Design",
            desc: "Conceptual drone systems integrating AI navigation, automation, and intelligent aerial monitoring technologies.",
            tags: ["AI Robotics", "Drone Technology"],
            buttons: []
        },
        {
            url: "https://images.unsplash.com/photo-1558444458-201948831341?q=80&w=1200&auto=format&fit=crop",
            title: "UI/UX Design",
            desc: "Modern futuristic interface concepts focused on immersive experiences, accessibility, and responsive interaction systems.",
            tags: ["Creative Design", "User Experience"],
            buttons: []
        }
    ];

    let galleryIndex = 0;
    const mainImgEl = document.getElementById('mainGalleryImage');
    const galleryTitleEl = document.getElementById('galleryTitle');
    const galleryDescEl = document.getElementById('galleryDesc');
    const galleryCounterEl = document.getElementById('galleryCounter');
    const prevBtnEl = document.getElementById('galleryPrevBtn');
    const nextBtnEl = document.getElementById('galleryNextBtn');
    const thumbCards = document.querySelectorAll('.thumb-card');

    function updateGallery(index) {
        // Handle boundaries
        if (index < 0) {
            galleryIndex = galleryImages.length - 1;
        } else if (index >= galleryImages.length) {
            galleryIndex = 0;
        } else {
            galleryIndex = index;
        }

        // Apply transition animation to viewport
        if (mainImgEl) {
            mainImgEl.style.opacity = '0';
            mainImgEl.style.transform = 'scale(0.98)';
        }

        // After fade out completes, change content and fade in
        setTimeout(() => {
            const activeImage = galleryImages[galleryIndex];
            if (mainImgEl) {
                mainImgEl.src = activeImage.url;
                mainImgEl.alt = activeImage.title;
                mainImgEl.style.opacity = '1';
                mainImgEl.style.transform = 'scale(1)';
            }
            if (galleryTitleEl) galleryTitleEl.textContent = activeImage.title;
            if (galleryDescEl) galleryDescEl.textContent = activeImage.desc;
            if (galleryCounterEl) galleryCounterEl.textContent = `${galleryIndex + 1} / ${galleryImages.length}`;
        }, 200);

        // Update active class on thumbnails
        thumbCards.forEach((card, idx) => {
            if (idx === galleryIndex) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
        });
    }

    if (mainImgEl) {
        // Initialize Gallery with first image
        updateGallery(0);

        // Event listeners for arrows
        if (prevBtnEl) {
            prevBtnEl.addEventListener('click', () => {
                updateGallery(galleryIndex - 1);
                resetAutoplay();
            });
        }

        if (nextBtnEl) {
            nextBtnEl.addEventListener('click', () => {
                updateGallery(galleryIndex + 1);
                resetAutoplay();
            });
        }

        // Event listeners for thumbnail cards
        thumbCards.forEach((card, idx) => {
            card.addEventListener('click', () => {
                updateGallery(idx);
                resetAutoplay();
            });
        });

        // Keyboard Navigation
        document.addEventListener('keydown', (e) => {
            const rect = mainImgEl.getBoundingClientRect();
            // Only trigger if gallery is in viewport
            const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
            if (isInViewport) {
                if (e.key === 'ArrowLeft') {
                    updateGallery(galleryIndex - 1);
                    resetAutoplay();
                } else if (e.key === 'ArrowRight') {
                    updateGallery(galleryIndex + 1);
                    resetAutoplay();
                }
            }
        });

        // Autoplay Interval (5 seconds)
        let autoplayTimer = setInterval(() => {
            updateGallery(galleryIndex + 1);
        }, 5000);

        function resetAutoplay() {
            clearInterval(autoplayTimer);
            autoplayTimer = setInterval(() => {
                updateGallery(galleryIndex + 1);
            }, 5000);
        }

        // Pause autoplay on mouse hover on viewport
        const viewport = document.querySelector('.gallery-viewport');
        if (viewport) {
            viewport.addEventListener('mouseenter', () => {
                clearInterval(autoplayTimer);
            });
            viewport.addEventListener('mouseleave', () => {
                resetAutoplay();
            });
        }
    }
});
