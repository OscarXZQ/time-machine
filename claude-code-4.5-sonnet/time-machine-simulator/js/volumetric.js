class VolumetricRenderer {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.gl = this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl');
        this.programs = {};
        this.uniforms = {};
        this.buffers = {};
        this.textures = {};
        this.time = 0;
        
        this.init();
        this.createShaders();
        this.createBuffers();
        this.animate();
    }
    
    init() {
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '-2';
        this.canvas.style.mixBlendMode = 'screen';
        
        this.resize();
        document.getElementById('particles-canvas').appendChild(this.canvas);
        
        if (!this.gl) {
            console.warn('WebGL not supported, falling back to canvas');
            return;
        }
        
        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        if (this.gl) {
            this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        }
    }
    
    createShader(source, type) {
        const shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);
        
        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            console.error('Shader compilation error:', this.gl.getShaderInfoLog(shader));
            this.gl.deleteShader(shader);
            return null;
        }
        
        return shader;
    }
    
    createProgram(vertexSource, fragmentSource) {
        const vertexShader = this.createShader(vertexSource, this.gl.VERTEX_SHADER);
        const fragmentShader = this.createShader(fragmentSource, this.gl.FRAGMENT_SHADER);
        
        if (!vertexShader || !fragmentShader) return null;
        
        const program = this.gl.createProgram();
        this.gl.attachShader(program, vertexShader);
        this.gl.attachShader(program, fragmentShader);
        this.gl.linkProgram(program);
        
        if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
            console.error('Program linking error:', this.gl.getProgramInfoLog(program));
            this.gl.deleteProgram(program);
            return null;
        }
        
        return program;
    }
    
    createShaders() {
        const vertexShader = `
            attribute vec2 a_position;
            varying vec2 v_texCoord;
            
            void main() {
                gl_Position = vec4(a_position, 0.0, 1.0);
                v_texCoord = a_position * 0.5 + 0.5;
            }
        `;
        
        const volumetricFragment = `
            precision mediump float;
            
            uniform float u_time;
            uniform vec2 u_resolution;
            uniform vec2 u_mouse;
            varying vec2 v_texCoord;
            
            float random(vec2 st) {
                return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
            }
            
            float noise(vec2 st) {
                vec2 i = floor(st);
                vec2 f = fract(st);
                
                float a = random(i);
                float b = random(i + vec2(1.0, 0.0));
                float c = random(i + vec2(0.0, 1.0));
                float d = random(i + vec2(1.0, 1.0));
                
                vec2 u = f * f * (3.0 - 2.0 * f);
                
                return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
            }
            
            float fbm(vec2 st) {
                float value = 0.0;
                float amplitude = 0.5;
                float frequency = 0.0;
                
                for(int i = 0; i < 5; i++) {
                    value += amplitude * noise(st);
                    st *= 2.0;
                    amplitude *= 0.5;
                }
                return value;
            }
            
            vec3 volumetricLight(vec2 uv, vec2 lightPos, float intensity) {
                vec2 dir = uv - lightPos;
                float dist = length(dir);
                dir = normalize(dir);
                
                float raySteps = 50.0;
                float stepSize = dist / raySteps;
                vec3 rayColor = vec3(0.0);
                
                for(float i = 0.0; i < raySteps; i += 1.0) {
                    vec2 samplePos = lightPos + dir * i * stepSize;
                    
                    float noiseValue = fbm(samplePos * 8.0 + u_time * 0.5);
                    noiseValue += fbm(samplePos * 16.0 - u_time * 0.3) * 0.5;
                    
                    float density = smoothstep(0.3, 0.8, noiseValue);
                    density *= exp(-dist * 0.8);
                    density *= intensity;
                    
                    vec3 lightColor = vec3(0.2 + sin(u_time) * 0.3, 0.8, 1.0);
                    rayColor += density * lightColor * stepSize;
                }
                
                return rayColor;
            }
            
            void main() {
                vec2 uv = v_texCoord;
                vec2 st = uv * 4.0;
                
                // Multiple light sources
                vec3 color = vec3(0.0);
                
                // Main flux capacitor light
                vec2 center = vec2(0.5, 0.5);
                color += volumetricLight(uv, center, 1.5 + sin(u_time * 2.0) * 0.5);
                
                // Orbital lights
                float orbitRadius = 0.3;
                for(float i = 0.0; i < 3.0; i++) {
                    float angle = u_time * 0.8 + i * 2.094; // 2π/3
                    vec2 orbitPos = center + vec2(cos(angle), sin(angle)) * orbitRadius;
                    color += volumetricLight(uv, orbitPos, 0.8) * vec3(1.0, 0.5, 0.8);
                }
                
                // Add some atmospheric scattering
                float atmosphere = fbm(st + u_time * 0.2);
                atmosphere = smoothstep(0.2, 0.9, atmosphere);
                color += atmosphere * vec3(0.1, 0.2, 0.4) * 0.3;
                
                // Add temporal distortion
                vec2 distortedUV = uv + sin(uv.yx * 10.0 + u_time) * 0.02;
                float distortion = fbm(distortedUV * 6.0 + u_time * 0.4);
                color += distortion * vec3(0.8, 0.2, 1.0) * 0.2;
                
                gl_FragColor = vec4(color, 0.6);
            }
        `;
        
        this.programs.volumetric = this.createProgram(vertexShader, volumetricFragment);
        
        if (this.programs.volumetric) {
            this.uniforms.volumetric = {
                time: this.gl.getUniformLocation(this.programs.volumetric, 'u_time'),
                resolution: this.gl.getUniformLocation(this.programs.volumetric, 'u_resolution'),
                mouse: this.gl.getUniformLocation(this.programs.volumetric, 'u_mouse'),
                position: this.gl.getAttribLocation(this.programs.volumetric, 'a_position')
            };
        }
    }
    
    createBuffers() {
        if (!this.gl) return;
        
        // Full screen quad
        const positions = [
            -1, -1,
             1, -1,
            -1,  1,
             1, -1,
             1,  1,
            -1,  1
        ];
        
        this.buffers.position = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.position);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(positions), this.gl.STATIC_DRAW);
    }
    
    render() {
        if (!this.gl || !this.programs.volumetric) return;
        
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        
        this.gl.useProgram(this.programs.volumetric);
        
        // Set uniforms
        this.gl.uniform1f(this.uniforms.volumetric.time, this.time);
        this.gl.uniform2f(this.uniforms.volumetric.resolution, this.canvas.width, this.canvas.height);
        this.gl.uniform2f(this.uniforms.volumetric.mouse, 0.5, 0.5);
        
        // Set up vertex attributes
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.position);
        this.gl.enableVertexAttribArray(this.uniforms.volumetric.position);
        this.gl.vertexAttribPointer(this.uniforms.volumetric.position, 2, this.gl.FLOAT, false, 0, 0);
        
        // Draw
        this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
    }
    
    animate() {
        this.time += 0.016; // 60fps
        this.render();
        requestAnimationFrame(() => this.animate());
    }
}

