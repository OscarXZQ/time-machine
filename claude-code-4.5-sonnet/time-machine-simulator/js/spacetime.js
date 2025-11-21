class SpaceTimeWarpingSystem {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.warpFields = [];
        this.dimensionalRifts = [];
        this.spacetimeGrid = [];
        this.gravitationalWells = [];
        this.wormholes = [];
        this.time = 0;
        this.backgroundGrid = null;
        
        this.init();
        this.createSpaceTimeGrid();
        this.createWarpingSystems();
        this.animate();
    }
    
    init() {
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '460';
        this.canvas.style.mixBlendMode = 'multiply';
        this.canvas.style.opacity = '0.3';
        
        this.resize();
        document.body.appendChild(this.canvas);
        
        this.bindEvents();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.createSpaceTimeGrid();
    }
    
    bindEvents() {
        document.addEventListener('travel-start', () => {
            this.createMajorWarp();
            this.openDimensionalRifts();
        });
        
        document.addEventListener('calibrate-start', () => {
            this.stabilizeSpaceTime();
        });
        
        document.addEventListener('mousemove', (e) => {
            this.createLocalWarp(e.clientX, e.clientY);
        });
    }
    
    createSpaceTimeGrid() {
        this.spacetimeGrid = [];
        const gridSize = 50;
        
        for (let x = 0; x < this.canvas.width + gridSize; x += gridSize) {
            const column = [];
            for (let y = 0; y < this.canvas.height + gridSize; y += gridSize) {
                column.push(new SpaceTimeNode(x, y));
            }
            this.spacetimeGrid.push(column);
        }
    }
    
    createWarpingSystems() {
        // Create initial gravitational wells
        for (let i = 0; i < 3; i++) {
            this.gravitationalWells.push(new GravitationalWell(
                Math.random() * this.canvas.width,
                Math.random() * this.canvas.height,
                50 + Math.random() * 100
            ));
        }
        
        // Create background warp fields
        for (let i = 0; i < 5; i++) {
            this.warpFields.push(new WarpField(
                Math.random() * this.canvas.width,
                Math.random() * this.canvas.height
            ));
        }
    }
    
    createMajorWarp() {
        // Create massive space-time distortion during travel
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        this.gravitationalWells.push(new GravitationalWell(
            centerX, centerY, 200, true // massive well
        ));
        
        // Create wormhole
        this.wormholes.push(new Wormhole(centerX, centerY));
        
        // Create multiple warp fields
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const distance = 150;
            this.warpFields.push(new WarpField(
                centerX + Math.cos(angle) * distance,
                centerY + Math.sin(angle) * distance,
                true // intense mode
            ));
        }
    }
    
    openDimensionalRifts() {
        for (let i = 0; i < 4; i++) {
            this.dimensionalRifts.push(new DimensionalRift(
                Math.random() * this.canvas.width,
                Math.random() * this.canvas.height
            ));
        }
    }
    
    createLocalWarp(x, y) {
        if (Math.random() < 0.1) { // 10% chance on mouse move
            this.warpFields.push(new WarpField(x, y, false, 100)); // short-lived warp
        }
    }
    
    stabilizeSpaceTime() {
        // Gradually reduce warp intensities
        this.warpFields.forEach(field => field.stabilize());
        this.gravitationalWells.forEach(well => well.weaken());
        
        // Close dimensional rifts
        this.dimensionalRifts.forEach(rift => rift.closeRift());
    }
    
    update() {
        this.time += 0.016;
        
        // Update all systems
        this.warpFields = this.warpFields.filter(field => {
            field.update(this.time);
            return !field.finished;
        });
        
        this.gravitationalWells = this.gravitationalWells.filter(well => {
            well.update(this.time);
            return !well.finished;
        });
        
        this.dimensionalRifts = this.dimensionalRifts.filter(rift => {
            rift.update(this.time);
            return !rift.finished;
        });
        
        this.wormholes = this.wormholes.filter(wormhole => {
            wormhole.update(this.time);
            return !wormhole.finished;
        });
        
        // Update space-time grid based on warp influences
        this.updateSpaceTimeGrid();
        
        // Spontaneous warp events
        if (Math.random() < 0.005) {
            this.createSpontaneousWarp();
        }
    }
    
    updateSpaceTimeGrid() {
        this.spacetimeGrid.forEach((column, x) => {
            column.forEach((node, y) => {
                node.resetPosition();
                
                // Apply influences from all warp sources
                let totalWarpX = 0;
                let totalWarpY = 0;
                
                this.warpFields.forEach(field => {
                    const influence = field.getInfluenceAt(node.originalX, node.originalY);
                    totalWarpX += influence.x;
                    totalWarpY += influence.y;
                });
                
                this.gravitationalWells.forEach(well => {
                    const influence = well.getInfluenceAt(node.originalX, node.originalY);
                    totalWarpX += influence.x;
                    totalWarpY += influence.y;
                });
                
                this.wormholes.forEach(wormhole => {
                    const influence = wormhole.getInfluenceAt(node.originalX, node.originalY);
                    totalWarpX += influence.x;
                    totalWarpY += influence.y;
                });
                
                node.applyWarp(totalWarpX, totalWarpY);
            });
        });
    }
    
    createSpontaneousWarp() {
        this.warpFields.push(new WarpField(
            Math.random() * this.canvas.width,
            Math.random() * this.canvas.height,
            false,
            200 + Math.random() * 300
        ));
    }
    
    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Render space-time grid
        this.renderSpaceTimeGrid();
        
        // Render dimensional rifts (background)
        this.dimensionalRifts.forEach(rift => rift.render(this.ctx));
        
        // Render warp fields
        this.warpFields.forEach(field => field.render(this.ctx));
        
        // Render gravitational wells
        this.gravitationalWells.forEach(well => well.render(this.ctx));
        
        // Render wormholes (foreground)
        this.wormholes.forEach(wormhole => wormhole.render(this.ctx));
        
        // Render warp statistics
        this.renderWarpStats();
    }
    
    renderSpaceTimeGrid() {
        this.ctx.save();
        this.ctx.strokeStyle = 'rgba(100, 100, 255, 0.2)';
        this.ctx.lineWidth = 1;
        
        // Horizontal lines
        for (let y = 0; y < this.spacetimeGrid[0].length - 1; y++) {
            this.ctx.beginPath();
            for (let x = 0; x < this.spacetimeGrid.length; x++) {
                const node = this.spacetimeGrid[x][y];
                if (x === 0) {
                    this.ctx.moveTo(node.x, node.y);
                } else {
                    this.ctx.lineTo(node.x, node.y);
                }
            }
            this.ctx.stroke();
        }
        
        // Vertical lines
        for (let x = 0; x < this.spacetimeGrid.length - 1; x++) {
            this.ctx.beginPath();
            for (let y = 0; y < this.spacetimeGrid[x].length; y++) {
                const node = this.spacetimeGrid[x][y];
                if (y === 0) {
                    this.ctx.moveTo(node.x, node.y);
                } else {
                    this.ctx.lineTo(node.x, node.y);
                }
            }
            this.ctx.stroke();
        }
        
        this.ctx.restore();
    }
    
    renderWarpStats() {
        this.ctx.save();
        this.ctx.font = '11px monospace';
        this.ctx.fillStyle = 'rgba(100, 100, 255, 0.7)';
        
        this.ctx.fillText(`Warp Fields: ${this.warpFields.length}`, 20, this.canvas.height - 80);
        this.ctx.fillText(`Gravitational Wells: ${this.gravitationalWells.length}`, 20, this.canvas.height - 60);
        this.ctx.fillText(`Dimensional Rifts: ${this.dimensionalRifts.length}`, 20, this.canvas.height - 40);
        this.ctx.fillText(`Active Wormholes: ${this.wormholes.length}`, 20, this.canvas.height - 20);
        
        this.ctx.restore();
    }
    
    animate() {
        this.update();
        this.render();
        requestAnimationFrame(() => this.animate());
    }
}

