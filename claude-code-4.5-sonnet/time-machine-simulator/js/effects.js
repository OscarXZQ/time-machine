class ScreenEffects {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.scanlines = [];
        this.glitchActive = false;
        this.matrixDrops = [];
        
        this.init();
        this.createScanlines();
        this.createMatrixDrops();
        this.animate();
    }
    
    init() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '1000';
        this.canvas.style.mixBlendMode = 'overlay';
        this.canvas.style.opacity = '0.4';
        
        this.resize();
        document.body.appendChild(this.canvas);
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createScanlines() {
        for (let y = 0; y < window.innerHeight; y += 4) {
            this.scanlines.push({
                y: y,
                opacity: Math.random() * 0.3 + 0.1,
                speed: Math.random() * 0.02 + 0.01
            });
        }
    }
    
    createMatrixDrops() {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';
        const columns = Math.floor(window.innerWidth / 20);
        
        for (let i = 0; i < columns; i++) {
            this.matrixDrops.push({
                x: i * 20,
                y: Math.random() * window.innerHeight,
                speed: Math.random() * 3 + 1,
                char: characters[Math.floor(Math.random() * characters.length)],
                opacity: Math.random() * 0.8 + 0.2,
                lastChange: Date.now()
            });
        }
    }
    
    drawScanlines() {
        this.ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
        this.ctx.lineWidth = 1;
        
        this.scanlines.forEach(line => {
            line.opacity = Math.sin(Date.now() * line.speed) * 0.2 + 0.3;
            
            this.ctx.globalAlpha = line.opacity;
            this.ctx.beginPath();
            this.ctx.moveTo(0, line.y);
            this.ctx.lineTo(window.innerWidth, line.y);
            this.ctx.stroke();
        });
    }
    
    drawMatrixEffect() {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';
        this.ctx.font = '14px monospace';
        this.ctx.fillStyle = 'rgba(0, 255, 0, 0.1)';
        
        this.matrixDrops.forEach(drop => {
            // Change character occasionally
            if (Date.now() - drop.lastChange > 100) {
                drop.char = characters[Math.floor(Math.random() * characters.length)];
                drop.lastChange = Date.now();
            }
            
            // Draw the character
            this.ctx.globalAlpha = drop.opacity;
            this.ctx.fillText(drop.char, drop.x, drop.y);
            
            // Move the drop
            drop.y += drop.speed;
            
            // Reset drop when it reaches bottom
            if (drop.y > window.innerHeight) {
                drop.y = -20;
                drop.opacity = Math.random() * 0.8 + 0.2;
                drop.speed = Math.random() * 3 + 1;
            }
        });
    }
    
    drawGlitchEffect() {
        if (!this.glitchActive) return;
        
        // Random glitch rectangles
        for (let i = 0; i < 5; i++) {
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            const width = Math.random() * 200 + 50;
            const height = Math.random() * 20 + 5;
            
            this.ctx.globalAlpha = 0.3;
            
            // Red channel shift
            this.ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
            this.ctx.fillRect(x - 2, y, width, height);
            
            // Blue channel shift
            this.ctx.fillStyle = 'rgba(0, 0, 255, 0.3)';
            this.ctx.fillRect(x + 2, y, width, height);
        }
        
        // Static noise
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
            if (Math.random() < 0.02) {
                const noise = Math.random() * 255;
                data[i] = noise;     // Red
                data[i + 1] = noise; // Green
                data[i + 2] = noise; // Blue
                data[i + 3] = 50;    // Alpha
            }
        }
        
        this.ctx.putImageData(imageData, 0, 0);
    }
    
    triggerGlitch(duration = 200) {
        this.glitchActive = true;
        setTimeout(() => {
            this.glitchActive = false;
        }, duration);
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.drawScanlines();
        this.drawMatrixEffect();
        this.drawGlitchEffect();
        
        requestAnimationFrame(() => this.animate());
    }
}

class DistortionEffects {
    constructor() {
        this.distortions = [];
        this.init();
    }
    
    init() {
        this.bindEvents();
    }
    
    bindEvents() {
        document.addEventListener('travel-start', () => {
            this.createWaveDistortion();
        });
        
        document.addEventListener('calibrate', () => {
            this.createRippleDistortion();
        });
    }
    
