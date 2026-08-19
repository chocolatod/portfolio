// ==================== PRELOADER ====================
class Preloader {
    constructor() {
        this.preloader = document.getElementById('preloader');
        this.bar = document.getElementById('preloader-bar');
        this.progress = 0;
        this.init();
    }

    init() {
        this.simulateLoading();
    }

    simulateLoading() {
        const interval = setInterval(() => {
            this.progress += Math.random() * 15 + 5;
            if (this.progress >= 100) {
                this.progress = 100;
                clearInterval(interval);
                setTimeout(() => this.hide(), 300);
            }
            this.bar.style.width = this.progress + '%';
        }, 200);
    }

    hide() {
        this.preloader.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
}

// ==================== MATRIX BACKGROUND ====================
class MatrixBackground {
    constructor() {
        this.canvas = document.getElementById('matrix-bg');
        this.ctx = this.canvas.getContext('2d');
        this.characters = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF{}[]<>/\\|';
        this.fontSize = 14;
        this.columns = 0;
        this.drops = [];
        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.columns = Math.floor(this.canvas.width / this.fontSize);
        this.drops = Array(this.columns).fill(0).map(() => Math.random() * -100);
    }

    animate() {
        this.ctx.fillStyle = 'rgba(10, 10, 15, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.font = this.fontSize + 'px monospace';

        for (let i = 0; i < this.drops.length; i++) {
            const text = this.characters.charAt(Math.floor(Math.random() * this.characters.length));
            this.ctx.fillStyle = Math.random() > 0.98 ? '#ffffff' : `rgba(0, 255, 136, ${0.3 + Math.random() * 0.7})`;
            this.ctx.fillText(text, i * this.fontSize, this.drops[i] * this.fontSize);

            if (this.drops[i] * this.fontSize > this.canvas.height && Math.random() > 0.975) {
                this.drops[i] = 0;
            }
            this.drops[i]++;
        }
        requestAnimationFrame(() => this.animate());
    }
}

// ==================== PARTICLES ====================
class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particles');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: null, y: null };
        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
        this.createParticles();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        const count = Math.min(80, Math.floor((this.canvas.width * this.canvas.height) / 15000));
        this.particles = Array(count).fill(null).map(() => ({
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 2 + 1,
            opacity: Math.random() * 0.5 + 0.2
        }));
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach((p, i) => {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;

            // Mouse interaction
            if (this.mouse.x && this.mouse.y) {
                const dx = p.x - this.mouse.x;
                const dy = p.y - this.mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    const force = (120 - dist) / 120;
                    p.vx += (dx / dist) * force * 0.3;
                    p.vy += (dy / dist) * force * 0.3;
                }
            }

            // Damping
            p.vx *= 0.99;
            p.vy *= 0.99;

            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(0, 255, 136, ${p.opacity})`;
            this.ctx.fill();

            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = p.x - this.particles[j].x;
                const dy = p.y - this.particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 150) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(p.x, p.y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.strokeStyle = `rgba(0, 255, 136, ${0.15 * (1 - dist / 150)})`;
                    this.ctx.stroke();
                }
            }
        });
        requestAnimationFrame(() => this.animate());
    }
}

// ==================== TYPING EFFECT ====================
class TypingEffect {
    constructor(elementId, texts, speed = 100) {
        this.element = document.getElementById(elementId);
        this.texts = texts;
        this.speed = speed;
        this.textIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        this.type();
    }

    type() {
        const current = this.texts[this.textIndex];
        if (this.isDeleting) {
            this.element.textContent = current.substring(0, this.charIndex - 1);
            this.charIndex--;
        } else {
            this.element.textContent = current.substring(0, this.charIndex + 1);
            this.charIndex++;
        }

        let delay = this.isDeleting ? 50 : this.speed;

        if (!this.isDeleting && this.charIndex === current.length) {
            delay = 2000;
            this.isDeleting = true;
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.textIndex = (this.textIndex + 1) % this.texts.length;
            delay = 500;
        }

        setTimeout(() => this.type(), delay);
    }
}

// ==================== SCROLL ANIMATIONS ====================
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // Animate skill bars
                if (entry.target.classList.contains('skill-category')) {
                    entry.target.querySelectorAll('.skill-fill').forEach(fill => {
                        if (!fill.classList.contains('animated')) {
                            fill.classList.add('animated');
                        }
                    });
                }

                // Animate stat numbers
                if (entry.target.classList.contains('stat')) {
                    const num = entry.target.querySelector('.stat-number');
                    if (num && !num.classList.contains('counted')) {
                        animateNumber(num);
                        num.classList.add('counted');
                    }
                }
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.timeline-item, .skill-category, .cert-card, .stat, .reveal').forEach(el => {
        observer.observe(el);
    });
}

function animateNumber(element) {
    const target = parseInt(element.dataset.count);
    const duration = 2000;
    const start = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        element.textContent = Math.floor(target * ease);

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = target;
        }
    }
    requestAnimationFrame(update);
}

// ==================== NAVIGATION ====================
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Scroll effect
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    // Mobile menu
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Active link on scroll
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const top = section.offsetTop - 100;
            if (window.scrollY >= top) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });

    // Close mobile menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Close mobile menu on outside click
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

// ==================== SCROLL TO TOP ====================
function initScrollTop() {
    const btn = document.getElementById('scroll-top');

    window.addEventListener('scroll', () => {
        btn.classList.toggle('visible', window.scrollY > 500);
    });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ==================== SKILLS RADAR CHART ====================
function initSkillsChart() {
    const ctx = document.getElementById('skillsRadar');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Cloud Security', 'Vulnerability Mgmt', 'App Security', 'IAM', 'Security Ops', 'Networking'],
            datasets: [{
                label: 'Proficiency',
                data: [95, 90, 88, 92, 85, 80],
                backgroundColor: 'rgba(0, 255, 136, 0.15)',
                borderColor: '#00ff88',
                borderWidth: 2,
                pointBackgroundColor: '#00ff88',
                pointBorderColor: '#00ff88',
                pointHoverBackgroundColor: '#ffffff',
                pointHoverBorderColor: '#00ff88'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        display: false,
                        color: '#8b949e',
                        backdropColor: 'transparent',
                        font: { size: 10 }
                    },
                    grid: { color: 'rgba(33, 38, 45, 0.8)' },
                    angleLines: { color: 'rgba(33, 38, 45, 0.8)' },
                    pointLabels: {
                        color: '#e6e6e6',
                        font: { size: 11 }
                    }
                }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });
}

// ==================== CONTACT FORM ====================
// Formspree handles form submission — no JS interceptor needed.
function initContactForm() {}

// ==================== TILT EFFECT ON CARDS ====================
function initTiltEffect() {
    const cards = document.querySelectorAll('.cert-card, .skill-category');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
}

// ==================== SMOOTH REVEAL ON SCROLL ====================
function initRevealAnimations() {
    const revealElements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => observer.observe(el));
}

// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', () => {
    // Hide body overflow during loading
    document.body.style.overflow = 'hidden';

    new Preloader();
    new MatrixBackground();
    new ParticleSystem();
    new TypingEffect('typing-text', [
        'Sr. Cyber Security Analyst',
        'Cloud Security Specialist',
        'Vulnerability Researcher',
        'Penetration Tester',
        'Identity & Access Management',
        'Security Operations'
    ]);
    initNavigation();
    initScrollAnimations();
    initScrollTop();
    initSkillsChart();
    initContactForm();
    initTiltEffect();
    initRevealAnimations();
});
