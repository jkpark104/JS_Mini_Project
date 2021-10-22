import colorInit from './changeMainColor.mjs';

colorInit();

const $effect = document.querySelector('.effect');

$effect.innerHTML = $effect.textContent.replace(
  /([^.\s]|\w)/g,
  "<span class='letter'>$&</span>"
);

anime.timeline().add(
  {
    targets: '.effect .letter',
    scale: [5, 1],
    opacity: [0, 1],
    translateZ: 0,
    easing: 'easeOutExpo',
    duration: 1350,
    delay(_, index) {
      return 70 * index;
    }
  },
  3000
);

[...document.querySelectorAll('.game-list a')].forEach((el, index) => {
  anime.timeline().add({
    [`translate${window.innerWidth <= 800 ? 'X' : 'Y'}`]: [-100, 0],
    targets: el,
    opacity: [0, 1],
    easing: 'easeInOutQuad',
    delay() {
      return 1000 * index;
    },
    duration: 1000
  });
});

// Game container mouseover event
const $gameList = document.querySelector('.game-list');
$gameList.addEventListener('mouseover', e => {
  if (!e.target.classList.contains('game-container')) return;
  e.target.style.setProperty('transform', 'rotateY(180deg)');
});

$gameList.addEventListener('mouseout', e => {
  if (!e.target.classList.contains('game-container')) return;
  e.target.style.setProperty('transform', '');
});
