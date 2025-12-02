window.addEventListener("scroll", () => {
  const header = document.getElementById("main-header");
  if (window.scrollY > 50) {
    header.classList.add("navbar-scrolled");
  } else {
    header.classList.remove("navbar-scrolled");
  }
});
const canvas = document.getElementById("galaxy");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let stars = [];
const numStars = 400;

for (let i = 0; i < numStars; i++) {
  stars.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 1.8,
    vx: (Math.random() - 0.5) * 0.2,
    vy: (Math.random() - 0.5) * 0.2,
    alpha: Math.random(),
  });
}

function animate() {
  ctx.fillStyle = "rgba(5, 10, 20, 0.3)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let star of stars) {
    star.x += star.vx;
    star.y += star.vy;
    if (star.x < 0 || star.x > canvas.width) star.vx *= -1;
    if (star.y < 0 || star.y > canvas.height) star.vy *= -1;

    star.alpha += (Math.random() - 0.5) * 0.05;
    star.alpha = Math.max(0.3, Math.min(star.alpha, 1));

    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0, 212, 255, ${star.alpha})`;
    ctx.shadowBlur = 10;
    ctx.shadowColor = "#00d4ff";
    ctx.fill();
  }

  requestAnimationFrame(animate);
}

animate();
const cards = document.querySelectorAll('.card');
window.addEventListener('scroll', () => {
  cards.forEach(card => {
    const rect = card.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }
  });
});

cards.forEach(card => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(40px)';
  card.style.transition = 'all 0.8s ease';
});
