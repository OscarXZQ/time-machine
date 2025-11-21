class ParticleSystem {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.isMouseActive = false;
        
        this.init();
        this.createParticles();
        this.animate();
        this.bindEvents();
    }
    
    init() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.zIndex = '-1';
        this.canvas.style.pointerEvents = 'none';
        
        this.resize();
        
        document.getElementById('particles-canvas').appendChild(this.canvas);
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createParticles() {
        const numParticles = Math.floor((this.canvas.width * this.canvas.height) / 12000);
        
        for (let i = 0; i < numParticles; i++) {
            this.particles.push(new Particle(this.canvas.width, this.canvas.height));
        }
        
        for (let i = 0; i < 30; i++) {
            this.particles.push(new EnergyParticle(this.canvas.width, this.canvas.height));
        }
        
        for (let i = 0; i < 8; i++) {
            this.particles.push(new QuantumParticle(this.canvas.width, this.canvas.height));
        }
        
        for (let i = 0; i < 15; i++) {
            this.particles.push(new NebulaParticle(this.canvas.width, this.canvas.height));
        }
        
        for (let i = 0; i < 10; i++) {
            this.particles.push(new LightningParticle(this.canvas.width, this.canvas.height));
        }
        
        for (let i = 0; i < 6; i++) {
            this.particles.push(new VoidParticle(this.canvas.width, this.canvas.height));
        }
    }
    
    bindEvents() {
        window.addEventListener('resize', () => {
            this.resize();
            this.particles = [];
            this.createParticles();
        });
        
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            this.isMouseActive = true;
            
            clearTimeout(this.mouseTimeout);
            this.mouseTimeout = setTimeout(() => {
                this.isMouseActive = false;
            }, 100);
        });
        
        document.addEventListener('click', (e) => {
            this.createExplosion(e.clientX, e.clientY);
        });
    }
    
    createExplosion(x, y) {
        for (let i = 0; i < 25; i++) {
            this.particles.push(new ExplosionParticle(x, y));
        }
        
        for (let i = 0; i < 8; i++) {
            this.particles.push(new ShockwaveParticle(x, y));
        }
        
        this.particles.push(new WaveRipple(x, y));
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles = this.particles.filter(particle => {
            particle.update(this.mouseX, this.mouseY, this.isMouseActive);
            particle.draw(this.ctx);
            return !particle.isDead;
        });
        
        this.drawConnections();
        
        requestAnimationFrame(() => this.animate());
    }
    
    drawConnections() {
        this.ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
        this.ctx.lineWidth = 1;
        
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    const opacity = (100 - distance) / 100 * 0.2;
                    this.ctx.strokeStyle = `rgba(0, 255, 255, ${opacity})`;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }
}

class Particle {
    constructor(canvasWidth, canvasHeight) {
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 2 + 1;
        this.opacity = Math.random() * 0.5 + 0.2;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.isDead = false;
        
        this.colors = ['#00ffff', '#0099ff', '#0066ff', '#ffffff'];
        this.color = this.colors[Math.floor(Math.random() * this.colors.length)];
    }
    
    update(mouseX, mouseY, isMouseActive) {
        if (isMouseActive) {
            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                const force = (100 - distance) / 100 * 0.002;
                this.vx += dx * force;
                this.vy += dy * force;
            }
        }
        
        this.x += this.vx;
        this.y += this.vy;
        
        if (this.x < 0 || this.x > this.canvasWidth) this.vx *= -1;
        if (this.y < 0 || this.y > this.canvasHeight) this.vy *= -1;
        
        this.x = Math.max(0, Math.min(this.canvasWidth, this.x));
        this.y = Math.max(0, Math.min(this.canvasHeight, this.y));
        
        this.vx *= 0.99;
        this.vy *= 0.99;
    }
    
    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
}

class EnergyParticle extends Particle {
    constructor(canvasWidth, canvasHeight) {
        super(canvasWidth, canvasHeight);
        this.size = Math.random() * 4 + 2;
        this.pulseSpeed = Math.random() * 0.05 + 0.02;
        this.pulsePhase = Math.random() * Math.PI * 2;
        this.trail = [];
        this.maxTrailLength = 10;
        this.color = '#00ffaa';
    }
    
