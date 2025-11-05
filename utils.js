let switchInterval;

function startAutoImageSwitch() {
  if (switchInterval) clearInterval(switchInterval);

  switchInterval = setInterval(() => {
    imgIndex = (imgIndex + 1) % imgNames.length;
    loadImg(imgNames[imgIndex]);
  }, 3000);
}

function loadImg(imgName) {
  loadImage(imgName, (newImg) => {
    img = newImg;
    img.loadPixels();
    img.resize(IMG_RESIZED_WIDTH, 0);
    setupImg();
    updateParticlesTarget();
  });
}

function setupImg() {
  if (!img || !img.pixels || img.pixels.length === 0) {
    console.warn("setupImg: img not ready");
    return;
  }

  indices = [];
  for (let x = 0; x < img.width; x += IMG_SCAN_STEPS * 4) {
    for (let y = 0; y < img.height; y += IMG_SCAN_STEPS * 4) {
      const index = (x + y * img.width) * 4;
      const a = img.pixels[index + 3];
      if (a > 10) {
        indices.push(index);
      }
    }
  }
}

function updateParticlesTarget() {
  if (indices.length === 0 || particles.length === 0) return;

  particles.forEach(p => {
    const index = indices[int(random(indices.length))];
    const x = (index / 4) % img.width;
    const y = Math.floor((index / 4) / img.width);

    const r = img.pixels[index];
    const g = img.pixels[index + 1];
    const b = img.pixels[index + 2];
    const a = img.pixels[index + 3];

    p.target.set(x, y);
    p.color = color(r, g, b, a);
    p.mapped_angle = map(x, 0, img.width, -180, 180) + map(y, 0, img.height, -180, 180);
  });
}

function spawnParticles() {
  particles = [];
  setupImg();

  if (indices.length === 0) {
    console.warn("spawnParticles: no pixels found");
    return;
  }

  maxSize = map(particleCount, MIN_PARTICLE_COUNT, MAX_PARTICLE_COUNT, MAX_PARTICLE_SIZE, MIN_PARTICLE_SIZE);

  for (let i = 0; i < particleCount; i++) {
    let attempts = 0;
    let newParticle = null;

    while (newParticle === null && attempts < 20) {
      const index = indices[int(random(indices.length))];
      const x = (index / 4) % img.width;
      const y = Math.floor((index / 4) / img.width);

      const r = img.pixels[index];
      const g = img.pixels[index + 1];
      const b = img.pixels[index + 2];
      const a = img.pixels[index + 3];

      let size = maxSize;

      if (particles.length > 0) {
        let smallestSize = null;
        for (let p of particles) {
          const d = dist(x, y, p.target.x, p.target.y);
          const newSize = (d - p.size / 2) * 2;
          if (smallestSize === null || newSize < smallestSize) {
            smallestSize = newSize;
          }
        }
        if (smallestSize > 0) {
          size = min(smallestSize, maxSize) * 0.75;
        }
      }

      newParticle = new Particle(x, y, size, color(r, g, b, a));
      attempts++;
    }

    if (newParticle) particles.push(newParticle);
  }
}
