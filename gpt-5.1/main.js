// ChronoDrive Time Machine Simulator

const state = {
  currentYear: 2124,
  targetEra: "Neo-Celestial Age",
  isJumping: false,
  entropy: 97.3,
};

const yearSlider = document.getElementById("yearSlider");
const targetYearEl = document.getElementById("targetYear");
const targetEraEl = document.getElementById("targetEra");
const engageButton = document.getElementById("engageButton");
const logList = document.getElementById("logList");
const systemClock = document.getElementById("systemClock");
const entropyBudget = document.getElementById("entropyBudget");
const driftValueEl = document.getElementById("driftValue");
const fluxValueEl = document.getElementById("fluxValue");

const jumpOverlay = document.querySelector(".jump-overlay");
const jumpFlare = document.querySelector(".jump-flare");
const jumpTunnel = document.querySelector(".jump-tunnel");
const jumpGrid = document.querySelector(".jump-grid");
const jumpRings = document.querySelector(".jump-rings");
const jumpStreaks = document.querySelector(".jump-streaks");

function updateParallaxFromPointer(event) {
  const x = (event.clientX / window.innerWidth - 0.5) * 2;
  const y = (event.clientY / window.innerHeight - 0.5) * 2;
  document.documentElement.style.setProperty("--parallax-x", x.toFixed(3));
  document.documentElement.style.setProperty("--parallax-y", y.toFixed(3));
}

function formatYear(year) {
  if (year === 0) return "0 (Epoch)";
  const suffix = year > 0 ? "CE" : "BCE";
  const abs = Math.abs(year);
  return `${abs.toLocaleString("en-US")} ${suffix}`;
}

function computeEra(year) {
  if (year <= -50000) return "Primordial Starlight";
  if (year <= -10000) return "Icebound Dawn";
  if (year <= -500) return "Ancient Empires";
  if (year <= 1400) return "Classical & Mystic Age";
  if (year <= 1900) return "Industrial Horizon";
  if (year <= 2100) return "Digital Singularity Verge";
  if (year <= 5000) return "Interstellar Expansion";
  if (year <= 20000) return "Galactic Weave";
  if (year <= 60000) return "Transdimensional Cartography";
  return "Heat-Death Whisper";
}

function computeEraBand(year) {
  const a = Math.abs(year);
  if (a <= 2500) return "present";
  if (a <= 20000) return "future";
  if (a <= 60000) return "deep";
  return "extreme";
}

function pulseEntropy() {
  state.entropy -= 0.02;
  if (state.entropy < 72) state.entropy = 97.3;
  entropyBudget.textContent = `${state.entropy.toFixed(1)}%`;
}

function updateDriftAndFlux(year) {
  const normalized = (year + 120000) / 240000;
  const drift = 0.0009 + normalized * 0.004;
  const flux = 20 + normalized * 80;
  driftValueEl.textContent = `${drift.toFixed(4)} Δt`;
  fluxValueEl.textContent = `${flux.toFixed(1)} kΩt`;
}

function addLogEntry({ tag, message, meta }) {
  const entry = document.createElement("div");
  entry.className = "log-entry log-entry--new";

  const tagEl = document.createElement("div");
  tagEl.className = `tag ${tag}`;
  tagEl.textContent = tag === "tag--system" ? "SYSTEM" : tag === "tag--warning" ? "WARNING" : "JUMP";

  const ts = document.createElement("div");
  ts.className = "timestamp";
  ts.textContent = new Date().toISOString().split("T")[1].replace("Z", " UTC");

  const msg = document.createElement("div");
  msg.className = "message";
  msg.textContent = message;

  const metaEl = document.createElement("div");
  metaEl.className = "meta";
  metaEl.textContent = meta;

  entry.appendChild(tagEl);
  entry.appendChild(ts);
  entry.appendChild(msg);
  entry.appendChild(metaEl);

  logList.prepend(entry);

  requestAnimationFrame(() => {
    entry.classList.remove("log-entry--new");
  });

  const entries = logList.querySelectorAll(".log-entry");
  if (entries.length > 40) {
    entries[entries.length - 1].remove();
  }
}

function setYearFromSlider() {
  const year = Number(yearSlider.value);
  state.currentYear = year;
  const era = computeEra(year);
  state.targetEra = era;
   const eraBand = computeEraBand(year);
   document.body.setAttribute("data-era", eraBand);

  targetYearEl.textContent = formatYear(year);
  targetEraEl.textContent = era;
  updateDriftAndFlux(year);

  const hue = ((year + 120000) / 240000) * 360;
  document.documentElement.style.setProperty("--core-hue", `${hue}`);

  const danger = Math.min(1, Math.abs(year) / 90000);
  document.documentElement.style.setProperty("--danger-level", danger.toFixed(2));

  if (core) {
    const color = new THREE.Color(`hsl(${hue}, 95%, 70%)`);
    core.material.color = color.clone().offsetHSL(0, -0.2, -0.1);
    core.material.emissive = color;
  }
}