    update(mouseX, mouseY, isMouseActive) {
        super.update(mouseX, mouseY, isMouseActive);
        
        this.trail.unshift({ x: this.x, y: this.y });
        if (this.trail.length > this.maxTrailLength) {
            this.trail.pop();
        }
        
        this.pulsePhase += this.pulseSpeed;
        this.opacity = Math.sin(this.pulsePhase) * 0.3 + 0.7;
    }
    
    draw(ctx) {
        ctx.save();
        
        for (let i = 0; i < this.trail.length; i++) {
            const alpha = (this.trail.length - i) / this.trail.length * this.opacity * 0.3;
            const size = this.size * ((this.trail.length - i) / this.trail.length);
            
            ctx.globalAlpha = alpha;
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 15;
            ctx.shadowColor = this.color;
            
            ctx.beginPath();
            ctx.arc(this.trail[i].x, this.trail[i].y, size, 0, Math.PI * 2);
            ctx.fill();
        }
        
        super.draw(ctx);
        ctx.restore();
    }
}

class QuantumParticle extends Particle {
    constructor(canvasWidth, canvasHeight) {
        super(canvasWidth, canvasHeight);
        this.size = Math.random() * 6 + 3;
        this.rotationSpeed = (Math.random() - 0.5) * 0.1;
        this.rotation = 0;
        this.quantumStates = [
            '#ff00ff', '#00ffff', '#ffff00', '#ff6600'
        ];
        this.currentState = 0;
        this.stateChangeTimer = 0;
        this.stateChangeDuration = 60 + Math.random() * 120;
    }
    
    update(mouseX, mouseY, isMouseActive) {
        super.update(mouseX, mouseY, isMouseActive);
        
        this.rotation += this.rotationSpeed;
        this.stateChangeTimer++;
        
        if (this.stateChangeTimer >= this.stateChangeDuration) {
            this.currentState = (this.currentState + 1) % this.quantumStates.length;
            this.stateChangeTimer = 0;
            this.stateChangeDuration = 60 + Math.random() * 120;
        }
        
        this.color = this.quantumStates[this.currentState];
    }
    
    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        ctx.globalAlpha = this.opacity;
        ctx.strokeStyle = this.color;
        ctx.fillStyle = this.color;
        ctx.lineWidth = 2;
        ctx.shadowBlur = 20;
        ctx.shadowColor = this.color;
        
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            const x = Math.cos(angle) * this.size;
            const y = Math.sin(angle) * this.size;
            
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(0, 0, this.size * 0.3, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
}

class ExplosionParticle extends Particle {
    constructor(x, y) {
        super(window.innerWidth, window.innerHeight);
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 8;
        this.vy = (Math.random() - 0.5) * 8;
        this.size = Math.random() * 3 + 1;
        this.life = 1;
        this.decay = Math.random() * 0.02 + 0.01;
        this.color = '#ffaa00';
        this.gravity = 0.1;
    }
    
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;
        
        this.life -= this.decay;
        this.opacity = this.life;
        this.size *= 0.98;
        
        if (this.life <= 0) {
            this.isDead = true;
        }
    }
    
    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
}

class TemporalRift {
    constructor(x, y, intensity = 1) {
        this.x = x;
        this.y = y;
        this.intensity = intensity;
        this.radius = 0;
        this.maxRadius = 150 * intensity;
        this.particles = [];
        this.life = 300;
        this.maxLife = 300;
        
        this.createRiftParticles();
    }
    
    createRiftParticles() {
        for (let i = 0; i < 30; i++) {
            const angle = (i / 30) * Math.PI * 2;
            const distance = Math.random() * 100;
            const x = this.x + Math.cos(angle) * distance;
            const y = this.y + Math.sin(angle) * distance;
            
            this.particles.push({
                x: x,
                y: y,
                targetX: this.x,
                targetY: this.y,
                speed: 0.05,
                size: Math.random() * 3 + 1,
                hue: Math.random() * 60 + 200
            });
        }
    }
    
