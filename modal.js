
const cards = document.querySelectorAll('.card');
cards.forEach(card => {
  card.addEventListener('click', () => {
    const modalId = card.dataset.modal;
    document.getElementById(modalId).style.display = 'block';
  });
});

const closes = document.querySelectorAll('.close');
closes.forEach(close => {
  close.addEventListener('click', () => {
    close.parentElement.parentElement.style.display = 'none';
  });
});

// Close modal when clicking outside content
window.addEventListener('click', e => {
  if (e.target.classList.contains('modal')) {
    e.target.style.display = 'none';
  }
});