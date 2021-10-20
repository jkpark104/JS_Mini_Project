import { getState, setState } from './state.mjs';

const colorGames = (() => {
  let answer = null;

  const generateRGBValues = () => {
    const R = Math.floor(Math.random() * 256);
    const G = Math.floor(Math.random() * 256);
    const B = Math.floor(Math.random() * 256);

    return [R, G, B];
  };

  const isAnswer = value =>
    value.style.backgroundColor.match(/[0-9]+/g).join('') === answer.join('');

  return {
    renderPallette() {
      const colorGroups = Array.from({ length: 4 }, () => generateRGBValues());

      answer = colorGroups[Math.floor(Math.random() * 4)];

      [...document.querySelectorAll('.palette-item')].forEach(
        ({ style }, index) => {
          style.setProperty('background-color', `rgb(${colorGroups[index]})`);
        }
      );

      Object.entries({
        rgb: `(${answer.join(', ')})`,
        ...getState()
      }).forEach(([key, value]) => {
        document.querySelector(
          `.display-${key}`
        ).textContent = `${key.toUpperCase()} ${value}`;
      });
    },

    updateState(eventTarget) {
      let { score, round } = getState();

      setState({
        score: (score += isAnswer(eventTarget) ? 100 : -100),
        round: (round += 1)
      });

      setTimeout(() => {
        colorGames.renderPallette();
      }, 400);

      document.querySelector('.hint-list').classList.remove('active');
      document.querySelector('.hint-list').style.height = 0;
    },

    toggleHint() {
      [...document.querySelectorAll('.hint-item')].forEach((item, index) => {
        item.textContent = `RGB (${answer
          .map((value, i) => (index === i ? 0 : value))
          .join(', ')})`;

        item.style.setProperty(
          'background-color',
          `rgb(${answer.map((value, i) => (index === i ? 0 : value))})`
        );
      });

      document.querySelector('.hint-list').classList.toggle('active');

      document.querySelector('.hint-list').classList.contains('active')
        ? (document.querySelector('.hint-list').style.height =
            document.querySelector('.hint-list').scrollHeight + 'px')
        : (document.querySelector('.hint-list').style.height = 0);
    }
  };
})();

window.addEventListener('DOMContentLoaded', colorGames.renderPallette);

document.querySelector('.color-palette').onclick = e => {
  if (!e.target.matches('.palette-item')) return;

  colorGames.updateState(e.target);
};

document.querySelector('.restart').onclick = colorGames.renderPallette;

document.querySelector('.hint').onclick = colorGames.toggleHint;
