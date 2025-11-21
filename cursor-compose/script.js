// Time Machine Simulator - Interactive Controls

class TimeMachine {
    constructor() {
        this.currentTime = new Date();
        this.targetTime = new Date();
        this.isTraveling = false;
        this.particles = [];
        
        this.initializeElements();
        this.setupEventListeners();
        this.updateDisplay();
        this.startAnimationLoop();
        this.createDataStreams();
    }
    
    initializeElements() {
        // Time display elements
        this.currentTimeEl = document.getElementById('currentTime');
        this.targetTimeEl = document.getElementById('targetTime');
        
        // Sliders
        this.yearSlider = document.getElementById('yearSlider');
        this.monthSlider = document.getElementById('monthSlider');
        this.daySlider = document.getElementById('daySlider');
        
        // Slider values
        this.yearValue = document.getElementById('yearValue');
        this.monthValue = document.getElementById('monthValue');
        this.dayValue = document.getElementById('dayValue');
        
        // Buttons
        this.travelBtn = document.getElementById('travelBtn');
        this.resetBtn = document.getElementById('resetBtn');
        
        // Status
        this.statusLight = document.getElementById('statusLight');
        this.statusText = document.getElementById('statusText');
        
        // Portal
        this.portalCore = document.getElementById('portalCore');
        this.particlesContainer = document.getElementById('particlesContainer');
        this.timelineMarker = document.getElementById('timelineMarker');
        this.distortionOverlay = document.getElementById('distortionOverlay');
        this.rippleContainer = document.getElementById('rippleContainer');
        this.particleConnections = document.getElementById('particleConnections');
        this.currentTimeEl = document.getElementById('currentTime');
        this.targetTimeEl = document.getElementById('targetTime');
        this.chromaticOverlay = document.getElementById('chromaticOverlay');
        
        // Initialize particle connections SVG
        this.setupParticleConnections();
        this.createTitleParticles();
        
        // Initialize sliders
        this.yearSlider.value = this.currentTime.getFullYear();
        this.monthSlider.value = this.currentTime.getMonth() + 1;
        this.daySlider.value = this.currentTime.getDate();
    }
    
    setupEventListeners() {
        // Slider updates
        this.yearSlider.addEventListener('input', () => {
            this.yearValue.textContent = this.yearSlider.value;
            this.updateTargetTime();
            this.updateSliderProgress();
        });
        
        this.monthSlider.addEventListener('input', () => {
            this.monthValue.textContent = this.formatNumber(this.monthSlider.value);
            this.updateTargetTime();
            this.updateDaySliderMax();
            this.updateSliderProgress();
        });
        
        this.daySlider.addEventListener('input', () => {
            this.dayValue.textContent = this.formatNumber(this.daySlider.value);
            this.updateTargetTime();
            this.updateSliderProgress();
        });
        
        // Buttons
        this.travelBtn.addEventListener('click', () => this.initiateTravel());
        this.resetBtn.addEventListener('click', () => this.reset());
        
        // Initial day slider max update
        this.updateDaySliderMax();
        this.updateSliderProgress();
    }
    
    updateSliderProgress() {
        const yearProgress = ((this.yearSlider.value - this.yearSlider.min) / (this.yearSlider.max - this.yearSlider.min)) * 100;
        const monthProgress = ((this.monthSlider.value - this.monthSlider.min) / (this.monthSlider.max - this.monthSlider.min)) * 100;
        const dayProgress = ((this.daySlider.value - this.daySlider.min) / (this.daySlider.max - this.daySlider.min)) * 100;
        
        this.yearSlider.style.setProperty('--slider-progress', `${yearProgress}%`);
        this.monthSlider.style.setProperty('--slider-progress', `${monthProgress}%`);
        this.daySlider.style.setProperty('--slider-progress', `${dayProgress}%`);
    }
    
    formatNumber(num) {
        return num.toString().padStart(2, '0');
    }
    
