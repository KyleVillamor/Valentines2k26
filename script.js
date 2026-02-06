// ===== ELEMENTS =====
const title = document.querySelector('h1');
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const responseText = document.getElementById('responseText');
const gif = document.querySelector('.gif');

// Click sounds
const yesSound = document.getElementById('yesSound');
const noSound = document.getElementById('noSound');
const mediaQuery = window.matchMedia('(min-width: 300px)');

const match = document.getElementById('match');
const paper = document.getElementById('paper');
const paperImg = document.getElementById('paperImg');

let burning = false;

// ===== AUDIO UNLOCK =====
let audioUnlocked = false;

function unlockAllAudio() {
  if (audioUnlocked) return;

  [yesSound, noSound].forEach(sound => {
    sound.play().then(() => {
      sound.pause();
      sound.currentTime = 0;
    }).catch(() => {});
  });

  audioUnlocked = true;
}

yesBtn.addEventListener('click', unlockAllAudio, { once: true });
noBtn.addEventListener('click', unlockAllAudio, { once: true });

yesBtn.addEventListener('click', () => {
    if (window.matchMedia('(min-width: 3s00px)').matches) {
    // Mobile
    responseText.textContent = 'Yaaayyy! I’m so happy! Hehehehe';
    title.textContent = 'Happy Valentines Day!';
  } else {
    // Desktop
    responseText.textContent = 'Yaaayyy! I’m so happy! Hehehe';
    title.textContent = 'Happy Valentines Day!';
  }
  gif.src = 'https://i.pinimg.com/originals/b4/65/34/b46534530b0ef3ffac6636f068dd2e12.gif';

  yesBtn.style.display = 'none';
  noBtn.style.display = 'none';

  yesSound.play();

  confetti({
    particleCount: 120,
    spread: 70,
    origin: { y: 0.6 },
  });
});

noBtn.addEventListener('click', () => {
  noSound.play();

  const container = document.querySelector('.container');
  const rect = container.getBoundingClientRect();
  const btnRect = noBtn.getBoundingClientRect();
  const padding = 12;

  const maxX = rect.width - btnRect.width - padding;
  const maxY = rect.height - btnRect.height - padding;

  const x = Math.max(padding, Math.random() * maxX);
  const y = Math.max(padding, Math.random() * maxY);

  noBtn.style.position = 'absolute';
  noBtn.style.left = `${x}px`;
  noBtn.style.top = `${y}px`;
});


// ===== HEARTS CANVAS =====
const canvas = document.getElementById('heartsCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const hearts = [];
class Heart {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = -50;
    this.size = Math.random() * 20 + 10;
    this.speed = Math.random() * 2 + 1;
    this.color = Math.random() > 0.5 ? '#ff6f61' : '#ff3b2f';
  }
  draw() {
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.bezierCurveTo(
      this.x - this.size/2, this.y - this.size/4,
      this.x - this.size, this.y + this.size/2,
      this.x, this.y + this.size
    );
    ctx.bezierCurveTo(
      this.x + this.size, this.y + this.size/2,
      this.x + this.size/2, this.y - this.size/4,
      this.x, this.y
    );
    ctx.closePath();
    ctx.fillStyle = this.color;
    ctx.fill();
  }
  update() {
    this.y += this.speed;
    if (this.y > canvas.height) {
      this.y = -50;
      this.x = Math.random() * canvas.width;
    }
    this.draw();
  }
}

document.addEventListener('mousemove', (e) => {
  const heart = new Heart();
  heart.x = e.clientX;
  heart.y = e.clientY;
  heart.size = 10;
  heart.speed = 1;
  hearts.push(heart);
});

function init() { for (let i=0;i<50;i++) hearts.push(new Heart()); }
function animate() { ctx.clearRect(0,0,canvas.width,canvas.height); hearts.forEach(h=>h.update()); requestAnimationFrame(animate); }
init(); animate();

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// ===== MATCH & BURN =====
match.addEventListener('click', () => {
  if (burning) return;
  burning = true;

  // 1️⃣ Move match to center
  match.classList.add('move-to-center');

  // 2️⃣ Wait for match to reach center (match CSS transition ~1s)
  setTimeout(() => {
    match.classList.add('ignite');       // flame bigger
    paper.classList.add('burning');      // show burn flames

    // Start burning the image
    let burn = 1;
    const burnInterval = setInterval(() => {
      burn -= 0.06;
      paperImg.style.transform = `scale(${burn})`;
      paperImg.style.opacity = burn;
      createAsh();
    }, 120);

    // Stop burn after 2 seconds
    setTimeout(() => {
      clearInterval(burnInterval);
      paper.classList.remove('burning');
      paper.classList.add('burn-done');
      match.classList.add('fade-out');

      setTimeout(() => {
        paperImg.style.display = 'none';
        document.querySelector('.box').style.display = 'none';
      }, 0);
    }, 1800);

  }, 800); // <-- delay matches match transition to center
});


function createAsh() {
  const ash = document.createElement('div');
  ash.className = 'ash';
  ash.style.left = Math.random() * 80 + 10 + '%';
  ash.style.top = '50%';
  paper.appendChild(ash);

  let y = 0;
  const fall = setInterval(() => {
    y += 3;
    ash.style.transform = `translateY(${y}px)`;
    ash.style.opacity -= 0.05;
    if (y > 90) { ash.remove(); clearInterval(fall); }
  }, 30);
}
