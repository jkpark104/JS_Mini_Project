const makeCardSection = () => {
  document.querySelector('.display-title').textContent = 'Flip-Card Memory';
  const $cardSection = document.querySelector('.cardSection');
  const $userLife = document.querySelector('.userLife');
  const $toggleCards = document.querySelectorAll('.toggleCard');
  let userLifeCount = 10;
  $userLife.textContent = userLifeCount;

  // Elasped Time control
  $cardSection.onclick = (() => {
    // const isRunning = false;
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

    const reset = () => {
      elapsedTime = { mm: 0, ss: 0, ms: 0 };
      renderElapsedTime();
    };

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
        // isRunning ? stop() : start();
        // isRunning = !isRunning;
        start();
        if ($toggleCards.length === 16 || userLifeCount === 0) {
          stop();
          reset();
        }
      };
    })();

    return ({ target }) => {
      if (!target.classList.contains('cardContainer')) return;
      StartOrStopElapsedTime();
    };
  })();

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

  // Randomize cards
  const randomizeCardImages = () => {
    const cardImagesData = getCardImages();
    cardImagesData.sort(() => Math.random() - 0.5);
    return cardImagesData;
  };

  // Restart game
  const restart = text => {
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
    setTimeout(() => window.alert(text), 100);
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

        userLifeCount += -1;
        $userLife.textContent = userLifeCount;

        if (userLifeCount === 0) {
          document.querySelector('.display-round').textContent.split(':')[1]++;
          restart('try again!');
        }
      }
    }
    // console.log($toggleCards.length);
    if ($toggleCards.length === 16) {
      document.querySelector('.display-round').textContent.split(':')[1]++;

      restart('You win!');
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
