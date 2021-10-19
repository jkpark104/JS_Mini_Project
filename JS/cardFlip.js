const $cardSection = document.querySelector('.cardSection');
const $userLife = document.querySelector('.life');
let userLifeCount = 5;
$userLife.textContent = userLifeCount;

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

// Generate Cards
const cardGenerator = () => {
  const cardImages = randomizeCardImages();

  $cardSection.innerHTML = cardImages
    .map(
      item => `
      <div class="cardContainer" name="${item.name}"><img class="cardFace" src="${item.imgSrc}" /><div class="cardBack"></div></div>
      `
    )
    .join('');
};

cardGenerator();

const $cardContainers = document.querySelectorAll('.cardContainer');
const toggleCards = document.querySelectorAll('.toggleCard');

// Restart game
const restart = () => {
  const cardImagesData = randomizeCardImages();
  const $cardFaces = document.querySelectorAll('.cardFace');

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
  const flippedCards = document.querySelectorAll('.flipped');

  if (flippedCards.length === 2) {
    if (
      flippedCards[0].getAttribute('name') ===
      flippedCards[1].getAttribute('name')
    ) {
      console.log('match');
      flippedCards.forEach(flippedCard => {
        flippedCard.classList.remove('flipped');
        flippedCard.style.pointerEvents = 'none';
      });
    } else {
      console.log('wrong');
      flippedCards.forEach(flippedCard => {
        flippedCard.classList.remove('flipped');
        setTimeout(() => flippedCard.classList.toggle('toggleCard'), 1000);
      });
      userLifeCount += -1;
      $userLife.textContent = userLifeCount;
      if (userLifeCount === 0) {
        restart();
      }
    }
  }
};

[...$cardContainers].forEach(cardcontainer => {
  cardcontainer.onclick = e => {
    cardcontainer.classList.toggle('toggleCard');
    checkCards(e);
  };
});
