const changeMainColor = (() => {
  //   const colors = ['#cdb4db', '#ffc8dd', '#ffafcc', '#bde0fe', '#a2d2ff']
  const colors = ['#ef476f', '#ffd166', '#06d6a0', '#118ab2', '#073b4c'];
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
