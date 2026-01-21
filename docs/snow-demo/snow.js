const canvas = document.getElementById('snow-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let snowflakes = [];
let ground = [];

// Interaction state
let isDragging = false;
let mouseX = 0;
let mouseY = 0;
let lastMouseX = 0;

// Configuration
const SNOWFLAKE_COUNT = 300;
const MIN_SPEED = 1;
const MAX_SPEED = 3.5;
const MIN_SIZE = 1;
const MAX_SIZE = 4;
const SHOVEL_RADIUS = 40; // Increased radius slightly for better feel

// Persistence
const STORAGE_KEY = 'snow_demo_ground';
let lastSaveTime = 0;

function resize() {
  const oldWidth = width;
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;

  if (!ground.length || width !== oldWidth) {
      if (!ground.length) {
          loadGround();
      }

      if (ground.length !== Math.ceil(width)) {
          const newGround = new Float32Array(Math.ceil(width));
          if (ground.length > 0) {
              const ratio = ground.length / newGround.length;
              for(let i=0; i<newGround.length; i++) {
                  newGround[i] = ground[Math.floor(i * ratio)] || 0;
              }
          } else {
              // Initial fill: 10px + jitter
              for (let i = 0; i < newGround.length; i++) {
                  newGround[i] = 10 + Math.random() * 2;
              }
          }
          ground = newGround;
      }
  }
}

function loadGround() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed)) {
                 ground = new Float32Array(parsed);
            }
        }
    } catch (e) {
        console.error("Failed to load snow data");
    }
}

function saveGround() {
    try {
        if (ground && ground.length > 0) {
           localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(ground)));
        }
    } catch (e) {
        // quota exceeded usually
    }
}

class Snowflake {
  constructor() {
    this.reset(true);
  }

  reset(initial = false) {
    this.x = Math.random() * width;
    this.y = initial ? Math.random() * height : -10;
    this.size = Math.random() * (MAX_SIZE - MIN_SIZE) + MIN_SIZE;
    this.speed = Math.random() * (MAX_SPEED - MIN_SPEED) + MIN_SPEED;
    this.opacity = Math.random() * 0.5 + 0.3;
    this.drift = Math.random() * 2 - 1;
  }

  update() {
    this.y += this.speed;
    this.x += this.drift;

    if (this.x > width) this.x = 0;
    else if (this.x < 0) this.x = width;

    const col = Math.floor(this.x);
    if (col >= 0 && col < ground.length) {
        const currentGroundHeight = ground[col];
        if (this.y + this.size >= height - currentGroundHeight) {
            const moundWidth = Math.ceil(this.size * 2);
            for (let i = -moundWidth; i <= moundWidth; i++) {
                const targetCol = col + i;
                if (targetCol >= 0 && targetCol < ground.length) {
                     const addedHeight = Math.max(0, (this.size - Math.abs(i)/2) * 0.15);
                     ground[targetCol] += addedHeight;
                }
            }
            this.reset();
        }
    } else if (this.y > height) {
         this.reset();
    }
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
    ctx.fill();
    ctx.closePath();
  }
}