class SpaceTimeNode {
    constructor(x, y) {
        this.originalX = x;
        this.originalY = y;
        this.x = x;
        this.y = y;
        this.warpX = 0;
        this.warpY = 0;
    }
    
    resetPosition() {
        this.x = this.originalX;
        this.y = this.originalY;
        this.warpX = 0;
        this.warpY = 0;
    }
    
    applyWarp(warpX, warpY) {
        this.warpX = warpX;
        this.warpY = warpY;
        this.x = this.originalX + warpX;
        this.y = this.originalY + warpY;
    }
}

class WarpField {
    constructor(x, y, intense = false, life = 500) {
        this.x = x;
        this.y = y;
        this.radius = intense ? 150 : 80;
        this.maxRadius = this.radius;
        this.intensity = intense ? 3.0 : 1.0;
        this.baseIntensity = this.intensity;
        this.rotation = 0;
        this.spiralArms = 6;
        this.finished = false;
        this.life = life;
        this.maxLife = life;
        this.pulsation = 0;
        this.waveRings = [];
        
        this.createWaveRings();
    }
    
    createWaveRings() {
        for (let i = 0; i < 5; i++) {
            this.waveRings.push({
                radius: i * 30,
                speed: 1 + i * 0.3,
                phase: i * Math.PI / 3,
                amplitude: 1 - i * 0.15
            });
        }
    }
    