class AdvancedLighting {
    constructor() {
        this.lightSources = [];
        this.dynamicLights = [];
        this.init();
    }
    
    init() {
        this.createStaticLights();
        this.createDynamicLights();
        this.bindEvents();
        this.animate();
    }
    
    createStaticLights() {
        // Main flux capacitor glow
        this.addLight({
            element: '.flux-center',
            intensity: 1.5,
            color: '#00ffff',
            radius: 200,
            pulse: true,
            pulseSpeed: 0.02
        });
        
        // Energy readings lights
        document.querySelectorAll('.reading').forEach((reading, index) => {
            this.addLight({
                element: reading,
                intensity: 0.8,
                color: '#00ff00',
                radius: 80,
                flicker: true,
                flickerSpeed: 0.05
            });
        });
        
        // Status panel lights
        document.querySelectorAll('.status-fill').forEach((fill, index) => {
            this.addLight({
                element: fill,
                intensity: 0.6,
                color: '#ffdd00',
                radius: 150,
                wave: true,
                waveSpeed: 0.03
            });
        });
    }
    
    createDynamicLights() {
        // Create floating light orbs
        for (let i = 0; i < 8; i++) {
            const light = document.createElement('div');
            light.className = 'dynamic-light';
            light.style.cssText = `
                position: fixed;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                pointer-events: none;
                z-index: 100;
                background: radial-gradient(circle, rgba(0,255,255,0.8) 0%, transparent 70%);
                box-shadow: 0 0 40px rgba(0,255,255,0.6);
                animation: floatLight ${8 + Math.random() * 4}s ease-in-out infinite;
            `;
            
            const style = document.createElement('style');
            style.textContent += `
                @keyframes floatLight {
                    0%, 100% {
                        transform: translate(${Math.random() * window.innerWidth}px, ${Math.random() * window.innerHeight}px) scale(0.5);
                        opacity: 0.3;
                    }
                    50% {
                        transform: translate(${Math.random() * window.innerWidth}px, ${Math.random() * window.innerHeight}px) scale(1.2);
                        opacity: 0.8;
                    }
                }
            `;
            
            if (!document.getElementById('dynamic-lights-style')) {
                style.id = 'dynamic-lights-style';
                document.head.appendChild(style);
            }
            
            document.body.appendChild(light);
            this.dynamicLights.push(light);
        }
    }
    