function applyPreset(button) {
  const year = Number(button.dataset.year);
  const label = button.dataset.label;
  if (Number.isNaN(year)) return;

  yearSlider.value = year;
  setYearFromSlider();

  addLogEntry({
    tag: "tag--system",
    message: `Preset engaged: ${label}`,
    meta: `Target locked at ${formatYear(year)}`,
  });
}

function updateSystemClock() {
  const now = new Date();
  const time = now.toISOString().split("T")[1].replace("Z", " UTC");
  systemClock.textContent = time;
}

let jumpTimeline = null;

function performJump() {
  if (state.isJumping) return;
  state.isJumping = true;

  const year = state.currentYear;
  const era = state.targetEra;
  const body = document.body;

  body.dataset.state = "jump";

  addLogEntry({
    tag: "tag--jump",
    message: `Initiating temporal jump to ${formatYear(year)}`,
    meta: `Era: ${era} • Flux ${fluxValueEl.textContent} • Drift ${driftValueEl.textContent}`,
  });

  if (jumpTimeline) {
    jumpTimeline.kill();
  }

  jumpOverlay.style.opacity = 1;
  jumpFlare.style.opacity = 0;
  jumpTunnel.style.opacity = 0;
  jumpGrid.style.opacity = 0;
  if (jumpRings) jumpRings.style.opacity = 0;
  if (jumpStreaks) jumpStreaks.style.opacity = 0;

  jumpTimeline = gsap.timeline({
    onComplete: () => {
      state.isJumping = false;
      body.dataset.state = "idle";
      gsap.to(jumpOverlay, { opacity: 0, duration: 0.6, ease: "power2.out" });

      addLogEntry({
        tag: "tag--system",
        message: `Arrived at ${formatYear(year)}`,
        meta: `Local timeline stabilized • Era: ${era}`,
      });
    },
  });

  jumpTimeline
    .to(jumpFlare, {
      opacity: 1,
      duration: 0.18,
      ease: "power4.out",
    })
    .to(
      jumpFlare,
      {
        opacity: 0,
        duration: 0.35,
        ease: "power2.inOut",
      },
      ">0.02"
    )
    .to(
      jumpTunnel,
      {
        opacity: 1,
        scale: 1.1,
        duration: 0.35,
        ease: "sine.out",
      },
      "<"
    )
    .to(
      jumpTunnel,
      {
        rotation: 540,
        scale: 2.4,
        duration: 1.4,
        ease: "power3.inOut",
      },
      "<"
    )
    .to(
      jumpGrid,
      {
        opacity: 0.9,
        duration: 0.7,
        ease: "power2.out",
      },
      "<0.1"
    )
    .to(
      ".hud",
      {
        filter: "blur(3px) brightness(0.7)",
        duration: 0.25,
        ease: "power2.out",
      },
      "<"
    )
    .to(
      ".hud",
      {
        filter: "blur(0px) brightness(1)",
        duration: 0.7,
        ease: "power2.inOut",
      },
      ">0.3"
    )
    .to(
      jumpTunnel,
      {
        opacity: 0,
        duration: 0.5,
        ease: "sine.inOut",
      },
      ">-0.2"
    )
    .to(
      jumpGrid,
      {
        opacity: 0,
        duration: 0.5,
        ease: "sine.inOut",
      },
      "<"
    );

  if (jumpRings) {
    jumpTimeline.to(
      jumpRings,
      {
        opacity: 0.9,
        scale: 1.3,
        duration: 0.7,
        ease: "power2.out",
      },
      "<"
    );
  }

  if (jumpStreaks) {
    jumpTimeline.to(
      jumpStreaks,
      {
        opacity: 0.85,
        xPercent: -20,
        duration: 0.7,
        ease: "power3.out",
      },
      "<0.1"
    );
  }

  if (core && particles) {
    gsap.to(core.rotation, {
      x: "+=6",
      y: "+=6",
      duration: 1.4,
      ease: "power3.inOut",
    });
    gsap.to(core.scale, {
      x: 1.18,
      y: 1.18,
      z: 1.18,
      yoyo: true,
      repeat: 1,
      duration: 0.5,
      ease: "sine.inOut",
    });
    gsap.to(particles.material, {
      opacity: 1,
      duration: 0.4,
      yoyo: true,
      repeat: 1,
      ease: "sine.inOut",
    });
  }

  if (camera) {
    gsap.to(camera.position, {
      z: 4.5,
      duration: 0.7,
      yoyo: true,
      repeat: 1,
      ease: "power3.inOut",
    });
  }
}

const chips = document.querySelectorAll(".chip");
chips.forEach((chip) => chip.addEventListener("click", () => applyPreset(chip)));
yearSlider.addEventListener("input", setYearFromSlider);
engageButton.addEventListener("click", performJump);
window.addEventListener("pointermove", updateParallaxFromPointer);

