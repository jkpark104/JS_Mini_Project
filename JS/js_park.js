const colorGames = (() => {
  const state = {
    score: 0,

    round: 1,

    answer: null
  };

  const $hintList = document.querySelector('.hint-list');

  const generateRGBValues = () => {
    const R = Math.floor(Math.random() * 256);
    const G = Math.floor(Math.random() * 256);
    const B = Math.floor(Math.random() * 256);

    return [R, G, B];
  };

  const isAnswer = value =>
    value.style.backgroundColor.match(/[0-9]+/g).join('') ===
    state.answer.join('');

  return {
    renderPallette() {
      const colorGroups = Array.from({ length: 4 }, () => generateRGBValues());
      state.answer = colorGroups[Math.floor(Math.random() * 4)];

      [...document.querySelectorAll('.palette-item')].forEach(
        ({ style }, index) => {
          style.setProperty('background-color', `rgb(${colorGroups[index]})`);
        }
      );

      Object.entries({
        rgb: `(${state.answer.join(', ')})`,
        round: state.round,
        score: state.score
      }).forEach(([key, value]) => {
        document.querySelector(
          `.display-${key}`
        ).textContent = `${key.toUpperCase()} ${value}`;
      });

      $hintList.classList.remove('active');
      $hintList.style.height = 0;
    },

    updateState(eventTarget) {
      state.score += isAnswer(eventTarget) ? 100 : -100;
      state.round += 1;

      eventTarget.classList.add('active');

      setTimeout(() => {
        eventTarget.classList.remove('active');
        colorGames.renderPallette();
      }, 400);
    },

    toggleHint() {
      [...document.querySelectorAll('.hint-item')].forEach((item, index) => {
        item.textContent = `RGB (${state.answer
          .map((value, i) => (index === i ? 0 : value))
          .join(', ')})`;

        item.style.setProperty(
          'background-color',
          `rgb(${state.answer.map((value, i) => (index === i ? 0 : value))})`
        );
      });

      $hintList.classList.toggle('active');

      $hintList.classList.contains('active')
        ? ($hintList.style.height = $hintList.scrollHeight + 'px')
        : ($hintList.style.height = 0);
    }
  };
})();

window.addEventListener('DOMContentLoaded', colorGames.renderPallette);

document.querySelector('.restart').onclick = colorGames.renderPallette;

document.querySelector('.color-palette').onclick = e => {
  if (!e.target.matches('.palette-item')) return;

  colorGames.updateState(e.target);
};

document.querySelector('.hint').onclick = colorGames.toggleHint;