    stabilize() {
        this.intensity = this.baseIntensity * 0.3;
    }
    
    update(time) {
        this.rotation += 0.02;
        this.pulsation = Math.sin(time * 2) * 0.3 + 0.7;
        
        // Update wave rings
        this.waveRings.forEach(ring => {
            ring.phase += ring.speed * 0.05;
            ring.radius += ring.speed * 0.5;
            
            // Reset ring when it gets too large
            if (ring.radius > this.maxRadius * 2) {
                ring.radius = 0;
            }
        });
        
        this.life--;
        if (this.life <= 0) {
            this.finished = true;
        }
    }
    
    getInfluenceAt(x, y) {
        const dx = x - this.x;
        const dy = y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > this.radius) {
            return { x: 0, y: 0 };
        }
        
        const strength = (1 - distance / this.radius) * this.intensity * this.pulsation;
        const angle = Math.atan2(dy, dx);
        
        // Spiral warp pattern
        const spiralAngle = angle + this.rotation + (distance / this.radius) * Math.PI;
        const warpMagnitude = Math.sin(spiralAngle * this.spiralArms) * strength * 10;
        
        return {
            x: Math.cos(spiralAngle + Math.PI / 2) * warpMagnitude,
            y: Math.sin(spiralAngle + Math.PI / 2) * warpMagnitude
        };
    }
    
    render(ctx) {
        const alpha = this.life / this.maxLife;
        
        ctx.save();
        ctx.translate(this.x, this.y);
        
        // Render wave rings
        this.waveRings.forEach(ring => {
            const ringAlpha = ring.amplitude * alpha * this.pulsation;
            ctx.strokeStyle = `rgba(100, 200, 255, ${ringAlpha * 0.5})`;
            ctx.lineWidth = 2;
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#64c8ff';
            
            ctx.beginPath();
            ctx.arc(0, 0, ring.radius, 0, Math.PI * 2);
            ctx.stroke();
        });
        
        // Render spiral arms
        ctx.strokeStyle = `rgba(150, 150, 255, ${alpha * this.pulsation * 0.6})`;
        ctx.lineWidth = 3;
        
        for (let arm = 0; arm < this.spiralArms; arm++) {
            const armAngle = (arm / this.spiralArms) * Math.PI * 2 + this.rotation;
            
            ctx.beginPath();
            for (let r = 0; r < this.radius; r += 5) {
                const spiralAngle = armAngle + (r / this.radius) * Math.PI * 2;
                const x = Math.cos(spiralAngle) * r;
                const y = Math.sin(spiralAngle) * r;
                
                if (r === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.stroke();
        }
        
        // Central warp core
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 20);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${alpha * this.pulsation})`);
        gradient.addColorStop(0.5, `rgba(100, 200, 255, ${alpha * this.pulsation * 0.7})`);
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, 20, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
}

class GravitationalWell {
    constructor(x, y, mass, massive = false) {
        this.x = x;
        this.y = y;
        this.mass = mass;
        this.maxMass = mass;
        this.eventHorizon = massive ? 50 : 25;
        this.accretionDisk = [];
        this.gravitationalLensing = [];
        this.finished = false;
        this.life = massive ? 800 : 400;
        this.maxLife = this.life;
        this.massive = massive;
        this.rotation = 0;
        
        this.createAccretionDisk();
        this.createLensingEffects();
    }
    
    createAccretionDisk() {
        for (let i = 0; i < (this.massive ? 40 : 20); i++) {
            const angle = Math.random() * Math.PI * 2;
            const radius = this.eventHorizon + Math.random() * 80;
            
            this.accretionDisk.push({
                angle: angle,
                radius: radius,
                speed: 1 / (radius * 0.1),
                intensity: 1 - (radius - this.eventHorizon) / 80,
                originalRadius: radius
            });
        }
    }
    
    createLensingEffects() {
        for (let i = 0; i < 8; i++) {
            this.gravitationalLensing.push({
                angle: (i / 8) * Math.PI * 2,
                distance: 100 + i * 20,
                curvature: 1 / (i + 1)
            });
        }
    }
    
    weaken() {
        this.mass = this.maxMass * 0.5;
    }
    
    update(time) {
        this.rotation += 0.01;
        
        // Update accretion disk
        this.accretionDisk.forEach(particle => {
            particle.angle += particle.speed;
            
            // Particles spiral inward
            particle.radius -= 0.3;
            if (particle.radius <= this.eventHorizon) {
                particle.radius = particle.originalRadius;
            }
            
            // Update intensity based on distance
            particle.intensity = 1 - (particle.radius - this.eventHorizon) / 80;
        });
        
        // Update lensing effects
        this.gravitationalLensing.forEach(lens => {
            lens.angle += 0.02;
        });
        
        this.life--;
        if (this.life <= 0) {
            this.finished = true;
        }
    }
    
    getInfluenceAt(x, y) {
        const dx = x - this.x;
        const dy = y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance === 0) return { x: 0, y: 0 };
        
        // Gravitational force follows inverse square law
        const force = (this.mass * 100) / (distance * distance);
        const limitedForce = Math.min(force, 50); // Prevent singularities
        
        // Direction toward the well
        const forceX = -(dx / distance) * limitedForce;
        const forceY = -(dy / distance) * limitedForce;
        
        return { x: forceX, y: forceY };
    }
    
    render(ctx) {
        const alpha = this.life / this.maxLife;
        
        ctx.save();
        ctx.translate(this.x, this.y);
        
        // Render gravitational lensing effects
        this.gravitationalLensing.forEach(lens => {
            const lensX = Math.cos(lens.angle) * lens.distance;
            const lensY = Math.sin(lens.angle) * lens.distance;
            
            ctx.strokeStyle = `rgba(200, 100, 255, ${alpha * 0.3})`;
            ctx.lineWidth = 1;
            
            // Curved space representation
            ctx.beginPath();
            ctx.arc(lensX, lensY, 10, 0, Math.PI * 2);
            ctx.stroke();
        });
        
        // Render accretion disk
        this.accretionDisk.forEach(particle => {
            const particleX = Math.cos(particle.angle) * particle.radius;
            const particleY = Math.sin(particle.angle) * particle.radius;
            
            ctx.fillStyle = `rgba(255, 150, 0, ${particle.intensity * alpha})`;
            ctx.beginPath();
            ctx.arc(particleX, particleY, 2, 0, Math.PI * 2);
            ctx.fill();
            
            // Heat trail
            ctx.strokeStyle = `rgba(255, 100, 0, ${particle.intensity * alpha * 0.5})`;
            ctx.lineWidth = 1;
            const trailLength = 20;
            const trailStartX = Math.cos(particle.angle - trailLength / particle.radius) * particle.radius;
            const trailStartY = Math.sin(particle.angle - trailLength / particle.radius) * particle.radius;
            
            ctx.beginPath();
            ctx.moveTo(trailStartX, trailStartY);
            ctx.lineTo(particleX, particleY);
            ctx.stroke();
        });
        
        // Render event horizon
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.eventHorizon);
        gradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
        gradient.addColorStop(0.8, 'rgba(50, 0, 50, 0.8)');
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, this.eventHorizon, 0, Math.PI * 2);
        ctx.fill();
        
        // Ergosphere (for massive wells)
        if (this.massive) {
            ctx.strokeStyle = `rgba(255, 0, 255, ${alpha * 0.5})`;
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.arc(0, 0, this.eventHorizon * 1.5, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]);
        }
        
        ctx.restore();
    }
}

class DimensionalRift {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 5;
        this.maxWidth = 40;
        this.height = 80;
        this.energy = [];
        this.finished = false;
        this.life = 600;
        this.maxLife = 600;
        this.closing = false;
        this.rotation = Math.random() * Math.PI;
        this.dimensionalParticles = [];
        
        this.createEnergyField();
        this.createDimensionalParticles();
    }
    
    createEnergyField() {
        for (let i = 0; i < 20; i++) {
            this.energy.push({
                x: (Math.random() - 0.5) * this.maxWidth,
                y: (Math.random() - 0.5) * this.height,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                intensity: Math.random(),
                hue: Math.random() * 60 + 260 // Purple to blue range
            });
        }
    }
    
    createDimensionalParticles() {
        for (let i = 0; i < 15; i++) {
            this.dimensionalParticles.push({
                x: (Math.random() - 0.5) * this.maxWidth * 2,
                y: (Math.random() - 0.5) * this.height * 2,
                fromDimension: Math.random() > 0.5,
                phase: Math.random() * Math.PI * 2,
                speed: 0.5 + Math.random() * 1.5
            });
        }
    }
    
    closeRift() {
        this.closing = true;
    }
    
    update(time) {
        if (this.closing) {
            this.width *= 0.95;
            this.height *= 0.98;
            
            if (this.width < 1) {
                this.finished = true;
            }
        } else {
            // Rift opens over time
            this.width = Math.min(this.maxWidth, this.width + 0.3);
        }
        
        // Update energy field
        this.energy.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Contain within rift bounds
            if (Math.abs(particle.x) > this.maxWidth) particle.vx *= -0.8;
            if (Math.abs(particle.y) > this.height) particle.vy *= -0.8;
            
            particle.intensity += (Math.random() - 0.5) * 0.1;
            particle.intensity = Math.max(0, Math.min(1, particle.intensity));
        });
        
        // Update dimensional particles
        this.dimensionalParticles.forEach(particle => {
            particle.phase += particle.speed * 0.1;
            
            // Particles move between dimensions
            if (particle.fromDimension) {
                particle.x *= 0.99; // Converge to rift
                particle.y *= 0.99;
            } else {
                particle.x *= 1.01; // Diverge from rift
                particle.y *= 1.01;
            }
            
            // Reset if too far
            if (Math.abs(particle.x) > this.maxWidth * 3) {
                particle.x = (Math.random() - 0.5) * this.maxWidth;
                particle.y = (Math.random() - 0.5) * this.height;
                particle.fromDimension = !particle.fromDimension;
            }
        });
        
        this.life--;
        if (this.life <= 0 && !this.closing) {
            this.closeRift();
        }
    }
    
    render(ctx) {
        const alpha = this.life / this.maxLife;
        
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        // Render dimensional rift opening
        const gradient = ctx.createLinearGradient(-this.width/2, 0, this.width/2, 0);
        gradient.addColorStop(0, 'transparent');
        gradient.addColorStop(0.1, 'rgba(100, 0, 200, 0.8)');
        gradient.addColorStop(0.5, 'rgba(0, 0, 0, 1)');
        gradient.addColorStop(0.9, 'rgba(100, 0, 200, 0.8)');
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(-this.width/2, -this.height/2, this.width, this.height);
        
        // Render energy field
        this.energy.forEach(particle => {
            const size = particle.intensity * 3;
            
            ctx.fillStyle = `hsla(${particle.hue}, 80%, 70%, ${particle.intensity * alpha})`;
            ctx.shadowBlur = 5;
            ctx.shadowColor = `hsl(${particle.hue}, 80%, 70%)`;
            
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
            ctx.fill();
        });
        
        // Render dimensional particles
        this.dimensionalParticles.forEach(particle => {
            const visibility = Math.sin(particle.phase) * 0.5 + 0.5;
            const size = 2 + Math.sin(particle.phase * 2);
            
            ctx.fillStyle = `rgba(${particle.fromDimension ? '255, 100, 0' : '0, 255, 255'}, ${visibility * alpha})`;
            
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
            ctx.fill();
            
            // Dimensional trail
            if (visibility > 0.5) {
                ctx.strokeStyle = `rgba(${particle.fromDimension ? '255, 100, 0' : '0, 255, 255'}, ${visibility * alpha * 0.5})`;
                ctx.lineWidth = 1;
                
                ctx.beginPath();
                ctx.moveTo(particle.x - particle.vx * 5, particle.y - particle.vy * 5);
                ctx.lineTo(particle.x, particle.y);
                ctx.stroke();
            }
        });
        
        // Rift edges
        ctx.strokeStyle = `rgba(150, 0, 255, ${alpha})`;
        ctx.lineWidth = 2;
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#9600ff';
        
        ctx.beginPath();
        ctx.moveTo(-this.width/2, -this.height/2);
        ctx.lineTo(-this.width/2, this.height/2);
        ctx.moveTo(this.width/2, -this.height/2);
        ctx.lineTo(this.width/2, this.height/2);
        ctx.stroke();
        
        ctx.restore();
    }
}

class Wormhole {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 0;
        this.maxRadius = 80;
        this.throat = [];
        this.finished = false;
        this.life = 400;
        this.maxLife = 400;
        this.rotation = 0;
        this.tunnelDepth = [];
        
        this.createTunnelGeometry();
    }
    
    createTunnelGeometry() {
        for (let i = 0; i < 10; i++) {
            const depth = i / 10;
            this.tunnelDepth.push({
                radius: this.maxRadius * (0.3 + depth * 0.7),
                z: depth,
                rotation: Math.random() * Math.PI * 2
            });
        }
        
        for (let i = 0; i < 30; i++) {
            this.throat.push({
                angle: (i / 30) * Math.PI * 2,
                radius: this.maxRadius * 0.8,
                oscillation: Math.random() * Math.PI * 2,
                speed: 0.02 + Math.random() * 0.03
            });
        }
    }
    
    update(time) {
        this.rotation += 0.02;
        
        // Wormhole opens and then closes
        if (this.life > this.maxLife * 0.7) {
            this.radius += 2; // Opening
        } else if (this.life < this.maxLife * 0.3) {
            this.radius *= 0.95; // Closing
        }
        
        this.radius = Math.min(this.radius, this.maxRadius);
        
        // Update tunnel geometry
        this.tunnelDepth.forEach(layer => {
            layer.rotation += 0.01 * (1 + layer.z);
        });
        
        // Update throat particles
        this.throat.forEach(particle => {
            particle.oscillation += particle.speed;
        });
        
        this.life--;
        if (this.life <= 0 || this.radius < 5) {
            this.finished = true;
        }
    }
    
    getInfluenceAt(x, y) {
        const dx = x - this.x;
        const dy = y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > this.radius * 2) {
            return { x: 0, y: 0 };
        }
        
        // Wormhole creates a complex warp pattern
        const angle = Math.atan2(dy, dx);
        const strength = (1 - distance / (this.radius * 2)) * 20;
        
        // Spiral inward pattern
        const spiralAngle = angle + this.rotation + (distance / this.radius) * Math.PI * 2;
        
        return {
            x: Math.cos(spiralAngle) * strength,
            y: Math.sin(spiralAngle) * strength
        };
    }
    
    render(ctx) {
        const alpha = Math.min(1, this.life / (this.maxLife * 0.3));
        
        ctx.save();
        ctx.translate(this.x, this.y);
        
        // Render tunnel depth layers (back to front)
        for (let i = this.tunnelDepth.length - 1; i >= 0; i--) {
            const layer = this.tunnelDepth[i];
            const layerRadius = (layer.radius * this.radius) / this.maxRadius;
            const layerAlpha = alpha * (1 - layer.z * 0.7);
            
            ctx.save();
            ctx.rotate(layer.rotation);
            
            // Tunnel ring
            const gradient = ctx.createRadialGradient(0, 0, layerRadius * 0.3, 0, 0, layerRadius);
            gradient.addColorStop(0, `rgba(100, 0, 200, ${layerAlpha * 0.3})`);
            gradient.addColorStop(0.7, `rgba(200, 100, 255, ${layerAlpha * 0.6})`);
            gradient.addColorStop(1, `rgba(255, 255, 255, ${layerAlpha})`);
            
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 3;
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#c864ff';
            
            ctx.beginPath();
            ctx.arc(0, 0, layerRadius, 0, Math.PI * 2);
            ctx.stroke();
            
            // Tunnel geometry lines
            for (let j = 0; j < 8; j++) {
                const angle = (j / 8) * Math.PI * 2;
                const innerRadius = layerRadius * 0.3;
                
                ctx.strokeStyle = `rgba(150, 100, 255, ${layerAlpha * 0.4})`;
                ctx.lineWidth = 1;
                
                ctx.beginPath();
                ctx.moveTo(Math.cos(angle) * innerRadius, Math.sin(angle) * innerRadius);
                ctx.lineTo(Math.cos(angle) * layerRadius, Math.sin(angle) * layerRadius);
                ctx.stroke();
            }
            
            ctx.restore();
        }
        
        // Render throat particles
        this.throat.forEach(particle => {
            const currentRadius = particle.radius + Math.sin(particle.oscillation) * 10;
            const x = Math.cos(particle.angle + this.rotation) * currentRadius;
            const y = Math.sin(particle.angle + this.rotation) * currentRadius;
            
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.shadowBlur = 8;
            ctx.shadowColor = '#ffffff';
            
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fill();
        });
        
        // Central event horizon
        const centralGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.radius * 0.5);
        centralGradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
        centralGradient.addColorStop(0.8, 'rgba(50, 0, 100, 0.8)');
        centralGradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = centralGradient;
        ctx.beginPath();
        ctx.arc(0, 0, this.radius * 0.5, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
}

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    new SpaceTimeWarpingSystem();
});