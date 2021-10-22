import colorInit from './changeMainColor.mjs';

const colorGames = (() => {
  const state = {
    answer: null,
    round: 1,
    score: 0,
    mode: 'normal'
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
      document
        .querySelector('.hint')
        .classList.toggle('a11y-hidden', state.mode === 'hard');

      $hintList.innerHTML = Array.from(
        { length: state.mode === 'easy' ? 3 : 1 },
        () => '<li class="hint-item"></li>'
      ).join('');

      const colorGroups = Array.from({ length: 4 }, () => generateRGBValues());

      state.answer = colorGroups[Math.floor(Math.random() * 4)];

      [...document.querySelectorAll('.palette-item')].forEach((item, index) => {
        item.style.setProperty(
          'background-color',
          `rgb(${colorGroups[index]})`
        );
        item.innerHTML = `<span>RGB (${colorGroups[index]})</span>`;
      });

      Object.entries({
        rgb: `(${state.answer.join(', ')})`,
        round: state.round,
        score: state.score
      }).forEach(([key, value]) => {
        document.querySelector(
          `.display-${key}`
        ).textContent = `${key.toUpperCase()} ${value}`;
      });
    },

    updateState(eventTarget) {
      const expectedScore =
        state.mode === 'easy' ? 100 : state.mode === 'normal' ? 200 : 400;

      state.score += expectedScore * (isAnswer(eventTarget) ? 1 : -1);
      state.round += 1;

      new Audio(
        `../music/${isAnswer(eventTarget) ? 'correct' : 'wrong'}.mp3`
      ).play();

      document.body.style.setProperty(
        'background-color',
        `${isAnswer(eventTarget) ? '#00CC6E' : 'tomato'}`
      );

      setTimeout(() => {
        document.body.style.removeProperty('background-color');
        colorGames.renderPallette();
      }, 1000);

      $hintList.classList.remove('active');
      $hintList.style.height = 0;
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
    },

    changeMode(eventTarget) {
      [...eventTarget.parentNode.children].forEach(modeButton =>
        modeButton.classList.toggle('current-mode', modeButton === eventTarget)
      );

      eventTarget.dataset.mode === 'easy'
        ? (state.mode = 'easy')
        : eventTarget.dataset.mode === 'normal'
        ? (state.mode = 'normal')
        : (state.mode = 'hard');

      $hintList.classList.remove('active');
      $hintList.style.height = 0;

      colorGames.renderPallette();
    }
  };
})();

colorInit();
window.addEventListener('DOMContentLoaded', colorGames.renderPallette);

document.querySelector('.color-palette').onclick = e => {
  if (e.target.matches('.color-palette')) return;

  e.target.closest('li').classList.add('active');

  setTimeout(() => {
    e.target.closest('li').classList.remove('active');
  }, 1000);

  colorGames.updateState(e.target.closest('li'));
};

document.querySelector('.game-mode').onclick = e => {
  colorGames.changeMode(e.target);
};

document.querySelector('.restart').onclick = colorGames.renderPallette;

document.querySelector('.hint').onclick = colorGames.toggleHint;
