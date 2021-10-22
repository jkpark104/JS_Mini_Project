import colorInit from './changeMainColor.mjs';

const cardFlipGame = (() => {
  const $cardSection = document.querySelector('.cardSection');
  const $userLife = document.querySelector('.userLife');

  const SOUND = {
    cardFlip: '../music/cardFlip.mp3',
    win: '../music/winCardFlip.mp3',
    lose: '../music/loseCardFlip.mp3',
    correct: '../music/correct.mp3',
    wrong: '../music/wrong.mp3'
  };

  // Sound effect
  const playSound = mode => {
    new Audio(SOUND[mode]).play();
  };

  const MODE = {
    EASY: { CARDSCOUNT: 8, GRIDSIZE: '4', USERLIFE: 4 },
    NORMAL: { CARDSCOUNT: 16, GRIDSIZE: '4', USERLIFE: 10 },
    HARD: { CARDSCOUNT: 24, GRIDSIZE: '6', USERLIFE: 20 }
  };

  let { CARDSCOUNT, GRIDSIZE, USERLIFE } = MODE.NORMAL;

  const state = {
    round: 1,
    score: 0,
    userLifeCount: USERLIFE
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

  // Restart game
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

    state.userLifeCount = USERLIFE;
    $userLife.textContent = USERLIFE;
    if (text) setTimeout(() => alert(text), 100);

    Object.entries({
      round: state.round,
      score: state.score
    }).forEach(([key, value]) => {
      document.querySelector(
        `.display-${key}`
      ).textContent = `${key.toUpperCase()} ${value}`;
    });
  };

  // Update score and round
  const updateState = LifeCount => {
    const { mode } = document.querySelector('.current-mode').dataset;
    const expectedScore = mode === 'easy' ? 50 : mode === 'normal' ? 100 : 150;

    state.score += expectedScore * (LifeCount === 0 ? -1 : 1);
    state.round += 1;

    setTimeout(() => {
      state.userLifeCount = USERLIFE;
      restart();
    }, 1000);
  };

  // Check cards match or not
  const checkCards = e => {
    const clickedCard = e.target;
    clickedCard.classList.add('flipped');
    const $flippedCards = document.querySelectorAll('.flipped');
    const $toggleCards = document.querySelectorAll('.toggleCard');

    if ($toggleCards.length === CARDSCOUNT) {
      alert('성공하셨습니다!');
      playSound('win');
      updateState(state.userLifeCount);
      $flippedCards.forEach(card => {
        card.classList.remove('flipped');
        setTimeout(() => card.classList.remove('toggleCard'), 1000);
      });
      return;
    }

    if ($flippedCards.length !== 2) return;

    if (
      $flippedCards[0].getAttribute('name') ===
      $flippedCards[1].getAttribute('name')
    ) {
      playSound('correct');
      $flippedCards.forEach(card => {
        card.classList.remove('flipped');
        card.style.pointerEvents = 'none';
      });
      return;
    }

    $flippedCards.forEach(card => {
      card.classList.remove('flipped');
      setTimeout(() => card.classList.remove('toggleCard'), 1000);
    });
    playSound('wrong');
    state.userLifeCount--;
    $userLife.textContent = state.userLifeCount;
    if (state.userLifeCount === 0) {
      playSound('lose');
      alert('실패하셨습니다?');
      updateState(state.userLifeCount);
    }
  };

  return {
    // Mode change for event handler
    changeMode(mode) {
      const codeMode = mode.toUpperCase();
      ({ CARDSCOUNT, GRIDSIZE, USERLIFE } = MODE[codeMode]);
    },

    playSound(mode) {
      new Audio(SOUND[mode]).play();
    },

    restart(text) {
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

      state.userLifeCount = USERLIFE;
      $userLife.textContent = USERLIFE;
      if (text) setTimeout(() => alert(text), 100);

      Object.entries({
        round: state.round,
        score: state.score
      }).forEach(([key, value]) => {
        document.querySelector(
          `.display-${key}`
        ).textContent = `${key.toUpperCase()} ${value}`;
      });
    },

    // Render card section
    renderCards() {
      const cardImages = randomizeCardImages();
      $cardSection.style.setProperty(
        'grid-template-columns',
        `repeat(${GRIDSIZE}, 2.7em)`
      );
      $cardSection.style.setProperty(
        'grid-template-rows',
        `repeat(${GRIDSIZE}, 2.7em)`
      );

      state.userLifeCount = USERLIFE;
      $userLife.textContent = USERLIFE;

      $cardSection.innerHTML = cardImages
        .map(
          item => `
          <div class="cardContainer" name="${item.name}">
              <img class="cardFace" src="${item.imgSrc}" />
              <div class="cardBack"></div>
          </div>`
        )
        .join('');

      const $cardContainers = document.querySelectorAll('.cardContainer');
      [...$cardContainers].forEach(cardContainer => {
        cardContainer.onclick = e => {
          cardContainer.classList.toggle('toggleCard');
          checkCards(e);
        };
      });
    },

    // Media Query Event for responsive grid
    handleGridSize(mediaQueryList) {
      if (!mediaQueryList.matches) {
        $cardSection.style.setProperty(
          'grid-template-columns',
          `repeat(${CARDSCOUNT / GRIDSIZE} , 2em)`
        );
        $cardSection.style.setProperty(
          'grid-template-rows',
          `repeat(${GRIDSIZE}, 2em)`
        );
      } else {
        $cardSection.style.setProperty(
          'grid-template-columns',
          `repeat(${GRIDSIZE}, 2.7em)`
        );
        $cardSection.style.setProperty(
          'grid-template-rows',
          `repeat(${GRIDSIZE}, 2.7em)`
        );
      }
    }
  };
})();

// Event handlers binding
window.onload = cardFlipGame.renderCards;

document.querySelector('.game-mode').onclick = e => {
  if (!e.target.classList.contains('game-mode-button')) return;

  cardFlipGame.changeMode(e.target.dataset.mode);
  [...document.querySelectorAll('.game-mode-button')].forEach($button =>
    $button.classList.toggle('current-mode', e.target === $button)
  );

  cardFlipGame.renderCards();
};

document.querySelector('.restart').onclick = () => {
  cardFlipGame.restart('게임을 다시 시작합니다.');
};

document.querySelector('.cardSection').onclick = e => {
  if (!e.target.classList.contains('cardContainer')) return;
  cardFlipGame.playSound('cardFlip');
};

matchMedia('(min-width: 450px)').addEventListener(
  'resize',
  cardFlipGame.handleGridSize
);
colorInit();
