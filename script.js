document.addEventListener('DOMContentLoaded', () => {
    // 1. Custom Cursor Animation
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    if (cursorDot && cursorOutline) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            // Smooth trailing effect for the outline
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 150, fill: "forwards" });
        });

        // Hover scale for interactive elements
        const hoverSelector = 'a, button, .filter-btn, .skill-pill, .cert-img-wrapper, .btn-primary, .btn-secondary, .btn-whatsapp, .btn-playstore, .contact-btn';
        const hoverElements = document.querySelectorAll(hoverSelector);
        
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorOutline.style.width = '55px';
                cursorOutline.style.height = '55px';
                cursorOutline.style.borderColor = 'rgba(59, 130, 246, 0.8)';
                cursorOutline.style.backgroundColor = 'rgba(59, 130, 246, 0.12)';
            });
            el.addEventListener('mouseleave', () => {
                cursorOutline.style.width = '38px';
                cursorOutline.style.height = '38px';
                cursorOutline.style.borderColor = 'rgba(139, 92, 246, 0.5)';
                cursorOutline.style.backgroundColor = 'transparent';
            });
        });
    }

    // 2. Typing Effect for Hero Section
    const typedTextSpan = document.querySelector(".typed-text");
    if (typedTextSpan) {
        const textArray = [
            "Intelligent AI Systems",
            "LLM & RAG Pipelines",
            "FastAPI & Python Backends",
            "Autonomous AI Agents",
            "n8n Workflow Automation",
            "MCP Server Architectures",
            "Full Stack AI Applications"
        ];
        const typingDelay = 90;
        const erasingDelay = 45;
        const newTextDelay = 1900;
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
                setTimeout(type, typingDelay + 400);
            }
        }

        if (textArray.length) setTimeout(type, 800);
    }

    // 3. Mouse-tracking Glow Border Effect for Premium Cards
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

    // 4. Vanilla 3D Tilt Effect on Desktop
    if (window.innerWidth > 992) {
        const tiltCards = document.querySelectorAll('.tilt-card');
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = ((y - centerY) / centerY) * -8;
                const rotateY = ((x - centerX) / centerX) * 8;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
                card.style.transition = 'none';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
                card.style.transition = 'transform 0.4s ease';
            });
        });
    }

    // 5. Sticky Navbar Scroll State
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 40) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // 6. Mobile Navigation Menu Toggle
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

        // Close when clicking outside
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

    // 7. Interactive Project Category Filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (filterButtons.length && projectCards.length) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Update active state
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

    // 8. Universal Certificate Modal Viewer
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
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    };

    function closeCertModal() {
        if (certModal) {
            certModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeCertModal);
    }

    if (certModal) {
        certModal.addEventListener('click', (e) => {
            if (e.target === certModal) {
                closeCertModal();
            }
        });
    }

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && certModal && certModal.classList.contains('active')) {
            closeCertModal();
        }
    });

    // 9. Active Navigation Link Highlighting on Scroll
    const sections = document.querySelectorAll('section[id], header[id]');
    const navItems = document.querySelectorAll('.nav-links a');

    function updateActiveNav() {
        const scrollPosition = window.scrollY + 180;
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navItems.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav);
});
