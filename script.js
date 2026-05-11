/* ============================
   Portfolio JavaScript
   Lakshman Rohith Sanagapalli
   ============================ */

document.addEventListener('DOMContentLoaded', () => {

    // ---- Navbar scroll effect ----
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    // ---- Mobile nav toggle ----
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('open');
    });
    // Close menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => navLinks.classList.remove('open'));
    });

    // ---- Stat counter animation ----
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    const animateStats = () => {
        statNumbers.forEach(el => {
            const target = +el.dataset.target;
            const duration = 1500;
            const start = performance.now();

            const tick = (now) => {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                // easeOutQuart
                const eased = 1 - Math.pow(1 - progress, 4);
                el.textContent = Math.round(eased * target);
                if (progress < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
        });
    };

    // Trigger stats when hero is visible
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                heroObserver.disconnect();
            }
        });
    }, { threshold: 0.3 });
    const heroSection = document.getElementById('hero');
    if (heroSection) heroObserver.observe(heroSection);

    // ---- Scroll-based fade-in animations ----
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.timeline-item, .pub-card, .edu-card, .project-card').forEach(el => {
        fadeObserver.observe(el);
    });

    // ---- Project filter ----
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;

            projectCards.forEach(card => {
                const category = card.dataset.category || '';
                if (filter === 'all' || category.includes(filter)) {
                    card.classList.remove('hidden');
                    // Re-trigger visible animation
                    setTimeout(() => card.classList.add('visible'), 50);
                } else {
                    card.classList.add('hidden');
                    card.classList.remove('visible');
                }
            });
        });
    });

    // ---- Active nav link on scroll ----
    const sections = document.querySelectorAll('section[id]');
    const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const top = section.offsetTop - 120;
            if (window.scrollY >= top) {
                current = section.getAttribute('id');
            }
        });
        navAnchors.forEach(a => {
            a.style.color = '';
            if (a.getAttribute('href') === '#' + current) {
                a.style.color = '#6c5ce7';
            }
        });
    });

    // ---- Particle canvas background ----
    const canvas = document.getElementById('particleCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height, particles;

        const resize = () => {
            width = canvas.width = canvas.parentElement.offsetWidth;
            height = canvas.height = canvas.parentElement.offsetHeight;
        };

        class Particle {
            constructor() {
                this.reset();
            }
            reset() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.4;
                this.vy = (Math.random() - 0.5) * 0.4;
                this.radius = Math.random() * 1.5 + 0.5;
                this.opacity = Math.random() * 0.4 + 0.1;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(108, 92, 231, ${this.opacity})`;
                ctx.fill();
            }
        }

        const init = () => {
            resize();
            const count = Math.min(Math.floor((width * height) / 12000), 80);
            particles = Array.from({ length: count }, () => new Particle());
        };

        const drawLines = () => {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 150) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(108, 92, 231, ${0.06 * (1 - dist / 150)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, width, height);
            particles.forEach(p => { p.update(); p.draw(); });
            drawLines();
            requestAnimationFrame(animate);
        };

        init();
        animate();
        window.addEventListener('resize', init);
    }

    // ---- Smooth scroll for anchor links ----
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

});
