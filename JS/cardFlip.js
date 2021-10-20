const makeCardSection = () => {
  const $cardSection = document.querySelector('.cardSection');
  const $toggleCards = document.querySelectorAll('.toggleCard');
  const $restart = document.querySelector('.restart');
  // local state
  const $userLife = document.querySelector('.userLife');
  let userLifeCount = 7;
  $userLife.textContent = userLifeCount;

  const MODE = {
    EASY: { CARDSCOUNT: 16 },
    NOMAL: { CARDSCOUNT: 32 },
    HARD: { CARDSCOUNT: 64 }
  };
  // global state
  // const round = 1;
  // Elasped Time control
  const isRunning = false;
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

  const StartOrStopElapsedTime = (() => {
    let timerId = null;

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
      }, 10);
    };

    const stop = () => clearInterval(timerId);

    // stop 조건을 게임 완료로 수정 필요
    return () => {
      isRunning ? stop() : start();
      // isRunning = !isRunning;
    };
  })();

  $cardSection.onclick = e => {
    if (!e.target.classList.contains('cardContainer')) return;
    StartOrStopElapsedTime();
  };

  // Get cards images
  const getCardImages = () => [
    { imgSrc: '../cardImg/1.jpg', name: '1' },
    { imgSrc: '../cardImg/1.jpg', name: '1' },
    { imgSrc: '../cardImg/2.jpg', name: '2' },
    { imgSrc: '../cardImg/2.jpg', name: '2' },
    { imgSrc: '../cardImg/3.jpg', name: '3' },
    { imgSrc: '../cardImg/3.jpg', name: '3' },
    { imgSrc: '../cardImg/4.jpg', name: '4' },
    { imgSrc: '../cardImg/4.jpg', name: '4' },
    { imgSrc: '../cardImg/5.jpg', name: '5' },
    { imgSrc: '../cardImg/5.jpg', name: '5' },
    { imgSrc: '../cardImg/6.jpg', name: '6' },
    { imgSrc: '../cardImg/6.jpg', name: '6' },
    { imgSrc: '../cardImg/7.jpg', name: '7' },
    { imgSrc: '../cardImg/7.jpg', name: '7' },
    { imgSrc: '../cardImg/8.jpg', name: '8' },
    { imgSrc: '../cardImg/8.jpg', name: '8' }
  ];
  // console.log(
  //   Array.from({ length: 64 }, (_, index) => ({
  //     imgSrc: `../cardImg/${Math.floor(index / 2) + 1}.jpg`,
  //     name: `${Math.floor(index / 2) + 1}`
  //   }))
  // );

  // Randomize cards
  const randomizeCardImages = () => {
    const cardImagesData = getCardImages();
    cardImagesData.sort(() => Math.random() - 0.5);
    return cardImagesData;
  };

  // Restart game
  $restart.onclick = () => {
    // 라운드에 대한 처리 필요
    const cardImagesData = randomizeCardImages();
    const $cardFaces = document.querySelectorAll('.cardFace');
    const $cardContainers = document.querySelectorAll('.cardContainer');
    $cardSection.style.pointerEvents = 'none';

    cardImagesData.forEach((item, index) => {
      $cardContainers[index].classList.remove('toggleCard');

      setTimeout(() => {
        $cardContainers[index].style.pointerEvents = 'all';
        $cardFaces[index].src = item.imgSrc;
        $cardContainers[index].setAttribute('name', item.name);
        $cardSection.style.pointerEvents = 'all';
      }, 1000);
    });

    userLifeCount = 5;
    $userLife.textContent = userLifeCount;
  };

  // Check cards
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
        $flippedCards.forEach(flippedCard => {
          flippedCard.classList.remove('flipped');
          flippedCard.style.pointerEvents = 'none';
        });
      } else {
        console.log('wrong');
        $flippedCards.forEach(flippedCard => {
          flippedCard.classList.remove('flipped');
          setTimeout(() => {
            flippedCard.classList.toggle('toggleCard');
          }, 1000);
        });
        console.log(elapsedTime);
        userLifeCount += -1;
        $userLife.textContent = userLifeCount;

        if (userLifeCount === 0) {
          // isRunning = !isRunning;
          setTimeout(
            () =>
              window.alert(`다시 도전하세요! 
          \n경과시간 : ${formatElapsedTime(elapsedTime)}
          `),
            100
          );
        }
      }
    }
    // console.log($toggleCards.length);
    if ($toggleCards.length === 16) {
      // isRunning = !isRunning;
      setTimeout(
        () =>
          window.alert(`You win!
      \n경과시간 : ${formatElapsedTime(elapsedTime)}
      `),
        100
      );
    }
  };

  // Generate Cards
  const generateCards = () => {
    const cardImages = randomizeCardImages();

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
        checkCards(e);
      };
    });
  };

  generateCards();
};

window.addEventListener('DOMContentLoaded', makeCardSection);