setYearFromSlider();
updateSystemClock();
setInterval(updateSystemClock, 1000);
setInterval(pulseEntropy, 2000);

addLogEntry({
  tag: "tag--system",
  message: "ChronoDrive temporal core synchronized.",
  meta: "Subsystems nominal • Ready for destination input",
});

addLogEntry({
  tag: "tag--warning",
  message: "Timeline edits are strictly simulated.",
  meta: "No actual causality will be harmed.",
});

// Three.js temporal core

let renderer, scene, camera, core, halo, particles;
let animationFrameId;

function initCore3D() {
  const container = document.getElementById("timeCore3D");
  if (!container) return;

  const width = container.clientWidth;
  const height = container.clientHeight;

  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(window.devicePixelRatio || 1.5);
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(32, width / height, 0.1, 100);
  camera.position.set(0, 0, 7);

  const ambient = new THREE.AmbientLight(0xffffff, 0.9);
  scene.add(ambient);

  const keyLight = new THREE.PointLight(0x7dffef, 1.3, 40);
  keyLight.position.set(6, 4, 8);
  scene.add(keyLight);

  const rimLight = new THREE.PointLight(0xff77ff, 1, 40);
  rimLight.position.set(-6, -3, -6);
  scene.add(rimLight);

  const coreGeom = new THREE.TorusKnotGeometry(1.3, 0.35, 220, 32, 2, 5);
  const coreMat = new THREE.MeshStandardMaterial({
    color: 0x94fff0,
    metalness: 0.15,
    roughness: 0.1,
    emissive: 0x64fff0,
    emissiveIntensity: 0.8,
    transparent: true,
    opacity: 0.99,
  });
  core = new THREE.Mesh(coreGeom, coreMat);
  scene.add(core);

  const haloGeom = new THREE.SphereGeometry(2.15, 64, 64);
  const haloMat = new THREE.MeshBasicMaterial({
    color: 0x7fffff,
    transparent: true,
    opacity: 0.25,
    side: THREE.BackSide,
  });
  halo = new THREE.Mesh(haloGeom, haloMat);
  scene.add(halo);

  const particleCount = 9000;
  const positions = new Float32Array(particleCount * 3);
  const speeds = new Float32Array(particleCount);

  for (let i = 0; i < particleCount; i++) {
    const r = 3 + Math.random() * 10;
    const angle = Math.random() * Math.PI * 2;
    const y = (Math.random() - 0.5) * 6;
    const x = Math.cos(angle) * r;
    const z = Math.sin(angle) * r;
    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
    speeds[i] = 0.02 + Math.random() * 0.06;
  }

  const particleGeom = new THREE.BufferGeometry();
  particleGeom.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const particleMat = new THREE.PointsMaterial({
    color: 0x9dffff,
    size: 0.04,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.8,
  });

  particles = new THREE.Points(particleGeom, particleMat);
  particles.userData.speeds = speeds;
  scene.add(particles);

  const coreMatUniforms = { intensity: 0.8 };
  gsap.to(coreMatUniforms, {
    intensity: 1.4,
    duration: 2.2,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
    onUpdate: () => {
      coreMat.emissiveIntensity = coreMatUniforms.intensity;
      halo.material.opacity = 0.2 + (coreMatUniforms.intensity - 0.8) * 0.4;
    },
  });

  let mouseX = 0;
  let mouseY = 0;

  container.addEventListener("pointermove", (event) => {
    const rect = container.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    mouseX = x;
    mouseY = y;
  });

  const clock = new THREE.Clock();

  function animate() {
    const t = clock.getElapsedTime();

    if (core) {
      core.rotation.x = t * 0.28 + mouseY * 0.5;
      core.rotation.y = t * 0.34 + mouseX * 0.6;
    }

    if (particles) {
      const positionsAttr = particles.geometry.getAttribute("position");
      const speedsAttr = particles.userData.speeds;
      const count = positionsAttr.count;
      for (let i = 0; i < count; i++) {
        const z = positionsAttr.getZ(i) - speedsAttr[i];
        positionsAttr.setZ(i, z < -18 ? 14 : z);
      }
      positionsAttr.needsUpdate = true;
      particles.rotation.y += 0.0008;
    }

    renderer.render(scene, camera);
    animationFrameId = requestAnimationFrame(animate);
  }

  animate();

  window.addEventListener("resize", () => {
    const w = container.clientWidth;
    const h = container.clientHeight;
    if (w === 0 || h === 0) return;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  });
}

if (typeof THREE !== "undefined") {
  initCore3D();
} else {
  addLogEntry({
    tag: "tag--warning",
    message: "Three.js core renderer unavailable.",
    meta: "3D visualization downgraded • Check network access.",
  });
}

window.addEventListener("beforeunload", () => {
  if (animationFrameId) cancelAnimationFrame(animationFrameId);
  if (renderer) {
    renderer.dispose();
  }
});
