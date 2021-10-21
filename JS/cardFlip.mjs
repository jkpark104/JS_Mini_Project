import colorInit from './changeMainColor.js';

const $cardSection = document.querySelector('.cardSection');
const $userLife = document.querySelector('.userLife');
const MODE = {
  EASY: { CARDSCOUNT: 9, GRIDSTYLE: 'repeat(3, 10rem)', USERLIFE: 4 },
  NORMAL: { CARDSCOUNT: 16, GRIDSTYLE: 'repeat(4, 8rem)', USERLIFE: 8 },
  HARD: { CARDSCOUNT: 25, GRIDSTYLE: 'repeat(5, 7rem)', USERLIFE: 12 }
};

let { CARDSCOUNT, GRIDSTYLE, USERLIFE } = MODE.NORMAL;

const SOUND = {
  cardFlip: '../music/cardFlip.mp3',
  win: '../music/winCardFlip.mp3',
  lose: '../music/loseCardFlip.mp3'
};

const playSound = mode => {
  new Audio(SOUND[mode]).play();
};

const state = {
  round: 1,
  score: 0,
  userLifeCount: USERLIFE
};

const changeMode = mode => {
  const codeMode = mode.toUpperCase();
  CARDSCOUNT = MODE[codeMode].CARDSCOUNT;
  GRIDSTYLE = MODE[codeMode].GRIDSTYLE;
  USERLIFE = MODE[codeMode].USERLIFE;
};

// Get cards images
const getCardImages = CARDSCOUNT =>
  Array.from({ length: CARDSCOUNT }, (_, index) => ({
    imgSrc: `../cardImg/${Math.floor(index / 2) + 1}.jpg`,
    name: `${Math.floor(index / 2) + 1}`
  }));

// Randomize cards images
const randomizeCardImages = () => {
  const cardImagesData = getCardImages(CARDSCOUNT);
  cardImagesData.sort(() => Math.random() - 0.5);
  return cardImagesData;
};

// Render card section
const renderCards = () => {
  const cardImages = randomizeCardImages();
  $cardSection.style.setProperty('grid-template-columns', `${GRIDSTYLE}`);
  $cardSection.style.setProperty('grid-template-rows', `${GRIDSTYLE}`);

  $userLife.textContent = USERLIFE;

  $cardSection.innerHTML = cardImages
    .map(
      item => `
      <div class="cardContainer" name="${item.name}"><img class="cardFace" src="${item.imgSrc}" /><div class="cardBack"></div></div>
      `
    )
    .join('');

  const $cardContainers = document.querySelectorAll('.cardContainer');
  [...$cardContainers].forEach(cardContainer => {
    cardContainer.onclick = e => {
      cardContainer.classList.toggle('toggleCard');
      checkCards(e);
    };
  });

  Object.entries({
    round: state.round,
    score: state.score
  }).forEach(([key, value]) => {
    document.querySelector(
      `.display-${key}`
    ).textContent = `${key.toUpperCase()} ${value}`;
  });
};

const updateState = LifeCount => {
  const { mode } = document.querySelector('.current-mode').dataset;
  console.log(mode);
  const expectedScore = mode === 'easy' ? 50 : mode === 'normal' ? 100 : 150;
  console.log(expectedScore);
  state.score += expectedScore * (LifeCount === 0 ? -1 : 1);
  state.round += 1;

  setTimeout(() => {
    state.userLifeCount = USERLIFE;
    renderCards();
  }, 1000);
};

// Check cards match or not
const checkCards = e => {
  const clickedCard = e.target;
  clickedCard.classList.add('flipped');
  const $flippedCards = document.querySelectorAll('.flipped');
  const $toggleCards = document.querySelectorAll('.toggleCard');

  if ($flippedCards.length === 2) {
    if (
      $flippedCards[0].getAttribute('name') ===
      $flippedCards[1].getAttribute('name')
    ) {
      console.log('match');
      $flippedCards.forEach(card => {
        card.classList.remove('flipped');
        card.style.pointerEvents = 'none';
      });
    } else {
      console.log('wrong');
      $flippedCards.forEach(card => {
        card.classList.remove('flipped');
        setTimeout(() => card.classList.remove('toggleCard'), 1000);
      });
      state.userLifeCount--;
      $userLife.textContent = state.userLifeCount;
      if (state.userLifeCount === 0) {
        playSound('lose');
        alert('실패하셨습니다?');
        updateState(state.userLifeCount);
      }
    }
  }

  if ($toggleCards.length === 16) {
    alert('성공하셨습니다!');
    playSound('win');
    updateState(state.userLifeCount);
  }
};

const restart = text => {
  const cardImages = randomizeCardImages();
  const $cardFaces = document.querySelectorAll('.cardFace');
  const $cardContainers = document.querySelectorAll('.cardContainer');
  $cardSection.style.pointerEvents = 'none';

  cardImages.forEach((item, index) => {
    $cardContainers[index].classList.remove('toggleCard');
    setTimeout(() => {
      $cardContainers[index].style.pointerEvents = 'all';
      $cardFaces[index].setAttribute('src', item.imgSrc);
      $cardContainers[index].setAttribute('name', item.name);
      $cardSection.style.pointerEvents = 'all';
    }, 1000);
  });

  $userLife.textContent = USERLIFE;
  setTimeout(() => alert(text), 100);
};

renderCards();

document.querySelector('.game-mode').onclick = e => {
  if (!e.target.classList.contains('game-mode-button')) return;

  changeMode(e.target.dataset.mode);
  [...document.querySelectorAll('.game-mode-button')].forEach($button =>
    $button.classList.toggle('current-mode', e.target === $button)
  );

  state.userLifeCount = USERLIFE;
  renderCards();
};

document.querySelector('.restart').onclick = () => {
  restart('게임을 다시 시작합니다.');
};

let elapsedTime = { mm: 0, ss: 0, ms: 0 };

const formatElapsedTime = (() => {
  const format = n => (n < 10 ? '0' + n : n + '');
  return ({ mm, ss, ms }) => `${format(mm)}:${format(ss)}:${format(ms)}`;
})();

const renderElapsedTime = (() => {
  const $elapsedTime = document.querySelector('.elapsedTime');
  return () => {
    $elapsedTime.textContent = formatElapsedTime(elapsedTime);
  };
})();

let timerId = null;

const start = () => {
  let { mm, ss, ms } = elapsedTime;

  timerId = setInterval(() => {
    ms -= 1;
    if (ms <= 100) {
      ss -= 1;
      ms = 0;
    }
    if (ss <= 60) {
      mm -= 1;
      ss = 0;
    }

    elapsedTime = { mm, ss, ms };
    renderElapsedTime();
  }, 10);
};

const stop = () => clearInterval(timerId);

$cardSection.onclick = e => {
  if (!e.target.classList.contains('cardContainer')) return;
  playSound('cardFlip');
};

colorInit();
