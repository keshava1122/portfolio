/**
 * ==========================================================================
 * CHENNAKESHAVA MISALA - AI ENGINEER PORTFOLIO JAVASCRIPT
 * Interactive Neural Canvas, Theme Engine, Magnetic Physics & Scroll Animations
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. THEME ENGINE (Light / Dark with Memory)
    // ==========================================
    const themeToggleBtn = document.getElementById('themeToggle');
    const htmlElement = document.documentElement;
    const themeIcon = themeToggleBtn ? themeToggleBtn.querySelector('i') : null;

    // Retrieve saved theme or prefer dark by default
    const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
    applyTheme(savedTheme);

    function applyTheme(theme) {
        htmlElement.setAttribute('data-theme', theme);
        localStorage.setItem('portfolio-theme', theme);
        if (themeIcon) {
            if (theme === 'light') {
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
            } else {
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
            }
        }
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme') || 'dark';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            applyTheme(newTheme);
        });
    }

    // ==========================================
    // 2. INTERACTIVE NEURAL-NETWORK CANVAS
    // ==========================================
    const canvas = document.getElementById('neuralCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];
        const particleCount = window.innerWidth < 768 ? 38 : 70;
        const connectDistance = window.innerWidth < 768 ? 95 : 135;
        const mouseDistance = 160;

        let mouse = { x: null, y: null, active: false };

        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }
        resize();
        window.addEventListener('resize', resize);

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.75;
                this.vy = (Math.random() - 0.5) * 0.75;
                this.radius = Math.random() * 1.8 + 1.2;
                // Mix violet, cyan, and pink nodes
                const colors = ['#8b5cf6', '#06b6d4', '#ec4899'];
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;

                // Mouse interaction (gentle elastic pull)
                if (mouse.active && mouse.x !== null) {
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < mouseDistance) {
                        const force = (1 - dist / mouseDistance) * 0.04;
                        this.vx += (dx / dist) * force;
                        this.vy += (dy / dist) * force;
                    }
                }

                // Damping to keep speed controlled
                this.vx *= 0.992;
                this.vy *= 0.992;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.shadowColor = this.color;
                ctx.shadowBlur = 6;
                ctx.fill();
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
            mouse.active = true;
        });

        window.addEventListener('mouseleave', () => {
            mouse.active = false;
        });

        function animateCanvas() {
            ctx.clearRect(0, 0, width, height);

            const isLight = htmlElement.getAttribute('data-theme') === 'light';
            const baseLineAlpha = isLight ? 0.08 : 0.15;

            // Connect nearby particles
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();

                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < connectDistance) {
                        const alpha = (1 - dist / connectDistance) * baseLineAlpha;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = isLight 
                            ? `rgba(139, 92, 246, ${alpha})` 
                            : `rgba(6, 182, 212, ${alpha})`;
                        ctx.lineWidth = 1;
                        ctx.shadowBlur = 0;
                        ctx.stroke();
                    }
                }

                // Connect to mouse pointer
                if (mouse.active && mouse.x !== null) {
                    const mdx = particles[i].x - mouse.x;
                    const mdy = particles[i].y - mouse.y;
                    const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
                    if (mdist < mouseDistance) {
                        const alpha = (1 - mdist / mouseDistance) * (baseLineAlpha * 1.8);
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(mouse.x, mouse.y);
                        ctx.strokeStyle = `rgba(236, 72, 153, ${alpha})`;
                        ctx.lineWidth = 1.2;
                        ctx.stroke();
                    }
                }
            }

            requestAnimationFrame(animateCanvas);
        }
        animateCanvas();
    }

    // ==========================================
    // 3. CUSTOM CURSOR & SOFT CURSOR-FOLLOW GLOW
    // ==========================================
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    const cursorGlow = document.getElementById('cursorGlow');

    if (cursorDot && cursorOutline) {
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let outlineX = mouseX;
        let outlineY = mouseY;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;

            if (cursorGlow) {
                cursorGlow.style.left = `${mouseX}px`;
                cursorGlow.style.top = `${mouseY}px`;
            }
        });

        function animateOutline() {
            // Smooth lerp trailing
            outlineX += (mouseX - outlineX) * 0.18;
            outlineY += (mouseY - outlineY) * 0.18;

            cursorOutline.style.left = `${outlineX}px`;
            cursorOutline.style.top = `${outlineY}px`;

            requestAnimationFrame(animateOutline);
        }
        animateOutline();

        // Hover expansions on interactive elements
        const hoverTargets = document.querySelectorAll('a, button, .filter-btn, .skill-pill, .cert-img-wrapper, .contact-btn');
        hoverTargets.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorOutline.style.width = '55px';
                cursorOutline.style.height = '55px';
                cursorOutline.style.borderColor = 'rgba(236, 72, 153, 0.85)';
                cursorOutline.style.backgroundColor = 'rgba(236, 72, 153, 0.1)';
            });
            el.addEventListener('mouseleave', () => {
                cursorOutline.style.width = '38px';
                cursorOutline.style.height = '38px';
                cursorOutline.style.borderColor = 'rgba(139, 92, 246, 0.6)';
                cursorOutline.style.backgroundColor = 'transparent';
            });
        });
    }

    // ==========================================
    // 4. HERO SECTION TYPING EFFECT
    // ==========================================
    const typedTextSpan = document.querySelector(".typed-text");
    if (typedTextSpan) {
        const textArray = [
            "Autonomous AI Agents",
            "Enterprise RAG Systems",
            "FastAPI & Python Backends",
            "MCP Protocol Architectures",
            "n8n Workflow Automations",
            "Production GenAI Pipelines"
        ];
        const typingDelay = 80;
        const erasingDelay = 40;
        const newTextDelay = 1800;
        let textArrayIndex = 0;
        let charIndex = 0;

        function type() {
            if (charIndex < textArray[textArrayIndex].length) {
                typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
                charIndex++;
                setTimeout(type, typingDelay);
            } else {
                setTimeout(erase, newTextDelay);
            }
        }

        function erase() {
            if (charIndex > 0) {
                typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
                charIndex--;
                setTimeout(erase, erasingDelay);
            } else {
                textArrayIndex++;
                if (textArrayIndex >= textArray.length) textArrayIndex = 0;
                setTimeout(type, typingDelay + 300);
            }
        }

        setTimeout(type, 700);
    }

    // ==========================================
    // 5. ANIMATED STAT COUNTERS
    // ==========================================
    const statCounters = document.querySelectorAll('.stat-num');
    let countersAnimated = false;

    function runCounters() {
        if (countersAnimated) return;
        countersAnimated = true;

        statCounters.forEach(counter => {
            const target = parseFloat(counter.getAttribute('data-target'));
            const suffix = counter.getAttribute('data-suffix') || '';
            const decimals = parseInt(counter.getAttribute('data-decimals') || '0', 10);
            const duration = 1800;
            const startTime = performance.now();

            function updateCounter(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                // Ease-out cubic formula
                const easeOut = 1 - Math.pow(1 - progress, 3);
                const currentVal = target * easeOut;

                if (decimals > 0) {
                    counter.textContent = currentVal.toFixed(decimals) + suffix;
                } else {
                    counter.textContent = Math.floor(currentVal) + suffix;
                }

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = (decimals > 0 ? target.toFixed(decimals) : target) + suffix;
                }
            }

            requestAnimationFrame(updateCounter);
        });
    }

    // Trigger counter when in view
    const heroStatsStrip = document.querySelector('.hero-stats-strip');
    if (heroStatsStrip) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    runCounters();
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        counterObserver.observe(heroStatsStrip);
    }

    // ==========================================
    // 6. MOUSE-FOLLOWING SPOTLIGHT & 3D TILT
    // ==========================================
    const glowCards = document.querySelectorAll('.glow-effect');
    glowCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    if (window.innerWidth > 992) {
        const tiltCards = document.querySelectorAll('.tilt-card');
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = ((y - centerY) / centerY) * -6.5;
                const rotateY = ((x - centerX) / centerX) * 6.5;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.015, 1.015, 1.015)`;
                card.style.transition = 'none';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
                card.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
            });
        });
    }

    // ==========================================
    // 7. MAGNETIC BUTTONS
    // ==========================================
    const magneticBtns = document.querySelectorAll('.magnetic');
    if (window.innerWidth > 992) {
        magneticBtns.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                btn.style.transform = `translate(${x * 0.28}px, ${y * 0.28}px)`;
                btn.style.transition = 'none';
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translate(0px, 0px)';
                btn.style.transition = 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)';
            });
        });
    }

    // ==========================================
    // 8. SCROLL REVEAL & ANIMATED SKILL BARS
    // ==========================================
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

    revealElements.forEach(el => revealObserver.observe(el));

    // Animated Skill Bars Fill
    const skillBarsCard = document.querySelector('.skill-bars-card');
    const skillFills = document.querySelectorAll('.skill-fill');

    if (skillBarsCard && skillFills.length) {
        const skillObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    skillFills.forEach(fill => {
                        const progress = fill.getAttribute('data-progress');
                        fill.style.width = progress;
                    });
                    skillObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.25 });
        skillObserver.observe(skillBarsCard);
    }

    // ==========================================
    // 9. TIMELINE LINE DRAWING ON SCROLL
    // ==========================================
    const experienceTimeline = document.getElementById('experienceTimeline');
    const timelineProgress = document.getElementById('timelineProgress');

    function updateTimelineDraw() {
        if (!experienceTimeline || !timelineProgress) return;

        const rect = experienceTimeline.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Calculate how much of the timeline has scrolled through the viewport
        const start = windowHeight * 0.75;
        const totalHeight = rect.height;
        const currentScroll = start - rect.top;

        let pct = (currentScroll / totalHeight) * 100;
        pct = Math.max(0, Math.min(100, pct));

        timelineProgress.style.height = `${pct}%`;
    }

    window.addEventListener('scroll', updateTimelineDraw);

    // ==========================================
    // 10. SCROLL PROGRESS BAR & BACK TO TOP
    // ==========================================
    const scrollProgress = document.getElementById('scrollProgress');
    const backToTopBtn = document.getElementById('backToTop');
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        // Top reading progress bar
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (totalHeight > 0) {
            const progress = (window.scrollY / totalHeight) * 100;
            if (scrollProgress) scrollProgress.style.width = `${progress}%`;
        }

        // Back to top visibility
        if (backToTopBtn) {
            if (window.scrollY > 400) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }

        // Sticky navbar background
        if (navbar) {
            if (window.scrollY > 40) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    });

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ==========================================
    // 11. ACTIVE NAVIGATION HIGHLIGHT ON SCROLL
    // ==========================================
    const sections = document.querySelectorAll('section[id], header[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function updateActiveNav() {
        const scrollPosition = window.scrollY + 200;
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    window.addEventListener('scroll', updateActiveNav);

    // ==========================================
    // 12. PROJECT FILTER TABS WITH COUNTS
    // ==========================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (filterButtons.length && projectCards.length) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                const filterValue = button.getAttribute('data-filter');

                projectCards.forEach(card => {
                    const categories = card.getAttribute('data-category') || '';
                    if (filterValue === 'all' || categories.includes(filterValue)) {
                        card.style.display = 'flex';
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(15px)';
                        setTimeout(() => {
                            card.style.transition = 'all 0.35s ease';
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 30);
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // ==========================================
    // 13. MOBILE NAVIGATION MENU
    // ==========================================
    const mobileToggle = document.getElementById('mobileToggle');
    const mobileMenu = document.getElementById('mobileMenu');

    if (mobileToggle && mobileMenu) {
        mobileToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            const icon = mobileToggle.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-xmark');
            }
        });

        // Close on link click
        const mobileLinks = mobileMenu.querySelectorAll('.mobile-link');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                const icon = mobileToggle.querySelector('i');
                if (icon) {
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-xmark');
                }
            });
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!mobileMenu.contains(e.target) && !mobileToggle.contains(e.target) && mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                const icon = mobileToggle.querySelector('i');
                if (icon) {
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-xmark');
                }
            }
        });
    }

    // ==========================================
    // 14. UNIVERSAL CERTIFICATE MODAL VIEWER
    // ==========================================
    const certModal = document.getElementById('certModal');
    const modalImg = document.getElementById('modalImg');
    const modalTitle = document.getElementById('modalCertTitle');
    const modalIssuer = document.getElementById('modalCertIssuer');
    const modalID = document.getElementById('modalCertID');
    const modalLink = document.getElementById('modalCertLink');
    const modalCloseBtn = document.querySelector('.modal-close');

    window.openCertModal = function(imgSrc, title, issuer, certId, verifyUrl) {
        if (!certModal) return;
        
        if (modalImg) modalImg.src = imgSrc;
        if (modalTitle) modalTitle.textContent = title;
        if (modalIssuer) modalIssuer.textContent = `Issuing Organization: ${issuer}`;
        
        if (modalID) {
            if (certId && certId !== '#') {
                modalID.style.display = 'block';
                modalID.innerHTML = `Credential ID: <code>${certId}</code>`;
            } else {
                modalID.style.display = 'none';
            }
        }

        if (modalLink) {
            if (verifyUrl && verifyUrl !== '#') {
                modalLink.style.display = 'inline-flex';
                modalLink.href = verifyUrl;
            } else {
                modalLink.style.display = 'none';
            }
        }

        certModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    function closeCertModal() {
        if (certModal) {
            certModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeCertModal);
    if (certModal) {
        certModal.addEventListener('click', (e) => {
            if (e.target === certModal) closeCertModal();
        });
    }
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && certModal && certModal.classList.contains('active')) {
            closeCertModal();
        }
    });

});
