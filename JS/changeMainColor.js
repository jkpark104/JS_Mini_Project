const changeMainColor = (() => {
  // const colors = ['#cdb4db', '#ffc8dd', '#ffafcc', '#bde0fe', '#a2d2ff'];
  const colors = [
    '#f5ffc6',
    '#b4e1ff',
    '#e4c1f9',
    '#fface4',
    '#c1ff9b',
    '#ffe566',
    '#f3d8c7'
  ];
  const selectRandomColor = () =>
    colors[Math.floor(Math.random() * colors.length)];

  const change = () => {
    document.documentElement.style.setProperty(
      '--main-color',
      selectRandomColor()
    );
  };

  return change;
})();

export default () => {
  window.addEventListener('DOMContentLoaded', changeMainColor);
};
