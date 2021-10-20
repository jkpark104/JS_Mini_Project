const $cardSection = document.querySelector('.cardSection');
const $userLife = document.querySelector('.userLife');
const userLifeCount = 1;
$userLife.textContent = userLifeCount;

const MODE = {
  EASY: { CARDSCOUNT: 9, GRIDSTYLE: 'repeat(3, 10rem)' },
  NOMAL: { CARDSCOUNT: 16, GRIDSTYLE: 'repeat(4, 8rem)' },
  HARD: { CARDSCOUNT: 25, GRIDSTYLE: 'repeat(5, 7rem)' }
};

let { CARDSCOUNT, GRIDSTYLE } = MODE.NOMAL;

const changeMode = mode => {
  const codeMode = mode.toUpperCase();
  CARDSCOUNT = MODE[codeMode].CARDSCOUNT;
  GRIDSTYLE = MODE[codeMode].GRIDSTYLE;
};

// Get cards images
const getCardImages = CARDSCOUNT =>
  Array.from({ length: CARDSCOUNT }, (_, index) => ({
    imgSrc: `../cardImg/${Math.floor(index / 2) + 1}.jpg`,
    name: `${Math.floor(index / 2) + 1}`
  }));

const randomizeCardImages = () => {
  const cardImagesData = getCardImages(CARDSCOUNT);
  cardImagesData.sort(() => Math.random() - 0.5);
  return cardImagesData;
};

const renderCards = () => {
  const cardImages = randomizeCardImages();
  $cardSection.style.setProperty('grid-template-columns', `${GRIDSTYLE}`);
  $cardSection.style.setProperty('grid-template-rows', `${GRIDSTYLE}`);

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
      if (userLifeCount === 0) return;
      cardContainer.classList.toggle('toggleCard');
      //   checkCards(e);
    };
  });
};

renderCards();

document.querySelector('.game-mode').onclick = e => {
  if (!e.target.classList.contains('game-mode-button')) return;

  changeMode(e.target.dataset.mode);
  [...document.querySelectorAll('.game-mode-button')].forEach($button =>
    $button.classList.toggle('current-mode', e.target === $button)
  );

  renderCards();
};

$cardSection.onclick = (() => {
  console.log('d');
  let isRunning = false;
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

  const startOrStopElapsedTime = (() => {
    let timerId = null;

    // Stop => Start
    const start = () => {
      let { mm, ss, ms } = elapsedTime;

      timerId = setInterval(() => {
        ms += 1;
        if (ms >= 100) {
          ss += 1;
          ms = 0;
        }
        if (ss >= 60) {
          mm += 1;
          ss = 0;
        }

        elapsedTime = { mm, ss, ms };
        renderElapsedTime();
      }, 10); // 10ms 단위로 증가
    };

    // Start => Stop
    const stop = () => clearInterval(timerId);

    return () => {
      isRunning ? stop() : start();
      // isRunning = !isRunning;
    };
  })();

  return ({ target }) => {
    if (!target.classList.contains('cardContainer')) return;
    if (userLifeCount === 0) {
      isRunning = !isRunning;
      startOrStopElapsedTime();
    }
  };
})();