function updateShovel() {
    if (!isDragging) return;

    // Movement delta
    const dx = mouseX - lastMouseX;

    // Determine the range of influence
    const startX = Math.floor(mouseX - SHOVEL_RADIUS);
    const endX = Math.floor(mouseX + SHOVEL_RADIUS);

    let materialGathered = 0;

    // Force field / Shovel logic
    // We want to push snow away from the cursor.
    // We treat the shovel as a sphere of radius SHOVEL_RADIUS at (mouseX, mouseY).
    // Any snow inside this sphere is displaced.

    for (let x = startX; x <= endX; x++) {
        if (x >= 0 && x < ground.length) {
            const distX = Math.abs(x - mouseX);

            // Calculate how deep into the ground the shovel circle is at this X
            // Circle equation: y^2 + x^2 = r^2
            // At this x (relative to mouseX), the bottom of the circle is at:
            // circleBottomY = mouseY + sqrt(r^2 - distX^2)

            if (distX < SHOVEL_RADIUS) {
                const circleDepth = Math.sqrt(SHOVEL_RADIUS*SHOVEL_RADIUS - distX*distX);
                const circleBottomY = mouseY + circleDepth;

                // Snow top is at: height - ground[x]
                // We want to ensure snow top is at least below circleBottomY?
                // Wait. If shovel is digging, it pushes snow DOWN or ASIDE.
                // It clears the space occupied by the shovel.
                // So if snow exists ABOVE circleBottomY, we clamp it to circleBottomY.

                // Example: height=1000. mouse=950. r=30. bottom=980.
                // Snow top=900 (thick snow).
                // Snow is above 980? Yes (900 < 980).
                // We clamp snow top to 980.
                // New accumulated height = 1000 - 980 = 20.

                // This seems right for "digging".

                // BUT, what if mouse is ABOVE snow?
                // mouse=800. bottom=830.
                // Snow top=900.
                // 900 < 830? No. 900 > 830. Snow is *below* shovel.
                // Shovel is waving in the air. No snow removed.

                // This matches expected behavior.

                const snowTopY = height - ground[x];

                if (snowTopY < circleBottomY) {
                    // Overlap!
                    const newSnowTopY = circleBottomY;
                    const newThickness = Math.max(0, height - newSnowTopY);

                    // Only update if we are removing snow
                    if (newThickness < ground[x]) {
                        materialGathered += (ground[x] - newThickness);
                        ground[x] = newThickness;
                    }
                }
            }
        }
    }

    // Deposit snow at the edges or in front
    if (materialGathered > 0) {
        let depositCenter;

        // Push in direction of movement with some inertia physics feel
        if (dx > 0) depositCenter = endX + 10;
        else if (dx < 0) depositCenter = startX - 10;
        else {
           // If stationary, spread to immediate sides
           distributeSnow(startX - 5, materialGathered / 2);
           distributeSnow(endX + 5, materialGathered / 2);
           return;
        }

        if (depositCenter !== null) {
             distributeSnow(depositCenter, materialGathered);
        }
    }
}

function distributeSnow(centerX, amount) {
    if (amount <= 0) return;
    const spread = 20;
    // We want to deposit the snow in a pile.
    for (let i = -spread; i <= spread; i++) {
        const x = Math.floor(centerX + i);
        if (x >= 0 && x < ground.length) {
            // Gaussian pile
            const weight = Math.exp(-(i*i)/(2*(spread/3)*(spread/3)));
            ground[x] += (amount / spread) * weight * 1.2; // 1.2 multiplier to fluff up
        }
    }
}

function drawGround() {
    if (!ground.length) return;

    ctx.beginPath();
    ctx.moveTo(0, height);
    for (let i = 0; i < ground.length; i++) {
        ctx.lineTo(i, height - ground[i]);
    }
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);

    const gradient = ctx.createLinearGradient(0, height - 50, 0, height);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
    gradient.addColorStop(1, 'rgba(230, 240, 255, 1)');

    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.closePath();
}

function init() {
  resize();
  loadGround();

  for (let i = 0; i < SNOWFLAKE_COUNT; i++) {
    snowflakes.push(new Snowflake());
  }

  // Events
  canvas.addEventListener('mousedown', (e) => {
      isDragging = true;
      updateMouse(e);
      lastMouseX = e.clientX; // critical start sync
  });
  window.addEventListener('mousemove', (e) => {
      if (isDragging) updateMouse(e);
  });
  window.addEventListener('mouseup', () => { isDragging = false; });

  canvas.addEventListener('touchstart', (e) => {
      isDragging = true;
      updateMouse(e.touches[0]);
      lastMouseX = e.touches[0].clientX;
  }, {passive: false});
  window.addEventListener('touchmove', (e) => {
      if (isDragging) {
          e.preventDefault();
          updateMouse(e.touches[0]);
      }
  }, {passive: false});
  window.addEventListener('touchend', () => { isDragging = false; });

  document.getElementById('reset-btn').addEventListener('click', () => {
      // Reset to 10px
      for(let i=0; i<ground.length; i++) {
          ground[i] = 10 + Math.random() * 2;
      }
      localStorage.removeItem(STORAGE_KEY);
  });

  loop(0);
}

function updateMouse(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
}

function loop(timestamp) {
  ctx.clearRect(0, 0, width, height);

  if (isDragging) {
      updateShovel();
      lastMouseX = mouseX; // Update last position after processing frame
  }

  drawGround();

  if (timestamp - lastSaveTime > 5000) {
      saveGround();
      lastSaveTime = timestamp;
  }

  for (const flake of snowflakes) {
    flake.update();
    flake.draw();
  }

  requestAnimationFrame(loop);
}

window.addEventListener('resize', resize);
window.addEventListener('load', init);
