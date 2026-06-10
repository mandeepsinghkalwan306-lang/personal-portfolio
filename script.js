document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. SMOOTH SCROLLING FOR NAVIGATION LINKS
    // ==========================================
    const navLinks = document.querySelectorAll('.nav-links a, .btn');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            
            // Only handle internal anchor links
            if (targetId && targetId.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    // Account for fixed header height offset (4.5rem = 72px)
                    const headerOffset = 72;
                    const elementPosition = targetSection.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.scrollY - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // ==========================================
    // 2. ACTIVE NAVIGATION HIGHLIGHT ON SCROLL
    // ==========================================
    const sections = document.querySelectorAll('section[id]');
    const headerOffset = 80; // Buffer for intersection trigger

    const activeScrollSpy = () => {
        const currentScrollY = window.scrollY;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - headerOffset;
            const sectionId = current.getAttribute('id');
            const correspondingNavLink = document.querySelector(`.nav-links a[href*="${sectionId}"]`);

            if (correspondingNavLink) {
                if (currentScrollY > sectionTop && currentScrollY <= sectionTop + sectionHeight) {
                    correspondingNavLink.style.color = 'var(--accent)';
                    correspondingNavLink.style.fontWeight = '600';
                } else {
                    correspondingNavLink.style.color = 'var(--text-muted)';
                    correspondingNavLink.style.fontWeight = '500';
                }
            }
        });
    };

    window.addEventListener('scroll', activeScrollSpy);


    // ==========================================
    // 3. ANIMATE SKILL METERS ON VIEWPORT ENTER
    // ==========================================
    const skillCards = document.querySelectorAll('.skill-card');
    
    const animateSkills = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target.querySelector('.progress-fill');
                const progressLabel = entry.target.querySelector('.progress-label');
                
                if (progressBar && progressLabel) {
                    // Extract numeric target value from inline style (e.g., "90%")
                    const targetValue = parseInt(progressBar.style.width, 10);
                    
                    // Reset initial layout properties before rendering step
                    progressBar.style.width = '0%';
                    let currentCount = 0;
                    
                    // Smooth mathematical easing interval for number counting
                    const countInterval = setInterval(() => {
                        if (currentCount >= targetValue) {
                            clearInterval(countInterval);
                        } else {
                            currentCount++;
                            progressLabel.textContent = `${currentCount}%`;
                            progressBar.style.width = `${currentCount}%`;
                        }
                    }, 15); // Controls overall speed of fill transition
                }
                // Unobserve target after firing to guarantee execution happens only once
                observer.unobserve(entry.target);
            }
        });
    };

    // Utilizing IntersectionObserver API for performant view tracking
    const skillObserver = new IntersectionObserver(animateSkills, {
        root: null,
        threshold: 0.15 // Fires when 15% of the card is visible
    });

    skillCards.forEach(card => skillObserver.observe(card));
});