    createWaveDistortion() {
        const container = document.querySelector('.time-machine-container');
        container.style.animation = 'waveDistortion 2s ease-in-out';
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes waveDistortion {
                0%, 100% {
                    transform: scale(1) skew(0deg);
                    filter: hue-rotate(0deg) blur(0px);
                }
                25% {
                    transform: scale(1.02) skew(1deg);
                    filter: hue-rotate(15deg) blur(1px);
                }
                50% {
                    transform: scale(0.98) skew(-1deg);
                    filter: hue-rotate(30deg) blur(2px);
                }
                75% {
                    transform: scale(1.01) skew(0.5deg);
                    filter: hue-rotate(45deg) blur(1px);
                }
            }
        `;
        
        if (!document.getElementById('wave-distortion-style')) {
            style.id = 'wave-distortion-style';
            document.head.appendChild(style);
        }
        
        setTimeout(() => {
            container.style.animation = '';
        }, 2000);
    }
    
    createRippleDistortion() {
        const fluxCapacitor = document.querySelector('.flux-capacitor');
        fluxCapacitor.style.animation = 'rippleDistortion 1s ease-out';
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes rippleDistortion {
                0% {
                    transform: scale(1) rotate(0deg);
                    filter: drop-shadow(0 0 20px rgba(0,255,255,0.5));
                }
                25% {
                    transform: scale(1.1) rotate(5deg);
                    filter: drop-shadow(0 0 40px rgba(0,255,255,0.8));
                }
                50% {
                    transform: scale(0.95) rotate(-3deg);
                    filter: drop-shadow(0 0 60px rgba(255,0,255,0.6));
                }
                75% {
                    transform: scale(1.05) rotate(2deg);
                    filter: drop-shadow(0 0 30px rgba(255,255,0,0.7));
                }
                100% {
                    transform: scale(1) rotate(0deg);
                    filter: drop-shadow(0 0 20px rgba(0,255,255,0.5));
                }
            }
        `;
        
        if (!document.getElementById('ripple-distortion-style')) {
            style.id = 'ripple-distortion-style';
            document.head.appendChild(style);
        }
        
        setTimeout(() => {
            fluxCapacitor.style.animation = '';
        }, 1000);
    }
    
    createTemporalTear(x, y) {
        const tear = document.createElement('div');
        tear.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: 200px;
            height: 4px;
            background: linear-gradient(90deg, 
                transparent 0%, 
                rgba(255,255,255,0.9) 20%, 
                rgba(0,255,255,1) 50%, 
                rgba(255,255,255,0.9) 80%, 
                transparent 100%
            );
            transform: translateX(-50%) rotate(${Math.random() * 360}deg);
            box-shadow: 
                0 0 20px rgba(255,255,255,0.8),
                0 0 40px rgba(0,255,255,0.6);
            z-index: 2000;
            pointer-events: none;
            animation: temporalTear 0.8s ease-out forwards;
        `;
        
        const tearStyle = document.createElement('style');
        tearStyle.textContent = `
            @keyframes temporalTear {
                0% {
                    width: 0px;
                    opacity: 1;
                    filter: blur(0px);
                }
                50% {
                    width: 200px;
                    opacity: 1;
                    filter: blur(1px);
                }
                100% {
                    width: 300px;
                    opacity: 0;
                    filter: blur(3px);
                }
            }
        `;
        
        if (!document.getElementById('temporal-tear-style')) {
            tearStyle.id = 'temporal-tear-style';
            document.head.appendChild(tearStyle);
        }
        
        document.body.appendChild(tear);
        
        setTimeout(() => {
            tear.remove();
        }, 800);
    }
}

// Initialize effects when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    const screenEffects = new ScreenEffects();
    const distortionEffects = new DistortionEffects();
    
    // Bind glitch effects to various events
    document.addEventListener('travel-start', () => {
        screenEffects.triggerGlitch(1000);
        
        // Create multiple temporal tears during travel
        setTimeout(() => {
            for (let i = 0; i < 5; i++) {
                setTimeout(() => {
                    distortionEffects.createTemporalTear(
                        Math.random() * window.innerWidth,
                        Math.random() * window.innerHeight
                    );
                }, i * 200);
            }
        }, 500);
    });
    
    document.addEventListener('click', () => {
        if (Math.random() < 0.3) {
            screenEffects.triggerGlitch(100);
        }
    });
    
    // Trigger calibration distortion
    document.addEventListener('calibrate-start', () => {
        distortionEffects.createRippleDistortion();
    });
    
    window.addEventListener('resize', () => {
        screenEffects.resize();
        screenEffects.scanlines = [];
        screenEffects.matrixDrops = [];
        screenEffects.createScanlines();
        screenEffects.createMatrixDrops();
    });
});