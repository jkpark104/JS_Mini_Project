// constant ----------------------------------------
const CLASS_NAME = {
  '-1': 'nomal',
  '-2': 'flag',
  '-3': 'mine',
  '-4': 'flag',
  0: 'opened'
};
const SQUARE = {
  NOMAL: -1,
  FLAG: -2,
  MINE: -3,
  FLAG_MINE: -4,
  OPENED: 0
};

const ROW = 10;
const COL = 10;
const MINE_NUM = 10;

// state ----------------------------------------
const gameBoard = Array(ROW)
  .fill()
  .map(() => Array(COL).fill(SQUARE.NOMAL));

const mineInfoBoard = Array(ROW)
  .fill()
  .map(() => Array(COL).fill(0));

// functions ----------------------------------------
const createMine = () => {
  const mines = Array.from({ length: MINE_NUM }, () =>
    Math.floor(Math.random() * 100)
  );

  mines.forEach((el, i) => {
    if (mines.indexOf(el) !== i) mines[i] = Math.floor(Math.random() * 100);
  });

  return mines;
};

const setMineInfoBoard = mines => {
  const dxDy = [
    [-1, -1],
    [0, -1],
    [1, -1],
    [-1, 0],
    [1, 0],
    [-1, 1],
    [0, 1],
    [1, 1]
  ];

  mines.forEach(position => {
    const row = Math.floor(position / ROW);
    const col = position % COL;

    // 지뢰 심기
    mineInfoBoard[row][col] = SQUARE.MINE;

    // 주변 지뢰 개수 심기
    dxDy.forEach(([dx, dy]) => {
      const [nextX, nextY] = [row + dx, col + dy];
      if (nextX < 0 || nextX >= ROW || nextY < 0 || nextY >= COL) return;
      if (mineInfoBoard[nextX][nextY] !== SQUARE.MINE)
        mineInfoBoard[nextX][nextY] += 1;
    });
  });
};

const plantMine = () => {
  const mines = createMine();
  mines.forEach(position => {
    const row = Math.floor(position / ROW);
    const col = position % COL;

    // 지뢰 심기
    gameBoard[row][col] = SQUARE.MINE;
  });

  setMineInfoBoard(mines);
};

const renderGameBoard = () => {
  gameBoard.forEach((boardLine, i) => {
    const $boardLine = document.createElement('div');
    $boardLine.className = `row row${i}`;
    $boardLine.dataset.row = i;

    boardLine.forEach((square, i) => {
      const $square = document.createElement('div');
      $square.dataset.col = i;
      $square.className = `col col${i}`;
      $boardLine.append($square);
    });
    document.querySelector('.minesweeper-board').append($boardLine);
  });
};

const handleRightClick = userSelected => {
  const { row } = userSelected.parentNode.dataset;
  const { col } = userSelected.dataset;

  // 깃발이였다면? 깃발 제거
  if (
    gameBoard[row][col] === SQUARE.FLAG ||
    gameBoard[row][col] === SQUARE.FLAG_MINE
  ) {
    gameBoard[row][col] =
      gameBoard[row][col] === SQUARE.FLAG ? SQUARE.NOMAL : SQUARE.MINE;
    userSelected.classList.remove(CLASS_NAME[SQUARE.FLAG]);
    userSelected.innerHTML = '';
    return;
  }
  // 깃발이 아니였다면?
  // 열린칸이면? 대기
  if (gameBoard[row][col] >= 0) return;

  // 닫힌칸이면? 깃발 꽂기
  gameBoard[row][col] =
    gameBoard[row][col] === SQUARE.NOMAL ? SQUARE.FLAG : SQUARE.FLAG_MINE;
  userSelected.classList.add(CLASS_NAME[SQUARE.FLAG]);
  userSelected.innerHTML = `<i class='bx bxs-flag' ></i>`;
};

const openBoard = (row, col, visited) => {
  if (mineInfoBoard[row][col] === SQUARE.MINE) return;

  const $squareToOpen = document
    .querySelector(`.row${row}`)
    .querySelector(`.col${col}`);
  $squareToOpen.classList.add(CLASS_NAME[SQUARE.OPENED]);
  gameBoard[row][col] = mineInfoBoard[row][col];
  $squareToOpen.classList.remove(CLASS_NAME[SQUARE.FLAG]);
  $squareToOpen.textContent = mineInfoBoard[row][col]
    ? mineInfoBoard[row][col]
    : '';

  if (mineInfoBoard[row][col] > 0) return; // 숫자면 그만

  const dx = [-1, 0, 1, -1, 1, -1, 0, 1];
  const dy = [-1, -1, -1, 0, 0, 1, 1, 1];
  let noMine = true;
  for (let i = 0; i < 8; i++) {
    const [nextX, nextY] = [+row + dx[i], +col + dy[i]];
    if (
      nextX >= 0 &&
      nextX < ROW &&
      nextY >= 0 &&
      nextY < COL &&
      mineInfoBoard[nextX][nextY] === SQUARE.MINE
    ) {
      noMine = false;
    }
  }
  if (noMine) {
    for (let i = 0; i < 8; i++) {
      const [nextX, nextY] = [+row + dx[i], +col + dy[i]];
      if (
        nextX >= 0 &&
        nextX < ROW &&
        nextY >= 0 &&
        nextY < COL &&
        visited[nextX][nextY] === 0
      ) {
        visited[nextX][nextY] = 1;
        openBoard(nextX, nextY, visited.slice());
      }
    }
  }
};

const popupResult = isWin => {
  document.querySelector('.modal-wrap').classList.remove('hidden');
};

const isAllMinesFined = () =>
  ROW * COL - MINE_NUM ===
  gameBoard.reduce(
    (openNums, curBoardLine) =>
      openNums +
      curBoardLine.reduce(
        (openNum, curBox) => (curBox >= SQUARE.OPENED ? openNum + 1 : openNum),
        0
      ),
    0
  );

const handleLeftClick = userSelected => {
  const { row } = userSelected.parentNode.dataset;
  const { col } = userSelected.dataset;

  // 깃발인 경우
  if (
    gameBoard[row][col] === SQUARE.FLAG ||
    gameBoard[row][col] === SQUARE.FLAG_MINE
  ) {
    return;
  }

  // 지뢰인 경우
  if (gameBoard[row][col] === SQUARE.MINE) {
    popupResult(false);
    return;
  }

  // 주변에 지뢰 전까지 열기
  const visited = Array.from({ length: ROW }, () => Array(COL).fill(0));
  openBoard(row, col, visited);

  // 지뢰 빼고 전부 열었을 경우
  if (isAllMinesFined()) {
    popupResult(true);
  }
};

// event bindings ----------------------------------------
plantMine();
renderGameBoard();
console.log(mineInfoBoard);

// 우클릭
const $minesweeperBoard = document.querySelector('.minesweeper-board');
$minesweeperBoard.oncontextmenu = e => {
  e.preventDefault();
  e.target.matches('i')
    ? handleRightClick(e.target.parentNode)
    : handleRightClick(e.target);
};

// 좌클릭
$minesweeperBoard.onclick = e => {
  handleLeftClick(e.target);
};