    formatDateTime(date) {
        const year = date.getFullYear();
        const month = this.formatNumber(date.getMonth() + 1);
        const day = this.formatNumber(date.getDate());
        const hours = this.formatNumber(date.getHours());
        const minutes = this.formatNumber(date.getMinutes());
        const seconds = this.formatNumber(date.getSeconds());
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
    
    updateDaySliderMax() {
        const year = parseInt(this.yearSlider.value);
        const month = parseInt(this.monthSlider.value);
        const daysInMonth = new Date(year, month, 0).getDate();
        this.daySlider.max = daysInMonth;
        
        if (parseInt(this.daySlider.value) > daysInMonth) {
            this.daySlider.value = daysInMonth;
            this.dayValue.textContent = this.formatNumber(daysInMonth);
        }
    }
    
    updateTargetTime() {
        const year = parseInt(this.yearSlider.value);
        const month = parseInt(this.monthSlider.value) - 1;
        const day = parseInt(this.daySlider.value);
        
        this.targetTime = new Date(year, month, day, 
            this.currentTime.getHours(), 
            this.currentTime.getMinutes(), 
            this.currentTime.getSeconds());
        
        this.targetTimeEl.textContent = this.formatDateTime(this.targetTime);
    }
    
    updateDisplay() {
        const currentTimeStr = this.formatDateTime(this.currentTime);
        const targetTimeStr = this.formatDateTime(this.targetTime);
        
        this.currentTimeEl.textContent = currentTimeStr;
        this.targetTimeEl.textContent = targetTimeStr;
        
        // Update shadow elements
        const currentShadow = this.currentTimeEl.parentElement.querySelector('.time-value-shadow');
        const targetShadow = this.targetTimeEl.parentElement.querySelector('.time-value-shadow');
        if (currentShadow) currentShadow.textContent = currentTimeStr;
        if (targetShadow) targetShadow.textContent = targetTimeStr;
    }
    
    async initiateTravel() {
        if (this.isTraveling) return;
        
        // Safety checks
        if (!this.statusLight || !this.statusText || !this.travelBtn || !this.portalCore) {
            console.error('Time machine elements not initialized');
            return;
        }
        
        this.isTraveling = true;
        this.statusLight.classList.add('traveling');
        this.statusText.textContent = 'TRAVELING';
        this.travelBtn.classList.add('active');
        this.portalCore.classList.add('active');
        if (this.distortionOverlay) {
            this.distortionOverlay.classList.add('active');
        }
        if (this.chromaticOverlay) {
            this.chromaticOverlay.classList.add('active');
        }
        
        // Add traveling class to body for global effects
        document.body.classList.add('traveling');
        
        // Create enhanced particle explosion
        this.createParticleExplosion();
        this.createEnergyRipples();
        
        // Store interval reference for cleanup
        this.particleInterval = setInterval(() => {
            if (!this.isTraveling) {
                clearInterval(this.particleInterval);
                return;
            }
            this.createContinuousParticles();
            this.createPortalSparkles();
            // Throttle connection updates
            if (Math.random() > 0.5) {
                this.updateConnections();
            }
        }, 150);
        
        // Update slider progress
        this.updateSliderProgress();
        
        // Animate timeline marker
        const timeDiff = this.targetTime.getTime() - this.currentTime.getTime();
        const maxDiff = 100 * 365 * 24 * 60 * 60 * 1000; // 100 years
        const progress = Math.min(Math.abs(timeDiff) / maxDiff, 1);
        const newPosition = timeDiff > 0 ? 50 + (progress * 25) : 50 - (progress * 25);
        this.timelineMarker.style.left = `${newPosition}%`;
        
        // Simulate time travel
        await this.animateTimeTravel();
        
        // Update current time
        this.currentTime = new Date(this.targetTime);
        this.updateDisplay();
        
        // Create arrival effect
        this.createArrivalEffect();
        
        // Clear particle interval
        if (this.particleInterval) {
            clearInterval(this.particleInterval);
            this.particleInterval = null;
        }
        
        // Reset UI
        setTimeout(() => {
            this.isTraveling = false;
            this.statusLight.classList.remove('traveling');
            this.statusLight.classList.add('active');
            this.statusText.textContent = 'ARRIVED';
            this.travelBtn.classList.remove('active');
            this.portalCore.classList.remove('active');
            this.distortionOverlay.classList.remove('active');
            if (this.chromaticOverlay) {
                this.chromaticOverlay.classList.remove('active');
            }
            document.body.classList.remove('traveling');
            
            // Clear connections
            if (this.particleConnections) {
                this.particleConnections.innerHTML = '';
            }
            
            setTimeout(() => {
                this.statusLight.classList.remove('active');
                this.statusText.textContent = 'STANDBY';
            }, 2000);
        }, 500);
    }
    
    async animateTimeTravel() {
        return new Promise((resolve) => {
            const duration = 3000;
            const startTime = Date.now();
            const startYear = this.currentTime.getFullYear();
            const targetYear = this.targetTime.getFullYear();
            const yearDiff = targetYear - startYear;
            
            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing function
                const eased = this.easeInOutCubic(progress);
                
                // Interpolate year
                const currentYear = Math.round(startYear + (yearDiff * eased));
                
                // Update display with animated year
                const animatedDate = new Date(this.currentTime);
                animatedDate.setFullYear(currentYear);
                this.currentTimeEl.textContent = this.formatDateTime(animatedDate);
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    resolve();
                }
            };
            
            animate();
        });
    }
    
    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }
    
    createParticleExplosion() {
        if (!this.portalCore || !this.particlesContainer) return;
        
        const particleCount = 250; // Reduced from 400 to prevent performance issues
        const portalRect = this.portalCore.getBoundingClientRect();
        if (!portalRect.width || !portalRect.height) return; // Safety check
        
        const centerX = portalRect.left + portalRect.width / 2;
        const centerY = portalRect.top + portalRect.height / 2;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            const particleType = Math.random();
            
            if (particleType < 0.3) {
                particle.className = 'particle particle-large';
            } else if (particleType < 0.6) {
                particle.className = 'particle particle-energy';
            } else {
                particle.className = 'particle';
            }
            
            const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.5;
            const distance = 100 + Math.random() * 400;
            const speed = 1 + Math.random() * 2;
            
            const x = centerX + Math.cos(angle) * distance;
            const y = centerY + Math.sin(angle) * distance;
            
            particle.style.left = `${centerX}px`;
            particle.style.top = `${centerY}px`;
            
            // Random color with more variety
            const colors = [
                { bg: '#00ffff', shadow: '0 0 15px #00ffff, 0 0 30px #00ffff' },
                { bg: '#ff00ff', shadow: '0 0 15px #ff00ff, 0 0 30px #ff00ff' },
                { bg: '#ffff00', shadow: '0 0 15px #ffff00, 0 0 30px #ffff00' },
                { bg: '#00ff00', shadow: '0 0 15px #00ff00, 0 0 30px #00ff00' },
                { bg: '#ff6600', shadow: '0 0 15px #ff6600, 0 0 30px #ff6600' }
            ];
            const color = colors[Math.floor(Math.random() * colors.length)];
            particle.style.background = color.bg;
            particle.style.boxShadow = color.shadow;
            
            // Add trail for some particles
            if (Math.random() > 0.7) {
                const trail = document.createElement('div');
                trail.className = 'particle-trail';
                trail.style.background = `linear-gradient(to bottom, ${color.bg}, transparent)`;
                trail.style.left = `${centerX}px`;
                trail.style.top = `${centerY}px`;
                trail.style.transformOrigin = 'center bottom';
                this.particlesContainer.appendChild(trail);
                
                setTimeout(() => {
                    trail.style.transition = `all ${speed}s ease-out`;
                    trail.style.left = `${x}px`;
                    trail.style.top = `${y}px`;
                    trail.style.opacity = '0';
                    trail.style.transform = `rotate(${angle * 180 / Math.PI}deg)`;
                    
                    setTimeout(() => trail.remove(), speed * 1000);
                }, 10);
            }
            
            this.particlesContainer.appendChild(particle);
            
            // Animate particle with rotation
            setTimeout(() => {
                particle.style.transition = `all ${speed}s ease-out`;
                particle.style.left = `${x}px`;
                particle.style.top = `${y}px`;
                particle.style.opacity = '0';
                particle.style.transform = `scale(0) rotate(${Math.random() * 720}deg)`;
                
                setTimeout(() => {
                    particle.remove();
                }, speed * 1000);
            }, 10);
        }
    }
    
    createContinuousParticles() {
        if (!this.portalCore || !this.particlesContainer) return;
        
        const portalRect = this.portalCore.getBoundingClientRect();
        if (!portalRect.width || !portalRect.height) return; // Safety check
        
        const centerX = portalRect.left + portalRect.width / 2;
        const centerY = portalRect.top + portalRect.height / 2;
        
        for (let i = 0; i < 5; i++) {
            const particle = document.createElement('div');
            particle.className = Math.random() > 0.5 ? 'particle particle-energy' : 'particle';
            
            const angle = Math.random() * Math.PI * 2;
            const distance = 50 + Math.random() * 150;
            const speed = 0.5 + Math.random() * 1;
            
            const x = centerX + Math.cos(angle) * distance;
            const y = centerY + Math.sin(angle) * distance;
            
            particle.style.left = `${centerX}px`;
            particle.style.top = `${centerY}px`;
            
            const colors = ['#00ffff', '#ff00ff', '#ffff00'];
            const color = colors[Math.floor(Math.random() * colors.length)];
            particle.style.background = color;
            particle.style.boxShadow = `0 0 10px ${color}`;
            
            this.particlesContainer.appendChild(particle);
            
            setTimeout(() => {
                particle.style.transition = `all ${speed}s ease-out`;
                particle.style.left = `${x}px`;
                particle.style.top = `${y}px`;
                particle.style.opacity = '0';
                particle.style.transform = `scale(0)`;
                
                setTimeout(() => particle.remove(), speed * 1000);
            }, 10);
        }
    }
    
    createEnergyRipples() {
        if (!this.portalCore || !this.rippleContainer) return;
        
        const portalRect = this.portalCore.getBoundingClientRect();
        if (!portalRect.width || !portalRect.height) return; // Safety check
        
        const centerX = portalRect.left + portalRect.width / 2;
        const centerY = portalRect.top + portalRect.height / 2;
        
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const ripple = document.createElement('div');
                ripple.className = 'ripple';
                ripple.style.left = `${centerX}px`;
                ripple.style.top = `${centerY}px`;
                ripple.style.borderColor = i % 2 === 0 ? '#00ffff' : '#ff00ff';
                ripple.style.boxShadow = `0 0 20px ${i % 2 === 0 ? '#00ffff' : '#ff00ff'}`;
                
                this.rippleContainer.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 2000);
            }, i * 200);
        }
    }
    
    createArrivalEffect() {
        if (!this.portalCore || !this.particlesContainer) return;
        
        const portalRect = this.portalCore.getBoundingClientRect();
        if (!portalRect.width || !portalRect.height) return; // Safety check
        
        const centerX = portalRect.left + portalRect.width / 2;
        const centerY = portalRect.top + portalRect.height / 2;
        
        // Create inward particle effect
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle particle-energy';
            
            const angle = Math.random() * Math.PI * 2;
            const distance = 200 + Math.random() * 300;
            const startX = centerX + Math.cos(angle) * distance;
            const startY = centerY + Math.sin(angle) * distance;
            
            particle.style.left = `${startX}px`;
            particle.style.top = `${startY}px`;
            
            const colors = ['#00ffff', '#ff00ff', '#ffff00'];
            const color = colors[Math.floor(Math.random() * colors.length)];
            particle.style.background = color;
            particle.style.boxShadow = `0 0 15px ${color}`;
            
            this.particlesContainer.appendChild(particle);
            
            setTimeout(() => {
                particle.style.transition = 'all 1s ease-in';
                particle.style.left = `${centerX}px`;
                particle.style.top = `${centerY}px`;
                particle.style.opacity = '0';
                particle.style.transform = 'scale(0)';
                
                setTimeout(() => particle.remove(), 1000);
            }, 10);
        }
    }
    
    createDataStreams() {
        // Data streams are created via CSS animation
        // This method can be used for additional dynamic effects
    }
    
    setupParticleConnections() {
        // Create connections between particles
        this.connectionLines = [];
        this.updateConnections();
    }
    
    updateConnections() {
        if (!this.particleConnections || !this.isTraveling) return;
        
        // Throttle updates to prevent performance issues
        if (this._connectionUpdatePending) return;
        this._connectionUpdatePending = true;
        
        requestAnimationFrame(() => {
            this._connectionUpdatePending = false;
            
            // Clear existing connections
            this.particleConnections.innerHTML = '';
            
            // Get all active particles (limit to prevent performance issues)
            const allParticles = Array.from(this.particlesContainer.querySelectorAll('.particle'));
            const particles = allParticles.slice(0, 50); // Limit to 50 particles for connections
            
            if (particles.length < 2) return;
            
            // Create connections between nearby particles
            for (let i = 0; i < particles.length; i++) {
                const p1 = particles[i];
                if (!p1.parentNode) continue; // Skip if removed
                
                const rect1 = p1.getBoundingClientRect();
                const x1 = rect1.left + rect1.width / 2;
                const y1 = rect1.top + rect1.height / 2;
                
                // Only check nearby particles (limit checks)
                const maxChecks = Math.min(i + 10, particles.length);
                for (let j = i + 1; j < maxChecks; j++) {
                    const p2 = particles[j];
                    if (!p2.parentNode) continue; // Skip if removed
                    
                    const rect2 = p2.getBoundingClientRect();
                    const x2 = rect2.left + rect2.width / 2;
                    const y2 = rect2.top + rect2.height / 2;
                    
                    const dx = x2 - x1;
                    const dy = y2 - y1;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    // Only connect particles within 150px and randomly
                    if (distance < 150 && Math.random() > 0.8) {
                        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                        line.setAttribute('x1', x1);
                        line.setAttribute('y1', y1);
                        line.setAttribute('x2', x2);
                        line.setAttribute('y2', y2);
                        line.setAttribute('class', 'connection-line');
                        this.particleConnections.appendChild(line);
                        
                        // Remove line after delay
                        setTimeout(() => {
                            if (line.parentNode) {
                                line.remove();
                            }
                        }, 1500);
                    }
                }
            }
        });
    }
    
    createTimeParticles() {
        const timeDisplays = document.querySelectorAll('.current-time, .target-time');
        
        timeDisplays.forEach(display => {
            const particlesContainer = display.querySelector('.time-particles');
            if (!particlesContainer) return;
            
            for (let i = 0; i < 3; i++) {
                const particle = document.createElement('div');
                particle.className = 'time-particle';
                const x = Math.random() * 100;
                particle.style.left = `${x}%`;
                particle.style.setProperty('--particle-x', `${(Math.random() - 0.5) * 50}px`);
                particle.style.animationDelay = `${Math.random() * 2}s`;
                particlesContainer.appendChild(particle);
                
                setTimeout(() => {
                    if (particle.parentNode) {
                        particle.remove();
                    }
                }, 4000);
            }
        });
    }
    
    createPortalSparkles() {
        const portalCore = this.portalCore;
        if (!portalCore || !portalCore.classList.contains('active')) return;
        
        const sparklesContainer = portalCore.querySelector('.portal-sparkles');
        if (!sparklesContainer) return;
        
        for (let i = 0; i < 8; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'portal-sparkle';
            
            const angle = Math.random() * Math.PI * 2;
            const distance = 50 + Math.random() * 120;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;
            
            sparkle.style.setProperty('--sparkle-x', `${x}px`);
            sparkle.style.setProperty('--sparkle-y', `${y}px`);
            sparkle.style.left = '50%';
            sparkle.style.top = '50%';
            sparkle.style.animationDelay = `${Math.random() * 2}s`;
            
            const colors = ['#00ffff', '#ff00ff', '#ffff00', '#00ff00', '#ff6600'];
            const color = colors[Math.floor(Math.random() * colors.length)];
            sparkle.style.background = color;
            sparkle.style.boxShadow = `0 0 15px ${color}`;
            
            sparklesContainer.appendChild(sparkle);
            
            setTimeout(() => {
                if (sparkle.parentNode) {
                    sparkle.remove();
                }
            }, 2000);
        }
        
        // Create lightning bolts
        this.createLightningBolts();
    }
    
    createLightningBolts() {
        const portalCore = this.portalCore;
        if (!portalCore || !portalCore.classList.contains('active')) return;
        
        const lightningContainer = portalCore.querySelector('.portal-lightning');
        if (!lightningContainer) return;
        
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                const bolt = document.createElement('div');
                bolt.className = 'lightning-bolt';
                
                const angle = Math.random() * Math.PI * 2;
                const distance = 80 + Math.random() * 60;
                const x = 50 + Math.cos(angle) * (distance / 150) * 100;
                const y = 50 + Math.sin(angle) * (distance / 150) * 100;
                
                bolt.style.left = `${x}%`;
                bolt.style.top = `${y}%`;
                bolt.style.transform = `rotate(${angle * 180 / Math.PI}deg)`;
                bolt.style.animationDelay = `${Math.random() * 0.1}s`;
                
                lightningContainer.appendChild(bolt);
                
                setTimeout(() => {
                    if (bolt.parentNode) {
                        bolt.remove();
                    }
                }, 200);
            }, i * 100);
        }
    }
    
    createTitleParticles() {
        const titleParticlesContainer = document.querySelector('.title-particles');
        if (!titleParticlesContainer) return;
        
        setInterval(() => {
            if (Math.random() > 0.7) {
                const particle = document.createElement('div');
                particle.className = 'title-particle';
                
                const startX = Math.random() * 100;
                const endX = startX + (Math.random() - 0.5) * 100;
                const endY = -50 + Math.random() * -50;
                
                particle.style.left = `${startX}%`;
                particle.style.top = '50%';
                particle.style.setProperty('--title-particle-x', `${endX - startX}%`);
                particle.style.setProperty('--title-particle-y', `${endY}%`);
                particle.style.animationDelay = `${Math.random() * 2}s`;
                
                const colors = ['#00ffff', '#ff00ff', '#ffff00'];
                const color = colors[Math.floor(Math.random() * colors.length)];
                particle.style.background = color;
                particle.style.boxShadow = `0 0 8px ${color}`;
                
                titleParticlesContainer.appendChild(particle);
                
                setTimeout(() => {
                    if (particle.parentNode) {
                        particle.remove();
                    }
                }, 4000);
            }
        }, 3000);
    }
    
    reset() {
        if (this.isTraveling) return;
        
        // Clear any intervals
        if (this.particleInterval) {
            clearInterval(this.particleInterval);
            this.particleInterval = null;
        }
        
        // Clear connections
        if (this.particleConnections) {
            this.particleConnections.innerHTML = '';
        }
        
        this.currentTime = new Date();
        this.targetTime = new Date();
        
        this.yearSlider.value = this.currentTime.getFullYear();
        this.monthSlider.value = this.currentTime.getMonth() + 1;
        this.daySlider.value = this.currentTime.getDate();
        
        this.yearValue.textContent = this.yearSlider.value;
        this.monthValue.textContent = this.formatNumber(this.monthSlider.value);
        this.dayValue.textContent = this.formatNumber(this.daySlider.value);
        
        this.updateDaySliderMax();
        this.updateTargetTime();
        this.updateDisplay();
        
        this.timelineMarker.style.left = '50%';
        
        this.statusLight.classList.remove('active', 'traveling');
        this.statusText.textContent = 'STANDBY';
    }
    
    startAnimationLoop() {
        // Update current time display every second
        setInterval(() => {
            if (!this.isTraveling) {
                this.currentTime = new Date();
                this.updateDisplay();
            }
        }, 1000);
        
        // Create occasional ambient particles (more frequent)
        setInterval(() => {
            if (!this.isTraveling && Math.random() > 0.5) {
                this.createAmbientParticle();
            }
        }, 1500);
        
        // Add subtle portal glow animation
        setInterval(() => {
            if (!this.isTraveling && Math.random() > 0.8) {
                this.createPortalGlow();
            }
        }, 3000);
        
        // Create time display particles
        setInterval(() => {
            if (!this.isTraveling) {
                this.createTimeParticles();
            }
        }, 2000);
        
        // Update particle connections periodically (only when traveling)
        // Removed to prevent performance issues - connections are handled in travel loop
    }
    
    createPortalGlow() {
        if (!this.portalCore || !this.particlesContainer) return;
        
        const portalRect = this.portalCore.getBoundingClientRect();
        if (!portalRect.width || !portalRect.height) return; // Safety check
        
        const centerX = portalRect.left + portalRect.width / 2;
        const centerY = portalRect.top + portalRect.height / 2;
        
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.className = 'particle particle-energy';
                
                const angle = Math.random() * Math.PI * 2;
                const distance = 30 + Math.random() * 50;
                const x = centerX + Math.cos(angle) * distance;
                const y = centerY + Math.sin(angle) * distance;
                
                particle.style.left = `${centerX}px`;
                particle.style.top = `${centerY}px`;
                particle.style.opacity = '0.6';
                
                const colors = ['#00ffff', '#ff00ff'];
                const color = colors[Math.floor(Math.random() * colors.length)];
                particle.style.background = color;
                particle.style.boxShadow = `0 0 10px ${color}`;
                
                this.particlesContainer.appendChild(particle);
                
                setTimeout(() => {
                    particle.style.transition = 'all 2s ease-out';
                    particle.style.left = `${x}px`;
                    particle.style.top = `${y}px`;
                    particle.style.opacity = '0';
                    particle.style.transform = 'scale(0)';
                    
                    setTimeout(() => particle.remove(), 2000);
                }, 10);
            }, i * 100);
        }
    }
    
    createAmbientParticle() {
        const particle = document.createElement('div');
        const particleType = Math.random();
        
        if (particleType < 0.3) {
            particle.className = 'particle particle-energy';
        } else {
            particle.className = 'particle';
        }
        
        const startX = Math.random() * window.innerWidth;
        const startY = window.innerHeight;
        const endY = -10;
        const duration = 3000 + Math.random() * 3000;
        const drift = (Math.random() - 0.5) * 100;
        
        particle.style.left = `${startX}px`;
        particle.style.top = `${startY}px`;
        particle.style.opacity = '0.4';
        
        const colors = ['#00ffff', '#ff00ff', '#ffff00'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        particle.style.background = color;
        particle.style.boxShadow = `0 0 10px ${color}`;
        
        this.particlesContainer.appendChild(particle);
        
        setTimeout(() => {
            particle.style.transition = `all ${duration}ms linear`;
            particle.style.top = `${endY}px`;
            particle.style.left = `${startX + drift}px`;
            particle.style.opacity = '0';
            particle.style.transform = `rotate(${Math.random() * 360}deg)`;
            
            setTimeout(() => {
                particle.remove();
            }, duration);
        }, 10);
    }
}

// Initialize Time Machine when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TimeMachine();
});

// Add some interactive hover effects
document.addEventListener('DOMContentLoaded', () => {
    const controlPanel = document.querySelector('.control-panel');
    const portalContainer = document.querySelector('.portal-container');
    
    // Enhanced 3D tilt effect on mouse move
    let mouseX = 0.5;
    let mouseY = 0.5;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX / window.innerWidth;
        mouseY = e.clientY / window.innerHeight;
        
        const rotateX = (mouseY - 0.5) * 15;
        const rotateY = (mouseX - 0.5) * -15;
        
        controlPanel.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
        portalContainer.style.transform = `translateY(-50%) rotateX(${rotateX * 0.6}deg) rotateY(${rotateY * 0.6}deg) translateZ(30px)`;
        
        // Parallax effect for ambient lights
        const lights = document.querySelectorAll('.light');
        lights.forEach((light, index) => {
            const offsetX = (mouseX - 0.5) * (20 + index * 10);
            const offsetY = (mouseY - 0.5) * (20 + index * 10);
            light.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
        });
    });
    
    // Reset transform on mouse leave
    document.addEventListener('mouseleave', () => {
        controlPanel.style.transform = '';
        portalContainer.style.transform = 'translateY(-50%)';
    });
});

