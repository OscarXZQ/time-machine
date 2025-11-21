class TimeMachine {
    constructor() {
        this.currentTime = new Date();
        this.destinationTime = new Date(1955, 10, 5, 6, 0, 0);
        this.isCalibrated = false;
        this.isTraveling = false;
        
        this.initializeElements();
        this.bindEvents();
        this.updateDisplay();
        this.startStatusAnimations();
        
        this.historicalPeriods = {
            prehistoric: {
                year: -10000,
                month: 6,
                day: 15,
                hour: 12,
                description: "You've arrived in the Paleolithic Era! Massive woolly mammoths roam the earth, and early humans are just beginning to create cave paintings. The air is crisp and pure, untouched by civilization."
            },
            ancient: {
                year: -3000,
                month: 7,
                day: 1,
                hour: 10,
                description: "Welcome to ancient Egypt during the Old Kingdom! The great pyramids are being constructed, pharaohs rule the land, and the Nile flows with life-giving waters. Hieroglyphs tell stories of gods and kings."
            },
            medieval: {
                year: 1347,
                month: 5,
                day: 20,
                hour: 14,
                description: "You've landed in medieval Europe! Knights in shining armor ride through cobblestone streets, magnificent castles tower over the landscape, and scholars debate philosophy in great universities."
            },
            industrial: {
                year: 1885,
                month: 3,
                day: 15,
                hour: 9,
                description: "The Industrial Revolution is in full swing! Steam engines chug through the countryside, factories fill the air with smoke, and inventors are creating machines that will change the world forever."
            },
            future: {
                year: 2157,
                month: 12,
                day: 31,
                hour: 23,
                description: "Welcome to the far future! Flying cars soar between crystalline skyscrapers, AI assistants help humans in daily life, and humanity has begun to colonize distant stars. The possibilities are endless!"
            }
        };
        
        this.audioContext = null;
        this.initializeAudio();
    }
    
    initializeElements() {
        this.elements = {
            currentTimeDisplay: document.getElementById('current-time'),
            destinationTimeDisplay: document.getElementById('destination-time'),
            yearInput: document.getElementById('year-input'),
            monthInput: document.getElementById('month-input'),
            dayInput: document.getElementById('day-input'),
            hourInput: document.getElementById('hour-input'),
            calibrateBtn: document.getElementById('calibrate-btn'),
            travelBtn: document.getElementById('travel-btn'),
            emergencyBtn: document.getElementById('emergency-btn'),
            travelOverlay: document.getElementById('travel-overlay'),
            arrivalOverlay: document.getElementById('arrival-overlay'),
            travelProgress: document.getElementById('travel-progress'),
            arrivalDate: document.getElementById('arrival-date'),
            arrivalDescription: document.getElementById('arrival-description'),
            arrivalContinue: document.getElementById('arrival-continue'),
            stabilityFill: document.getElementById('stability-fill'),
            coherenceFill: document.getElementById('coherence-fill'),
            powerFill: document.getElementById('power-fill'),
            currentMarker: document.getElementById('current-marker'),
            destinationMarker: document.getElementById('destination-marker'),
            presetBtns: document.querySelectorAll('.preset-btn')
        };
    }
    
    bindEvents() {
        this.elements.calibrateBtn.addEventListener('click', () => this.calibrate());
        this.elements.travelBtn.addEventListener('click', () => this.initiateTravel());
        this.elements.emergencyBtn.addEventListener('click', () => this.emergencyReturn());
        this.elements.arrivalContinue.addEventListener('click', () => this.closeArrival());
        
        [this.elements.yearInput, this.elements.monthInput, this.elements.dayInput, this.elements.hourInput]
            .forEach(input => {
                input.addEventListener('input', () => this.updateDestination());
                input.addEventListener('focus', () => this.playSound('beep'));
            });
        
        this.elements.presetBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.setPreset(e.target.dataset.destination));
        });
        
        setInterval(() => this.updateCurrentTime(), 1000);
    }
    
    initializeAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (error) {
            console.log('Audio not supported');
        }
    }
    
    playSound(type) {
        if (!this.audioContext) return;
        
        switch(type) {
            case 'beep':
                this.createBeepSound();
                break;
            case 'calibrate':
                this.createCalibrateSound();
                break;
            case 'travel':
                this.createTravelSound();
                break;
            case 'arrival':
                this.createArrivalSound();
                break;
        }
    }
    
    createBeepSound() {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        const filterNode = this.audioContext.createBiquadFilter();
        
        oscillator.connect(filterNode);
        filterNode.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
        filterNode.frequency.setValueAtTime(1200, this.audioContext.currentTime);
        filterNode.Q.setValueAtTime(5, this.audioContext.currentTime);
        
        gainNode.gain.setValueAtTime(0.15, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.1);
    }
    
    createCalibrateSound() {
        // Create multiple oscillators for a richer sound
        for (let i = 0; i < 3; i++) {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            const filterNode = this.audioContext.createBiquadFilter();
            
            oscillator.connect(filterNode);
            filterNode.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            const baseFreq = 440 + (i * 110);
            oscillator.frequency.setValueAtTime(baseFreq, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(baseFreq * 2, this.audioContext.currentTime + 0.5);
            
            filterNode.frequency.setValueAtTime(800 + (i * 200), this.audioContext.currentTime);
            filterNode.frequency.exponentialRampToValueAtTime(1600 + (i * 400), this.audioContext.currentTime + 0.5);
            filterNode.Q.setValueAtTime(3, this.audioContext.currentTime);
            
            gainNode.gain.setValueAtTime(0.1 / (i + 1), this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
            
            oscillator.start(this.audioContext.currentTime + (i * 0.1));
            oscillator.stop(this.audioContext.currentTime + 0.5);
        }
    }
    
    createTravelSound() {
        // Create a complex travel sound with multiple layers
        const masterGain = this.audioContext.createGain();
        masterGain.connect(this.audioContext.destination);
        
        // Bass rumble
        const bassOsc = this.audioContext.createOscillator();
        const bassGain = this.audioContext.createGain();
        bassOsc.type = 'sawtooth';
        bassOsc.frequency.setValueAtTime(60, this.audioContext.currentTime);
        bassOsc.frequency.exponentialRampToValueAtTime(40, this.audioContext.currentTime + 2);
        bassGain.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        bassGain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 2);
        bassOsc.connect(bassGain);
        bassGain.connect(masterGain);
        bassOsc.start(this.audioContext.currentTime);
        bassOsc.stop(this.audioContext.currentTime + 2);
        
        // High frequency sweep
        const sweepOsc = this.audioContext.createOscillator();
        const sweepGain = this.audioContext.createGain();
        const sweepFilter = this.audioContext.createBiquadFilter();
        sweepOsc.type = 'sine';
        sweepOsc.frequency.setValueAtTime(200, this.audioContext.currentTime);
        sweepOsc.frequency.exponentialRampToValueAtTime(4000, this.audioContext.currentTime + 1.5);
        sweepFilter.frequency.setValueAtTime(500, this.audioContext.currentTime);
        sweepFilter.frequency.exponentialRampToValueAtTime(2000, this.audioContext.currentTime + 1.5);
        sweepFilter.Q.setValueAtTime(8, this.audioContext.currentTime);
        sweepGain.gain.setValueAtTime(0.2, this.audioContext.currentTime);
        sweepGain.gain.setValueAtTime(0.4, this.audioContext.currentTime + 0.8);
        sweepGain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 2);
        sweepOsc.connect(sweepFilter);
        sweepFilter.connect(sweepGain);
        sweepGain.connect(masterGain);
        sweepOsc.start(this.audioContext.currentTime);
        sweepOsc.stop(this.audioContext.currentTime + 2);
        
        // Noise layer
        const bufferSize = this.audioContext.sampleRate * 2;
        const noiseBuffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }
        
        const noiseSource = this.audioContext.createBufferSource();
        const noiseGain = this.audioContext.createGain();
        const noiseFilter = this.audioContext.createBiquadFilter();
        noiseSource.buffer = noiseBuffer;
        noiseFilter.type = 'bandpass';
        noiseFilter.frequency.setValueAtTime(1000, this.audioContext.currentTime);
        noiseFilter.Q.setValueAtTime(2, this.audioContext.currentTime);
        noiseGain.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 2);
        noiseSource.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(masterGain);
        noiseSource.start(this.audioContext.currentTime);
        noiseSource.stop(this.audioContext.currentTime + 2);
    }
    
    createArrivalSound() {
        // Create a triumphant arrival chord
        const frequencies = [523.25, 659.25, 783.99, 1046.50]; // C major chord
        
        frequencies.forEach((freq, index) => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            const filterNode = this.audioContext.createBiquadFilter();
            
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime);
            
            filterNode.frequency.setValueAtTime(freq * 2, this.audioContext.currentTime);
            filterNode.Q.setValueAtTime(1, this.audioContext.currentTime);
            
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.15 / frequencies.length, this.audioContext.currentTime + 0.1);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 1.5);
            
            oscillator.connect(filterNode);
            filterNode.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.start(this.audioContext.currentTime + (index * 0.1));
            oscillator.stop(this.audioContext.currentTime + 1.5);
        });
    }
    
    updateCurrentTime() {
        this.currentTime = new Date();
        this.updateDisplay();
    }
    
    updateDestination() {
        const year = parseInt(this.elements.yearInput.value) || 2024;
        const month = parseInt(this.elements.monthInput.value) - 1 || 0;
        const day = parseInt(this.elements.dayInput.value) || 1;
        const hour = parseInt(this.elements.hourInput.value) || 0;
        
        this.destinationTime = new Date(year, month, day, hour, 0, 0);
        this.updateDisplay();
        this.updateTimelineMarkers();
        this.isCalibrated = false;
        this.updateStatusBars();
    }
    
    updateDisplay() {
        this.elements.currentTimeDisplay.textContent = this.formatDateTime(this.currentTime);
        this.elements.destinationTimeDisplay.textContent = this.formatDateTime(this.destinationTime);
    }
    
    formatDateTime(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hour = String(date.getHours()).padStart(2, '0');
        const minute = String(date.getMinutes()).padStart(2, '0');
        const second = String(date.getSeconds()).padStart(2, '0');
        
        return `${year}-${month}-${day} | ${hour}:${minute}:${second}`;
    }
    
    setPreset(destination) {
        const preset = this.historicalPeriods[destination];
        if (!preset) return;
        
        this.elements.yearInput.value = preset.year > 0 ? preset.year : Math.abs(preset.year);
        this.elements.monthInput.value = preset.month;
        this.elements.dayInput.value = preset.day;
        this.elements.hourInput.value = preset.hour;
        
        this.updateDestination();
        this.playSound('beep');
        
        this.elements.presetBtns.forEach(btn => btn.style.transform = '');
        event.target.style.transform = 'scale(0.95)';
        setTimeout(() => event.target.style.transform = '', 200);
    }
    
    calibrate() {
        if (this.isTraveling) return;
        
        this.playSound('calibrate');
        this.elements.calibrateBtn.style.animation = 'pulse 0.5s ease-in-out 3';
        
        document.dispatchEvent(new CustomEvent('calibrate-start'));
        
        setTimeout(() => {
            this.isCalibrated = true;
            this.elements.calibrateBtn.style.animation = '';
            this.updateStatusBars();
            this.showNotification('Temporal coordinates calibrated successfully!', '#ffdd00');
        }, 1500);
    }
    
    async initiateTravel() {
        if (!this.isCalibrated || this.isTraveling) {
            this.showNotification('Please calibrate temporal coordinates first!', '#ff4444');
            return;
        }
        
        this.isTraveling = true;
        this.playSound('travel');
        
        document.dispatchEvent(new CustomEvent('travel-start'));
        
        this.elements.travelOverlay.style.display = 'flex';
        
        let progress = 0;
        const progressInterval = setInterval(() => {
            progress += Math.random() * 15 + 5;
            if (progress > 100) progress = 100;
            
            this.elements.travelProgress.style.width = progress + '%';
            
            if (progress >= 100) {
                clearInterval(progressInterval);
                setTimeout(() => this.arriveAtDestination(), 500);
            }
        }, 200);
        
        this.updateStatusBars();
    }
    
    arriveAtDestination() {
        this.currentTime = new Date(this.destinationTime);
        
        this.elements.travelOverlay.style.display = 'none';
        this.elements.arrivalOverlay.style.display = 'flex';
        
        this.playSound('arrival');
        
        const destination = this.findHistoricalPeriod();
        this.elements.arrivalDate.textContent = this.formatDateTime(this.currentTime);
        this.elements.arrivalDescription.textContent = destination.description;
        
        this.isTraveling = false;
        this.isCalibrated = false;
        this.updateDisplay();
        this.updateTimelineMarkers();
        this.updateStatusBars();
        
        this.elements.travelProgress.style.width = '0%';
    }
    
    findHistoricalPeriod() {
        const year = this.destinationTime.getFullYear();
        
        if (year < 0) return this.historicalPeriods.prehistoric;
        if (year < 500) return this.historicalPeriods.ancient;
        if (year < 1500) return this.historicalPeriods.medieval;
        if (year < 1950) return this.historicalPeriods.industrial;
        if (year > 2100) return this.historicalPeriods.future;
        
        return {
            description: `You've arrived in ${year}! The world around you reflects the technology, culture, and society of this fascinating time period. Take a moment to observe the unique characteristics of this era.`
        };
    }
    
    emergencyReturn() {
        this.playSound('beep');
        
        this.currentTime = new Date();
        this.destinationTime = new Date();
        
        this.elements.yearInput.value = this.currentTime.getFullYear();
        this.elements.monthInput.value = this.currentTime.getMonth() + 1;
        this.elements.dayInput.value = this.currentTime.getDate();
        this.elements.hourInput.value = this.currentTime.getHours();
        
        this.isTraveling = false;
        this.isCalibrated = false;
        
        this.elements.travelOverlay.style.display = 'none';
        this.elements.arrivalOverlay.style.display = 'none';
        
        this.updateDisplay();
        this.updateTimelineMarkers();
        this.updateStatusBars();
        
        this.showNotification('Emergency return to present time successful!', '#00ff00');
    }
    
    closeArrival() {
        this.elements.arrivalOverlay.style.display = 'none';
    }
    
    updateTimelineMarkers() {
        const currentYear = this.currentTime.getFullYear();
        const destYear = this.destinationTime.getFullYear();
        
        const minYear = Math.min(currentYear, destYear, -10000);
        const maxYear = Math.max(currentYear, destYear, 3000);
        const range = maxYear - minYear;
        
        const currentPos = ((currentYear - minYear) / range) * 90 + 5;
        const destPos = ((destYear - minYear) / range) * 90 + 5;
        
        this.elements.currentMarker.style.left = currentPos + '%';
        this.elements.destinationMarker.style.left = destPos + '%';
    }
    
    updateStatusBars() {
        let stability = this.isCalibrated ? 95 : Math.random() * 40 + 30;
        let coherence = this.isCalibrated ? 98 : Math.random() * 50 + 25;
        let power = this.isTraveling ? 100 : (this.isCalibrated ? 85 : Math.random() * 60 + 20);
        
        this.elements.stabilityFill.style.width = stability + '%';
        this.elements.coherenceFill.style.width = coherence + '%';
        this.elements.powerFill.style.width = power + '%';
        
        if (stability < 50) this.elements.stabilityFill.style.background = 'linear-gradient(90deg, #ff0000 0%, #ff4444 100%)';
        else if (stability < 80) this.elements.stabilityFill.style.background = 'linear-gradient(90deg, #ffaa00 0%, #ffdd00 100%)';
        else this.elements.stabilityFill.style.background = 'linear-gradient(90deg, #00ff00 0%, #44ff44 100%)';
    }
    
    startStatusAnimations() {
        setInterval(() => {
            if (!this.isCalibrated && !this.isTraveling) {
                this.updateStatusBars();
            }
        }, 2000);
        
        setInterval(() => {
            const energyReadings = document.querySelectorAll('.reading');
            energyReadings.forEach(reading => {
                const baseValue = parseFloat(reading.dataset.value);
                const variation = (Math.random() - 0.5) * 0.1;
                const newValue = baseValue + variation;
                
                if (reading.textContent.includes('GW')) {
                    reading.textContent = newValue.toFixed(2) + ' GW';
                } else if (reading.textContent.includes('MPH')) {
                    reading.textContent = Math.round(newValue) + ' MPH';
                } else if (reading.textContent.includes('%')) {
                    reading.textContent = newValue.toFixed(1) + '%';
                }
            });
        }, 1500);
    }
    
    showNotification(message, color) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0,0,0,0.9);
            color: ${color};
            padding: 15px 20px;
            border-radius: 10px;
            border: 2px solid ${color};
            font-family: 'Orbitron', monospace;
            font-weight: 700;
            z-index: 10000;
            box-shadow: 0 0 20px ${color}50;
            animation: slideIn 0.5s ease-out;
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideIn 0.5s ease-out reverse';
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const timeMachine = new TimeMachine();
    
    // Custom cursor
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX - 10 + 'px';
        cursor.style.top = e.clientY - 10 + 'px';
    });
    
    // Parallax effect
    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        const header = document.querySelector('.header');
        const fluxCapacitor = document.querySelector('.flux-capacitor');
        
        if (header) {
            header.style.transform = `translate3d(${(mouseX - 0.5) * 20}px, ${(mouseY - 0.5) * 10}px, 0)`;
        }
        
        if (fluxCapacitor) {
            fluxCapacitor.style.transform = `translate3d(${(mouseX - 0.5) * -15}px, ${(mouseY - 0.5) * -15}px, 0) rotateX(${(mouseY - 0.5) * 10}deg) rotateY(${(mouseX - 0.5) * 10}deg)`;
        }
    });
    
    document.addEventListener('click', function enableAudio() {
        if (timeMachine.audioContext && timeMachine.audioContext.state === 'suspended') {
            timeMachine.audioContext.resume();
        }
        document.removeEventListener('click', enableAudio);
    });
});