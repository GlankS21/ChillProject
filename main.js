const SPIN_MULTIPLIER = 100;
const MIN_PARTICLE_COUNT = 0;
const MAX_PARTICLE_COUNT = 4000;
const MIN_PARTICLE_SIZE = 3;
const MAX_PARTICLE_SIZE = 12;
const MIN_FORCE = 0.1;
const MAX_FORCE = 0.4;
const REPULSION_RADIUS = 100;
const REPULSION_STRENGTH = 0.4;
const IMG_RESIZED_WIDTH = 300;
const IMG_SCAN_STEPS = 1;

var imgNames = ["uia.png", "1.webp", "2.png", "3.webp", "4.webp"];

var particles = [];
var indices = [];
var imgIndex = 0;
var drawType = 0;
var particleCount = 4000;
var maxSize = 0;
var img;

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.canvas.oncontextmenu = () => false;
  loadImgAndInit();
}
function loadImgAndInit() {
  loadImage(imgNames[0], (newImg) => {
    img = newImg;
    img.loadPixels();
    img.resize(IMG_RESIZED_WIDTH, 0);
    setupImg();
    spawnParticles();
    startAutoImageSwitch();
  });
}

function draw() {
  background(30);
  noStroke();
  if (img == null) {
    return;
  }
  push();
  translate(width / 2 - img.width / 2, height / 2 - img.height / 2);
  rectMode(CENTER);
  particles.forEach(particle => {
    particle.move();
    push();
    translate(particle.pos.x, particle.pos.y);
    let spin = particle.vel.mag() * SPIN_MULTIPLIER;
    rotate(radians(particle.mapped_angle + spin));
    fill(particle.color);
    ellipse(0, 0, particle.size, particle.size);
    pop();
  });
  pop();
}
