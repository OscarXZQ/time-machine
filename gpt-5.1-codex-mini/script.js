const timeSlider = document.getElementById('timeSlider');
const timeYear = document.getElementById('timeYear');
const timeTitle = document.getElementById('timeTitle');
const timeDesc = document.getElementById('timeDesc');
const energyFill = document.getElementById('energyFill');
const fieldIndex = document.getElementById('fieldIndex');
const chronoEcho = document.getElementById('chronoEcho');
const fluxValue = document.getElementById('fluxValue');
const gridOverlay = document.getElementById('gridOverlay');
const particleStream = document.getElementById('particleStream');
const temporalPulse = document.getElementById('temporalPulse');
const fluxBadge = document.querySelector('.flux-badge');
const launchButton = document.getElementById('launchButton');
const warpOverlay = document.getElementById('warpOverlay');
const temporalPane = document.querySelector('.temporal-pane');
let paneGlitchTimer;

const timelineData = [
  {
    year: '1889',
    title: 'Steam Pulse Archive',
    desc: 'Earliest chronal drafts where copper and coal blended with speculative energy fields.',
    energy: 38,
    field: '00.3',
    echo: 'Chronal ripples shiver along the deck, letting you feel every converging signal.',
    signature: '42.0'
  },
  {
    year: '1962',
    title: 'Neon Pulse City',
    desc: 'The skyline fractures softly as neon ferments in projected auroras and analog satellites.',
    energy: 55,
    field: '01.8',
    echo: 'Neon ferries carve refracted trails, amplifying the city’s retro-future heartbeat.',
    signature: '57.1'
  },
  {
    year: '1999',
    title: 'Digital Mirage',
    desc: 'The turn of the millennium blooms into glass data towers while timelines overlap in glass.',
    energy: 68,
    field: '02.6',
    echo: 'Glass towers split into cascading data, and the simulator hums in chrome harmonics.',
    signature: '64.4'
  },
  {
    year: '2071',
    title: 'Luminous Verge',
    desc: 'Orbital gardens pulse with bioluminescent vines and tactile holograms shimmer nearby.',
    energy: 82,
    field: '03.5',
    echo: 'Orbital gardens bloom, weaving luminous threads across the Chrono-Deck’s periphery.',
    signature: '75.8'
  },
  {
    year: '2145',
    title: 'Aetherium Dawn',
    desc: 'Hyperlight corridors align and gravity becomes a malleable ribbon for the new culture.',
    energy: 94,
    field: '04.0',
    echo: 'Hyperlight corridors pulse with serenity; gravity bends like molten light.',
    signature: '89.2'
  }
];

function renderState(index) {
  const target = timelineData[index] || timelineData[0];
  timeYear.textContent = target.year;
  timeTitle.textContent = target.title;
  timeDesc.textContent = target.desc;
  energyFill.style.width = `${target.energy}%`;
  fieldIndex.textContent = target.field;
  if (chronoEcho) {
    chronoEcho.textContent = target.echo;
  }
  if (fluxValue) {
    fluxValue.textContent = target.signature;
  }
  syncPulseStrength(target.energy);
}

timeSlider.addEventListener('input', (event) => {
  renderState(Number(event.target.value));
  triggerPaneGlitch();
  pulseGrid();
  triggerTemporalPulse();
  highlightFluxBadge();
  sparkParticleStream();
});

launchButton.addEventListener('click', () => {
  warpOverlay.classList.add('active');
  animateButtonRipple();
  pulseGrid();
  highlightFluxBadge();
  sparkParticleStream();
  setTimeout(() => warpOverlay.classList.remove('active'), 2200);
});

renderState(0);

function triggerPaneGlitch() {
  if (!temporalPane) return;
  temporalPane.classList.add('glitching');
  clearTimeout(paneGlitchTimer);
  paneGlitchTimer = setTimeout(() => {
    temporalPane.classList.remove('glitching');
  }, 360);
}

function animateButtonRipple() {
  const ripple = document.createElement('span');
  ripple.className = 'button-ripple';
  launchButton.appendChild(ripple);
  ripple.addEventListener('animationend', () => ripple.remove());
}

function pulseGrid() {
  if (!gridOverlay) return;
  gridOverlay.classList.add('pulse');
  setTimeout(() => gridOverlay.classList.remove('pulse'), 480);
}

function syncPulseStrength(energy) {
  const intensity = Math.min(1, energy / 110 + 0.15);
  document.documentElement.style.setProperty('--pulse-strength', intensity.toFixed(2));
}

function triggerTemporalPulse() {
  if (!temporalPulse) return;
  temporalPulse.classList.add('active');
  setTimeout(() => temporalPulse.classList.remove('active'), 900);
}

function highlightFluxBadge() {
  if (!fluxBadge) return;
  fluxBadge.classList.add('glow');
  setTimeout(() => fluxBadge.classList.remove('glow'), 700);
}

function sparkParticleStream() {
  if (!particleStream) return;
  particleStream.classList.add('burst');
  setTimeout(() => particleStream.classList.remove('burst'), 1000);
}
