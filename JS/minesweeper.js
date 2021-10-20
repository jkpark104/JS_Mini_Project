// closer
const minesweeperGame = (() => {
  // constant
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
  const MODE = {
    EASY: { ROW: 10, COL: 10, MINE_NUM: 15 },
    NOMAL: { ROW: 20, COL: 20, MINE_NUM: 80 },
    HARD: { ROW: 25, COL: 25, MINE_NUM: 180 }
  };

  // state
  let { ROW, COL, MINE_NUM } = MODE.NOMAL;

  let gameBoard = Array(ROW)
    .fill()
    .map(() => Array(COL).fill(SQUARE.NOMAL));

  let mineInfoBoard = Array(ROW)
    .fill()
    .map(() => Array(COL).fill(0));

  // functions
  const createBoard = filling =>
    Array(ROW)
      .fill()
      .map(() => Array(COL).fill(filling));

  const popupResult = isWin => {
    alert(isWin ? '승리하셨습니다!' : '실패하셨습니다...');
    minesweeperGame.renderNewGame();
  };
  const setStyleGameBoard = () => {
    document.documentElement.style.setProperty('--row', ROW);
    document.documentElement.style.setProperty(
      '--width-ratio',
      100 / ROW + '%'
    );
  };
  const createMine = () => {
    const mines = Array.from({ length: MINE_NUM }, () =>
      Math.floor(Math.random() * (ROW * COL))
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
    const $minesweeperBoard = document.querySelector('.minesweeper-board');

    setStyleGameBoard();
    $minesweeperBoard.innerHTML = '';

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
      $minesweeperBoard.append($boardLine);
    });
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

  const isAllMinesFined = () =>
    ROW * COL - MINE_NUM ===
    gameBoard.reduce(
      (openNums, curBoardLine) =>
        openNums +
        curBoardLine.reduce(
          (openNum, curBox) =>
            curBox >= SQUARE.OPENED ? openNum + 1 : openNum,
          0
        ),
      0
    );

  const showAllGameBoard = () => {
    const $minesweeperBoard = document.querySelector('.minesweeper-board');

    mineInfoBoard.forEach((boardLine, i) => {
      const $row = $minesweeperBoard.querySelector('.row' + i);
      boardLine.forEach((square, i) => {
        const $col = $row.querySelector('.col' + i);

        if (square === SQUARE.MINE || square === SQUARE.FLAG_MINE) {
          $col.classList.add('bomb');
          $col.innerHTML = `<i class="fas fa-bomb"></i>`;
        } else {
          $col.innerHTML = square;
        }
      });
    });
  };

  return {
    renderNewGame() {
      gameBoard = createBoard(SQUARE.NOMAL);
      mineInfoBoard = createBoard(0);
      plantMine();
      renderGameBoard();
    },
    handleRightClick(userSelected) {
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
    },
    handleLeftClick(userSelected) {
      const { row } = userSelected.parentNode.dataset;
      const { col } = userSelected.dataset;

      // 깃발인 경우
      if (
        gameBoard[row][col] === SQUARE.FLAG ||
        gameBoard[row][col] === SQUARE.FLAG_MINE
      ) {
        return;
      }

      // 깃발이 아닐때
      // 지뢰인 경우
      if (gameBoard[row][col] === SQUARE.MINE) {
        showAllGameBoard();
        setTimeout(popupResult, 100, false);
        return;
      }

      // 주변에 지뢰 전까지 열기
      const visited = Array.from({ length: ROW }, () => Array(COL).fill(0));
      openBoard(row, col, visited);

      // 지뢰 빼고 전부 열었을 경우
      if (isAllMinesFined()) {
        showAllGameBoard();
        setTimeout(popupResult, 1000, true);
      }
    },
    changeMode(mode) {
      const codeMode = mode.toUpperCase();
      ROW = MODE[codeMode].ROW;
      COL = MODE[codeMode].COL;
      MINE_NUM = MODE[codeMode].MINE_NUM;
    }
  };
})();

// event bindings ----------------------------------------
window.addEventListener('DOMContentLoaded', minesweeperGame.renderNewGame);

// 우클릭
const $minesweeperBoard = document.querySelector('.minesweeper-board');
$minesweeperBoard.oncontextmenu = e => {
  e.preventDefault();
  minesweeperGame.handleRightClick(e.target.closest('.col'));
};

// 좌클릭
$minesweeperBoard.onclick = e => {
  if (!e.target.classList.contains('col')) return;
  minesweeperGame.handleLeftClick(e.target.closest('.col'));
};

// 모드 선택
document.querySelector('.game-mode').onclick = e => {
  if (!e.target.classList.contains('game-mode-button')) return;

  minesweeperGame.changeMode(e.target.dataset.mode);
  [...document.querySelectorAll('.game-mode-button')].forEach($button =>
    $button.classList.toggle('current-mode', e.target === $button)
  );

  minesweeperGame.renderNewGame();
};
