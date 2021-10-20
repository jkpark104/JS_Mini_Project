const $cardSection = document.querySelector('.cardSection');
// const $userLife = document.querySelector('.life');
// const userLifeCount = 5;
// $userLife.textContent = userLifeCount;

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