    update() {
        this.radius = Math.min(this.maxRadius, this.radius + 2);
        this.life--;
        
        this.particles.forEach(particle => {
            const dx = particle.targetX - particle.x;
            const dy = particle.targetY - particle.y;
            particle.x += dx * particle.speed;
            particle.y += dy * particle.speed;
            particle.speed += 0.001;
        });
        
        if (this.life <= 0) {
            this.isDead = true;
        }
    }
    
    draw(ctx) {
        const alpha = this.life / this.maxLife;
        
        ctx.save();
        ctx.globalAlpha = alpha * 0.5;
        
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
        gradient.addColorStop(0.5, 'rgba(0, 255, 255, 0.4)');
        gradient.addColorStop(1, 'rgba(0, 100, 255, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        
        this.particles.forEach(particle => {
            ctx.globalAlpha = alpha;
            ctx.fillStyle = `hsl(${particle.hue}, 100%, 50%)`;
            ctx.shadowBlur = 10;
            ctx.shadowColor = `hsl(${particle.hue}, 100%, 50%)`;
            
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
        });
        
        ctx.restore();
    }
}

class NebulaParticle extends Particle {
    constructor(canvasWidth, canvasHeight) {
        super(canvasWidth, canvasHeight);
        this.size = Math.random() * 8 + 4;
        this.expansionSpeed = Math.random() * 0.02 + 0.005;
        this.maxSize = this.size * (2 + Math.random() * 3);
        this.hue = Math.random() * 60 + 180;
        this.saturation = 80 + Math.random() * 20;
        this.lightness = 40 + Math.random() * 30;
        this.expanding = true;
    }
    
    update(mouseX, mouseY, isMouseActive) {
        super.update(mouseX, mouseY, isMouseActive);
        
        if (this.expanding) {
            this.size += this.expansionSpeed;
            if (this.size >= this.maxSize) {
                this.expanding = false;
            }
        } else {
            this.size -= this.expansionSpeed * 0.5;
            if (this.size <= 1) {
                this.size = Math.random() * 8 + 4;
                this.expanding = true;
                this.maxSize = this.size * (2 + Math.random() * 3);
                this.hue = Math.random() * 60 + 180;
            }
        }
        
        this.opacity = (this.maxSize - this.size) / this.maxSize * 0.8;
    }
    
    draw(ctx) {
        ctx.save();
        
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
        gradient.addColorStop(0, `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, ${this.opacity})`);
        gradient.addColorStop(0.7, `hsla(${this.hue}, ${this.saturation}%, ${this.lightness - 20}%, ${this.opacity * 0.5})`);
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
}

class LightningParticle extends Particle {
    constructor(canvasWidth, canvasHeight) {
        super(canvasWidth, canvasHeight);
        this.segments = [];
        this.length = Math.random() * 100 + 50;
        this.direction = Math.random() * Math.PI * 2;
        this.branching = Math.random() > 0.7;
        this.life = 30 + Math.random() * 20;
        this.maxLife = this.life;
        this.generateSegments();
    }
    
    generateSegments() {
        let currentX = this.x;
        let currentY = this.y;
        let currentDirection = this.direction;
        
        for (let i = 0; i < 10; i++) {
            const segmentLength = this.length / 10;
            const jitter = (Math.random() - 0.5) * 0.5;
            
            const endX = currentX + Math.cos(currentDirection + jitter) * segmentLength;
            const endY = currentY + Math.sin(currentDirection + jitter) * segmentLength;
            
            this.segments.push({
                startX: currentX,
                startY: currentY,
                endX: endX,
                endY: endY,
                intensity: Math.random() * 0.8 + 0.2
            });
            
            currentX = endX;
            currentY = endY;
            currentDirection += jitter;
        }
    }
    
