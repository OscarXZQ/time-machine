class WeatherSystem {
    constructor() {
        this.weatherCanvas = null;
        this.weatherCtx = null;
        this.currentWeather = 'temporal_storm';
        this.particles = [];
        this.lightning = [];
        this.windForce = { x: 0, y: 0 };
        this.atmosphere = {
            pressure: 1.0,
            temperature: 20,
            humidity: 0.6,
            ionization: 0.3
        };
        
        this.init();
        this.createWeatherParticles();
        this.animate();
    }
    
    init() {
        this.weatherCanvas = document.createElement('canvas');
        this.weatherCtx = this.weatherCanvas.getContext('2d');
        
        this.weatherCanvas.style.position = 'fixed';
        this.weatherCanvas.style.top = '0';
        this.weatherCanvas.style.left = '0';
        this.weatherCanvas.style.width = '100%';
        this.weatherCanvas.style.height = '100%';
        this.weatherCanvas.style.pointerEvents = 'none';
        this.weatherCanvas.style.zIndex = '500';
        this.weatherCanvas.style.mixBlendMode = 'screen';
        
        this.resize();
        document.body.appendChild(this.weatherCanvas);
    }
    
    resize() {
        this.weatherCanvas.width = window.innerWidth;
        this.weatherCanvas.height = window.innerHeight;
    }
    
    createWeatherParticles() {
        // Temporal energy motes
        for (let i = 0; i < 150; i++) {
            this.particles.push(new TemporalMote(this.weatherCanvas.width, this.weatherCanvas.height));
        }
        
        // Chrono dust
        for (let i = 0; i < 80; i++) {
            this.particles.push(new ChronoDust(this.weatherCanvas.width, this.weatherCanvas.height));
        }
        
        // Time vapors
        for (let i = 0; i < 40; i++) {
            this.particles.push(new TimeVapor(this.weatherCanvas.width, this.weatherCanvas.height));
        }
        
        // Reality fragments
        for (let i = 0; i < 20; i++) {
            this.particles.push(new RealityFragment(this.weatherCanvas.width, this.weatherCanvas.height));
        }
    }
    
    updateAtmosphere() {
        const time = Date.now() * 0.001;
        
        // Dynamic atmospheric changes
        this.atmosphere.pressure = 0.8 + Math.sin(time * 0.1) * 0.3;
        this.atmosphere.ionization = 0.2 + Math.sin(time * 0.15 + 1) * 0.4;
        this.atmosphere.humidity = 0.4 + Math.sin(time * 0.08 + 2) * 0.3;
        
        // Wind patterns
        this.windForce.x = Math.sin(time * 0.05) * 2 + Math.sin(time * 0.12) * 0.8;
        this.windForce.y = Math.cos(time * 0.07) * 1.5 + Math.sin(time * 0.09) * 0.6;
        
        // Apply weather effects to UI
        this.applyAtmosphericEffects();
    }
    
    applyAtmosphericEffects() {
        const container = document.querySelector('.time-machine-container');
        if (!container) return;
        
        const pressure = this.atmosphere.pressure;
        const ionization = this.atmosphere.ionization;
        
        // Atmospheric distortion
        const distortion = (pressure - 1) * 10;
        const ionGlow = ionization * 0.5;
        
        container.style.filter = `
            blur(${Math.abs(distortion) * 0.5}px) 
            brightness(${1 + ionGlow}) 
            hue-rotate(${distortion * 5}deg)
            saturate(${1 + ionization * 0.3})
        `;
        
        // Electromagnetic interference
        if (ionization > 0.7 && Math.random() < 0.1) {
            this.createEMInterference();
        }
    }
    
    createEMInterference() {
        const interference = document.createElement('div');
        interference.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: 
                linear-gradient(90deg, transparent 48%, rgba(255,255,255,0.1) 49%, rgba(255,255,255,0.1) 51%, transparent 52%),
                linear-gradient(0deg, transparent 48%, rgba(0,255,255,0.05) 49%, rgba(0,255,255,0.05) 51%, transparent 52%);
            pointer-events: none;
            z-index: 1500;
            animation: emInterference 0.3s ease-out forwards;
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes emInterference {
                0% { opacity: 0; transform: translateX(0); }
                50% { opacity: 1; transform: translateX(10px); }
                100% { opacity: 0; transform: translateX(-10px); }
            }
        `;
        
        if (!document.getElementById('em-interference-style')) {
            style.id = 'em-interference-style';
            document.head.appendChild(style);
        }
        
        document.body.appendChild(interference);
        
        setTimeout(() => interference.remove(), 300);
    }
    
    createTemporalLightning() {
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                const lightning = new TemporalLightning(this.weatherCanvas.width, this.weatherCanvas.height);
                this.lightning.push(lightning);
            }, i * 200);
        }
    }
    
    createChronoStorm() {
        // Increase particle density
        for (let i = 0; i < 100; i++) {
            this.particles.push(new TemporalMote(this.weatherCanvas.width, this.weatherCanvas.height));
        }
        
        // Create storm center
        this.createStormVortex(this.weatherCanvas.width / 2, this.weatherCanvas.height / 2);
        
        // Atmospheric chaos
        this.atmosphere.pressure = 0.3;
        this.atmosphere.ionization = 0.9;
    }
    
    createStormVortex(x, y) {
        const vortex = document.createElement('div');
        vortex.style.cssText = `
            position: fixed;
            left: ${x - 150}px;
            top: ${y - 150}px;
            width: 300px;
            height: 300px;
            border-radius: 50%;
            background: conic-gradient(
                from 0deg,
                transparent 0deg,
                rgba(0,255,255,0.3) 45deg,
                rgba(255,0,255,0.4) 90deg,
                rgba(255,255,0,0.3) 135deg,
                transparent 180deg,
                rgba(0,255,255,0.2) 225deg,
                rgba(255,0,255,0.3) 270deg,
                rgba(255,255,0,0.2) 315deg,
                transparent 360deg
            );
            pointer-events: none;
            z-index: 600;
            animation: stormVortex 4s linear infinite;
            filter: blur(2px);
        `;
        
        const vortexStyle = document.createElement('style');
        vortexStyle.textContent = `
            @keyframes stormVortex {
                0% { transform: rotate(0deg) scale(0.5); opacity: 0.8; }
                50% { transform: rotate(180deg) scale(1.2); opacity: 1; }
                100% { transform: rotate(360deg) scale(0.5); opacity: 0.8; }
            }
        `;
        
        if (!document.getElementById('storm-vortex-style')) {
            vortexStyle.id = 'storm-vortex-style';
            document.head.appendChild(vortexStyle);
        }
        
        document.body.appendChild(vortex);
        
        setTimeout(() => vortex.remove(), 8000);
    }
    
    animate() {
        this.weatherCtx.clearRect(0, 0, this.weatherCanvas.width, this.weatherCanvas.height);
        
        this.updateAtmosphere();
        
        // Update and draw particles
        this.particles = this.particles.filter(particle => {
            particle.update(this.windForce, this.atmosphere);
            particle.draw(this.weatherCtx);
            return !particle.isDead;
        });
        
        // Update and draw lightning
        this.lightning = this.lightning.filter(bolt => {
            bolt.update();
            bolt.draw(this.weatherCtx);
            return !bolt.isDead;
        });
        
        // Randomly create new particles
        if (Math.random() < 0.1) {
            this.particles.push(new TemporalMote(this.weatherCanvas.width, this.weatherCanvas.height));
        }
        
        if (Math.random() < 0.05) {
            this.particles.push(new ChronoDust(this.weatherCanvas.width, this.weatherCanvas.height));
        }
        
        // Lightning strikes during high ionization
        if (this.atmosphere.ionization > 0.8 && Math.random() < 0.02) {
            this.createTemporalLightning();
        }
        
        requestAnimationFrame(() => this.animate());
    }
}

class TemporalMote {
    constructor(canvasWidth, canvasHeight) {
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        this.size = Math.random() * 3 + 1;
        this.life = 300 + Math.random() * 200;
        this.maxLife = this.life;
        this.phase = Math.random() * Math.PI * 2;
        this.frequency = Math.random() * 0.1 + 0.05;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.isDead = false;
        
        this.colors = [
            'rgba(0, 255, 255, ',
            'rgba(255, 100, 255, ',
            'rgba(100, 255, 100, ',
            'rgba(255, 255, 100, '\n        ];\n        this.color = this.colors[Math.floor(Math.random() * this.colors.length)];\n    }\n    \n    update(windForce, atmosphere) {\n        // Wind influence\n        this.vx += windForce.x * 0.01;\n        this.vy += windForce.y * 0.01;\n        \n        // Atmospheric pressure influence\n        const pressureEffect = (atmosphere.pressure - 1) * 5;\n        this.vy += pressureEffect * 0.02;\n        \n        // Ionization makes particles more erratic\n        if (atmosphere.ionization > 0.5) {\n            this.vx += (Math.random() - 0.5) * atmosphere.ionization * 0.5;\n            this.vy += (Math.random() - 0.5) * atmosphere.ionization * 0.5;\n        }\n        \n        this.x += this.vx;\n        this.y += this.vy;\n        \n        // Temporal oscillation\n        this.phase += this.frequency;\n        this.x += Math.sin(this.phase) * 0.5;\n        this.y += Math.cos(this.phase) * 0.3;\n        \n        // Boundary wrapping\n        if (this.x < 0) this.x = this.canvasWidth;\n        if (this.x > this.canvasWidth) this.x = 0;\n        if (this.y < 0) this.y = this.canvasHeight;\n        if (this.y > this.canvasHeight) this.y = 0;\n        \n        this.life--;\n        if (this.life <= 0) this.isDead = true;\n    }\n    \n    draw(ctx) {\n        const opacity = (this.life / this.maxLife) * 0.8;\n        const pulseOpacity = Math.sin(this.phase * 2) * 0.3 + 0.7;\n        \n        ctx.save();\n        ctx.globalAlpha = opacity * pulseOpacity;\n        \n        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);\n        gradient.addColorStop(0, this.color + '1)');\n        gradient.addColorStop(0.7, this.color + '0.5)');\n        gradient.addColorStop(1, this.color + '0)');\n        \n        ctx.fillStyle = gradient;\n        ctx.shadowBlur = 10;\n        ctx.shadowColor = this.color + '0.8)';\n        \n        ctx.beginPath();\n        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);\n        ctx.fill();\n        \n        ctx.restore();\n    }\n}\n\nclass ChronoDust {\n    constructor(canvasWidth, canvasHeight) {\n        this.x = Math.random() * canvasWidth;\n        this.y = Math.random() * canvasHeight;\n        this.vx = (Math.random() - 0.5) * 1;\n        this.vy = Math.random() * 0.5 + 0.2;\n        this.size = Math.random() * 1.5 + 0.5;\n        this.life = 400 + Math.random() * 300;\n        this.maxLife = this.life;\n        this.swirl = Math.random() * 0.1;\n        this.canvasWidth = canvasWidth;\n        this.canvasHeight = canvasHeight;\n        this.isDead = false;\n    }\n    \n    update(windForce, atmosphere) {\n        this.vx += windForce.x * 0.05;\n        this.vy += windForce.y * 0.02;\n        \n        // Swirling motion\n        this.x += this.vx + Math.sin(Date.now() * 0.001 + this.x * 0.01) * this.swirl;\n        this.y += this.vy;\n        \n        if (this.x < 0 || this.x > this.canvasWidth || this.y < 0 || this.y > this.canvasHeight) {\n            this.x = Math.random() * this.canvasWidth;\n            this.y = -10;\n        }\n        \n        this.life--;\n        if (this.life <= 0) this.isDead = true;\n    }\n    \n    draw(ctx) {\n        const opacity = (this.life / this.maxLife) * 0.4;\n        \n        ctx.save();\n        ctx.globalAlpha = opacity;\n        ctx.fillStyle = 'rgba(150, 150, 255, 0.6)';\n        ctx.shadowBlur = 5;\n        ctx.shadowColor = 'rgba(150, 150, 255, 0.8)';\n        \n        ctx.beginPath();\n        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);\n        ctx.fill();\n        \n        ctx.restore();\n    }\n}\n\nclass TimeVapor {\n    constructor(canvasWidth, canvasHeight) {\n        this.x = Math.random() * canvasWidth;\n        this.y = canvasHeight + 50;\n        this.vx = (Math.random() - 0.5) * 0.5;\n        this.vy = -(Math.random() * 1 + 0.5);\n        this.size = Math.random() * 20 + 10;\n        this.life = 500 + Math.random() * 200;\n        this.maxLife = this.life;\n        this.expansion = Math.random() * 0.02 + 0.01;\n        this.canvasWidth = canvasWidth;\n        this.canvasHeight = canvasHeight;\n        this.isDead = false;\n    }\n    \n    update(windForce, atmosphere) {\n        this.vx += windForce.x * 0.02;\n        this.vy += windForce.y * 0.01;\n        \n        this.x += this.vx;\n        this.y += this.vy;\n        this.size += this.expansion;\n        \n        if (this.y < -100 || this.size > 100) {\n            this.isDead = true;\n        }\n        \n        this.life--;\n        if (this.life <= 0) this.isDead = true;\n    }\n    \n    draw(ctx) {\n        const opacity = (this.life / this.maxLife) * 0.2;\n        \n        ctx.save();\n        ctx.globalAlpha = opacity;\n        \n        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);\n        gradient.addColorStop(0, 'rgba(200, 150, 255, 0.3)');\n        gradient.addColorStop(0.5, 'rgba(150, 200, 255, 0.2)');\n        gradient.addColorStop(1, 'rgba(100, 255, 200, 0)');\n        \n        ctx.fillStyle = gradient;\n        ctx.beginPath();\n        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);\n        ctx.fill();\n        \n        ctx.restore();\n    }\n}\n\nclass RealityFragment {\n    constructor(canvasWidth, canvasHeight) {\n        this.x = Math.random() * canvasWidth;\n        this.y = Math.random() * canvasHeight;\n        this.vx = (Math.random() - 0.5) * 3;\n        this.vy = (Math.random() - 0.5) * 3;\n        this.size = Math.random() * 8 + 4;\n        this.rotation = 0;\n        this.rotationSpeed = (Math.random() - 0.5) * 0.2;\n        this.life = 200 + Math.random() * 100;\n        this.maxLife = this.life;\n        this.canvasWidth = canvasWidth;\n        this.canvasHeight = canvasHeight;\n        this.isDead = false;\n        this.fragmentType = Math.floor(Math.random() * 3);\n    }\n    \n    update(windForce, atmosphere) {\n        this.vx += windForce.x * 0.03;\n        this.vy += windForce.y * 0.03;\n        \n        // Reality distortion\n        if (atmosphere.ionization > 0.7) {\n            this.vx += (Math.random() - 0.5) * 2;\n            this.vy += (Math.random() - 0.5) * 2;\n        }\n        \n        this.x += this.vx;\n        this.y += this.vy;\n        this.rotation += this.rotationSpeed;\n        \n        // Fade at edges\n        this.vx *= 0.98;\n        this.vy *= 0.98;\n        \n        if (this.x < 0 || this.x > this.canvasWidth || this.y < 0 || this.y > this.canvasHeight) {\n            this.life -= 10;\n        }\n        \n        this.life--;\n        if (this.life <= 0) this.isDead = true;\n    }\n    \n    draw(ctx) {\n        const opacity = (this.life / this.maxLife) * 0.8;\n        \n        ctx.save();\n        ctx.globalAlpha = opacity;\n        ctx.translate(this.x, this.y);\n        ctx.rotate(this.rotation);\n        \n        if (this.fragmentType === 0) {\n            // Triangular fragment\n            ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';\n            ctx.fillStyle = 'rgba(0, 255, 255, 0.3)';\n            ctx.lineWidth = 2;\n            ctx.shadowBlur = 10;\n            ctx.shadowColor = 'rgba(0, 255, 255, 0.8)';\n            \n            ctx.beginPath();\n            ctx.moveTo(0, -this.size);\n            ctx.lineTo(this.size * 0.8, this.size * 0.5);\n            ctx.lineTo(-this.size * 0.8, this.size * 0.5);\n            ctx.closePath();\n            ctx.fill();\n            ctx.stroke();\n        } else if (this.fragmentType === 1) {\n            // Square fragment\n            ctx.strokeStyle = 'rgba(255, 100, 255, 0.8)';\n            ctx.fillStyle = 'rgba(255, 0, 255, 0.2)';\n            ctx.lineWidth = 2;\n            ctx.shadowBlur = 8;\n            ctx.shadowColor = 'rgba(255, 0, 255, 0.6)';\n            \n            ctx.fillRect(-this.size/2, -this.size/2, this.size, this.size);\n            ctx.strokeRect(-this.size/2, -this.size/2, this.size, this.size);\n        } else {\n            // Hexagonal fragment\n            ctx.strokeStyle = 'rgba(255, 255, 0, 0.8)';\n            ctx.fillStyle = 'rgba(255, 255, 0, 0.2)';\n            ctx.lineWidth = 2;\n            ctx.shadowBlur = 8;\n            ctx.shadowColor = 'rgba(255, 255, 0, 0.6)';\n            \n            ctx.beginPath();\n            for (let i = 0; i < 6; i++) {\n                const angle = (i / 6) * Math.PI * 2;\n                const x = Math.cos(angle) * this.size / 2;\n                const y = Math.sin(angle) * this.size / 2;\n                if (i === 0) ctx.moveTo(x, y);\n                else ctx.lineTo(x, y);\n            }\n            ctx.closePath();\n            ctx.fill();\n            ctx.stroke();\n        }\n        \n        ctx.restore();\n    }\n}\n\nclass TemporalLightning {\n    constructor(canvasWidth, canvasHeight) {\n        this.startX = Math.random() * canvasWidth;\n        this.startY = Math.random() * canvasHeight * 0.3;\n        this.endX = this.startX + (Math.random() - 0.5) * 400;\n        this.endY = canvasHeight;\n        this.segments = [];\n        this.life = 30 + Math.random() * 20;\n        this.maxLife = this.life;\n        this.isDead = false;\n        \n        this.generateBolt();\n    }\n    \n    generateBolt() {\n        const segmentCount = 15 + Math.floor(Math.random() * 10);\n        let currentX = this.startX;\n        let currentY = this.startY;\n        \n        for (let i = 0; i < segmentCount; i++) {\n            const progress = i / segmentCount;\n            const targetX = this.startX + (this.endX - this.startX) * progress;\n            const targetY = this.startY + (this.endY - this.startY) * progress;\n            \n            // Add randomness\n            const jitterX = (Math.random() - 0.5) * 50;\n            const jitterY = (Math.random() - 0.5) * 20;\n            \n            const nextX = targetX + jitterX;\n            const nextY = targetY + jitterY;\n            \n            this.segments.push({\n                startX: currentX,\n                startY: currentY,\n                endX: nextX,\n                endY: nextY,\n                intensity: Math.random() * 0.8 + 0.2\n            });\n            \n            currentX = nextX;\n            currentY = nextY;\n        }\n    }\n    \n    update() {\n        this.life--;\n        if (this.life <= 0) this.isDead = true;\n    }\n    \n    draw(ctx) {\n        const opacity = (this.life / this.maxLife);\n        \n        ctx.save();\n        ctx.globalAlpha = opacity;\n        ctx.strokeStyle = '#ffffff';\n        ctx.lineWidth = 4;\n        ctx.shadowBlur = 20;\n        ctx.shadowColor = '#00ffff';\n        \n        this.segments.forEach(segment => {\n            ctx.globalAlpha = opacity * segment.intensity;\n            ctx.beginPath();\n            ctx.moveTo(segment.startX, segment.startY);\n            ctx.lineTo(segment.endX, segment.endY);\n            ctx.stroke();\n        });\n        \n        // Secondary glow\n        ctx.strokeStyle = '#00ffff';\n        ctx.lineWidth = 2;\n        ctx.shadowBlur = 30;\n        \n        this.segments.forEach(segment => {\n            ctx.globalAlpha = opacity * segment.intensity * 0.6;\n            ctx.beginPath();\n            ctx.moveTo(segment.startX, segment.startY);\n            ctx.lineTo(segment.endX, segment.endY);\n            ctx.stroke();\n        });\n        \n        ctx.restore();\n    }\n}\n\n// Initialize when DOM loads\ndocument.addEventListener('DOMContentLoaded', () => {\n    const weatherSystem = new WeatherSystem();\n    \n    // Bind weather events\n    document.addEventListener('travel-start', () => {\n        weatherSystem.createChronoStorm();\n    });\n    \n    document.addEventListener('calibrate-start', () => {\n        weatherSystem.createTemporalLightning();\n    });\n    \n    window.addEventListener('resize', () => {\n        weatherSystem.resize();\n    });\n});