    addLight(config) {
        const lightData = {
            ...config,
            phase: Math.random() * Math.PI * 2,
            baseIntensity: config.intensity
        };
        
        this.lightSources.push(lightData);
        this.createLightElement(lightData);
    }
    
    createLightElement(lightData) {
        const lightEl = document.createElement('div');
        lightEl.className = 'volumetric-light';
        lightEl.style.cssText = `
            position: absolute;
            pointer-events: none;
            border-radius: 50%;
            z-index: 50;
            background: radial-gradient(circle, ${lightData.color}40 0%, ${lightData.color}20 30%, transparent 70%);
            box-shadow: 0 0 ${lightData.radius}px ${lightData.color}80;
            filter: blur(2px);
            mix-blend-mode: screen;
        `;
        
        lightData.element = lightEl;
        document.body.appendChild(lightEl);
    }
    
    updateLights() {
        this.lightSources.forEach(light => {
            if (typeof light.element === 'string') {
                const target = document.querySelector(light.element);
                if (!target) return;
                
                const rect = target.getBoundingClientRect();
                light.element.style.left = (rect.left + rect.width / 2 - light.radius / 2) + 'px';
                light.element.style.top = (rect.top + rect.height / 2 - light.radius / 2) + 'px';
            }
            
            let intensity = light.baseIntensity;
            
            if (light.pulse) {
                intensity += Math.sin(Date.now() * light.pulseSpeed + light.phase) * 0.3;
            }
            
            if (light.flicker) {
                intensity += (Math.random() - 0.5) * light.flickerSpeed * 10;
            }
            
            if (light.wave) {
                intensity += Math.sin(Date.now() * light.waveSpeed + light.phase) * 0.2;
            }
            
            light.element.style.width = light.radius + 'px';
            light.element.style.height = light.radius + 'px';
            light.element.style.opacity = Math.max(0.1, Math.min(1, intensity));
        });
    }
    
    bindEvents() {
        document.addEventListener('travel-start', () => {
            this.createEnergyBurst();
        });
        
        document.addEventListener('calibrate-start', () => {
            this.createCalibrateFlash();
        });
    }
    
    createEnergyBurst() {
        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                const burst = document.createElement('div');
                burst.style.cssText = `
                    position: fixed;
                    left: ${window.innerWidth / 2}px;
                    top: ${window.innerHeight / 2}px;
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    background: radial-gradient(circle, #ffffff 0%, #00ffff 50%, transparent 100%);
                    pointer-events: none;
                    z-index: 200;
                    animation: energyBurst 2s ease-out forwards;
                `;
                
                const angle = (i / 15) * Math.PI * 2;
                const distance = 300 + Math.random() * 200;
                
                const burstStyle = document.createElement('style');
                burstStyle.textContent = `
                    @keyframes energyBurst {
                        0% {
                            transform: translate(-50%, -50%) scale(0);
                            opacity: 1;
                        }
                        50% {
                            transform: translate(${Math.cos(angle) * distance - 50}%, ${Math.sin(angle) * distance - 50}%) scale(3);
                            opacity: 0.8;
                        }
                        100% {
                            transform: translate(${Math.cos(angle) * distance * 2 - 50}%, ${Math.sin(angle) * distance * 2 - 50}%) scale(0);
                            opacity: 0;
                        }
                    }
                `;
                
                document.head.appendChild(burstStyle);
                document.body.appendChild(burst);
                
                setTimeout(() => {
                    burst.remove();
                    burstStyle.remove();
                }, 2000);
            }, i * 100);
        }
    }
    
    createCalibrateFlash() {
        const flash = document.createElement('div');
        flash.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle at 50% 50%, rgba(255,255,0,0.3) 0%, transparent 70%);
            pointer-events: none;
            z-index: 150;
            animation: calibrateFlash 1s ease-out forwards;
        `;
        
        const flashStyle = document.createElement('style');
        flashStyle.textContent = `
            @keyframes calibrateFlash {
                0% { opacity: 0; transform: scale(0.8); }
                20% { opacity: 1; transform: scale(1.2); }
                100% { opacity: 0; transform: scale(1.5); }
            }
        `;
        
        document.head.appendChild(flashStyle);
        document.body.appendChild(flash);
        
        setTimeout(() => {
            flash.remove();
            flashStyle.remove();
        }, 1000);
    }
    
    animate() {
        this.updateLights();
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    new VolumetricRenderer();
    new AdvancedLighting();
});