    update() {
        this.life--;
        this.opacity = this.life / this.maxLife;
        
        if (this.life <= 0) {
            this.isDead = true;
        }
    }
    
    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#00ffff';
        
        this.segments.forEach(segment => {
            ctx.globalAlpha = this.opacity * segment.intensity;
            ctx.beginPath();
            ctx.moveTo(segment.startX, segment.startY);
            ctx.lineTo(segment.endX, segment.endY);
            ctx.stroke();
        });
        
        ctx.restore();
    }
}

class VoidParticle extends Particle {
    constructor(canvasWidth, canvasHeight) {
        super(canvasWidth, canvasHeight);
        this.size = Math.random() * 15 + 10;
        this.rotationSpeed = (Math.random() - 0.5) * 0.05;
        this.rotation = 0;
        this.voidDepth = Math.random() * 0.8 + 0.2;
        this.pulsePhase = Math.random() * Math.PI * 2;
        this.color = '#000055';
    }
    
    update(mouseX, mouseY, isMouseActive) {
        super.update(mouseX, mouseY, isMouseActive);
        
        this.rotation += this.rotationSpeed;
        this.pulsePhase += 0.03;
        this.opacity = Math.sin(this.pulsePhase) * 0.3 + 0.7;
    }
    
    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
        gradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
        gradient.addColorStop(0.3, 'rgba(20, 0, 80, 0.8)');
        gradient.addColorStop(0.7, 'rgba(0, 50, 150, 0.4)');
        gradient.addColorStop(1, 'transparent');
        
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = 'rgba(100, 0, 255, 0.6)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, this.size * 0.8, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.restore();
    }
}

class ShockwaveParticle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 0;
        this.maxRadius = 50 + Math.random() * 50;
        this.speed = 2 + Math.random() * 3;
        this.life = 60;
        this.maxLife = 60;
        this.isDead = false;
    }
    
    update() {
        this.radius += this.speed;
        this.life--;
        
        if (this.radius >= this.maxRadius || this.life <= 0) {
            this.isDead = true;
        }
    }
    
    draw(ctx) {
        const alpha = this.life / this.maxLife;
        
        ctx.save();
        ctx.globalAlpha = alpha * 0.6;
        ctx.strokeStyle = '#00ffff';
        ctx.lineWidth = 3;
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#00ffff';
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.restore();
    }
}

class WaveRipple {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.ripples = [];
        
        for (let i = 0; i < 5; i++) {
            this.ripples.push({
                radius: 0,
                maxRadius: (i + 1) * 30,
                speed: 1 + i * 0.5,
                delay: i * 10,
                alpha: 1
            });
        }
        
        this.life = 200;
        this.isDead = false;
    }
    
    update() {
        this.ripples.forEach(ripple => {
            if (ripple.delay > 0) {
                ripple.delay--;
            } else {
                ripple.radius += ripple.speed;
                ripple.alpha = Math.max(0, 1 - (ripple.radius / ripple.maxRadius));
            }
        });
        
        this.life--;
        if (this.life <= 0) {
            this.isDead = true;
        }
    }
    
    draw(ctx) {
        ctx.save();
        
        this.ripples.forEach(ripple => {
            if (ripple.radius > 0 && ripple.alpha > 0) {
                ctx.globalAlpha = ripple.alpha * 0.4;
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 2;
                ctx.shadowBlur = 8;
                ctx.shadowColor = '#00ffff';
                
                ctx.beginPath();
                ctx.arc(this.x, this.y, ripple.radius, 0, Math.PI * 2);
                ctx.stroke();
            }
        });
        
        ctx.restore();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const particleSystem = new ParticleSystem();
    
    window.createTemporalRift = (x, y, intensity) => {
        particleSystem.particles.push(new TemporalRift(x, y, intensity));
    };
    
    document.addEventListener('travel-start', () => {
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                const x = window.innerWidth * 0.5 + (Math.random() - 0.5) * 200;
                const y = window.innerHeight * 0.5 + (Math.random() - 0.5) * 200;
                window.createTemporalRift(x, y, 1.5);
            }, i * 500);
        }
    });
});