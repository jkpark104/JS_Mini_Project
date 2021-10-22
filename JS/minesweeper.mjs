import { getState, setState } from './state.mjs';
import colorInit from './changeMainColor.mjs';

// closer
const minesweeperGame = (() => {
  const $minesweeperBoard = document.querySelector('.minesweeper-board');

  // constant ----------------------------------------
  const SOUND = {
    leftClk: '../music/leftClickSound.mp3',
    rightClk: '../music/rightClickSound.mp3',
    win: '../music/winSound.mp3',
    lose: '../music/loseSound.mp3'
  };
  const SQUARE = {
    NORMAL: -1,
    FLAG: -2,
    MINE: -3,
    FLAG_MINE: -4,
    OPENED: 0
  };
  const CLASS_NAME = {
    '-1': 'nomal',
    '-2': 'flag',
    '-3': 'mine',
    '-4': 'flag',
    0: 'opened'
  };
  const MODE = {
    EASY: { ROW: 10, COL: 10, MINE_NUM: 10 },
    NORMAL: { ROW: 20, COL: 20, MINE_NUM: 60 },
    HARD: { ROW: 25, COL: 25, MINE_NUM: 140 }
  };

  // state ----------------------------------------
  let { ROW, COL, MINE_NUM } = MODE.NORMAL;

  // 플레이어의 상태를 저장
  let gameBoard = [];

  // 지뢰 정보를 저장
  let mineInfoBoard = [];

  // functions ----------------------------------------
  const createBoard = filling =>
    new Array(ROW).fill().map(() => new Array(COL).fill(filling));

  const setRoundScore = isWin => {
    let { score, round } = getState();

    setState({
      score: (score += isWin ? 100 : -100),
      round: (round += 1)
    });

    Object.entries({
      ...getState()
    }).forEach(([key, value]) => {
      document.querySelector(
        `.display-${key}`
      ).textContent = `${key.toUpperCase()} ${value}`;
    });
  };

  const popupResult = isWin => {
    alert(isWin ? '승리하셨습니다!' : '실패하셨습니다...');
    setRoundScore(isWin);
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
    const mines = new Set();
    while (mines.size !== MINE_NUM)
      mines.add(Math.floor(Math.random() * (ROW * COL)));

    return [...mines];
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
        if (
          nextX >= 0 &&
          nextX < ROW &&
          nextY >= 0 &&
          nextY < COL &&
          mineInfoBoard[nextX][nextY] !== SQUARE.MINE
        )
          mineInfoBoard[nextX][nextY] += 1;
      });
    });
  };

  const plantMineInGameBoard = () => {
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
    $minesweeperBoard.classList.remove('win');

    setStyleGameBoard();
    $minesweeperBoard.innerHTML = '';
    const $fragment = document.createDocumentFragment();

    gameBoard.forEach((boardLine, x) => {
      const $row = document.createElement('div');
      $row.className = `row row${x}`;
      $row.dataset.row = x;

      boardLine.forEach((_, y) => {
        const $col = document.createElement('div');
        $col.dataset.col = y;
        $col.className = `col col${y}`;
        $row.appendChild($col);
      });
      $fragment.appendChild($row);
    });
    $minesweeperBoard.appendChild($fragment);
  };

  const openBoard = (row, col, visited) => {
    if (mineInfoBoard[row][col] === SQUARE.MINE) return;

    const $squareToOpen = document
      .querySelector(`.row${row}`)
      .querySelector(`.col${col}`);
    $squareToOpen.classList.add(CLASS_NAME[SQUARE.OPENED]);
    $squareToOpen.classList.remove(CLASS_NAME[SQUARE.FLAG]);
    gameBoard[row][col] = mineInfoBoard[row][col];
    $squareToOpen.textContent = mineInfoBoard[row][col]
      ? mineInfoBoard[row][col]
      : '';

    if (mineInfoBoard[row][col] > 0) return; // 양수면 그만

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
        break;
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

  const isAllMinesFound = () =>
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
    $minesweeperBoard.innerHTML = '';
    const $fragment = document.createDocumentFragment();

    mineInfoBoard.forEach((boardLine, x) => {
      const $row = document.createElement('div');
      $row.className = `row row${x}`;
      // $row.dataset.row = x;

      boardLine.forEach((box, y) => {
        const $col = document.createElement('div');
        // $col.dataset.col = y;
        $col.className = `col col${y}`;

        const isValid = CODE =>
          CODE >= 0 ? gameBoard[x][y] >= CODE : gameBoard[x][y] === CODE;

        $col.innerHTML =
          isValid(SQUARE.MINE) || isValid(SQUARE.FLAG_MINE)
            ? `<i class="fas fa-bomb"></i>`
            : box || '';

        $col.classList.toggle(
          CLASS_NAME[SQUARE.MINE],
          isValid(SQUARE.MINE) || isValid(SQUARE.FLAG_MINE)
        );
        $col.classList.toggle(CLASS_NAME[SQUARE.FLAG], isValid(SQUARE.FLAG));
        $col.classList.toggle(
          CLASS_NAME[SQUARE.OPENED],
          isValid(SQUARE.OPENED)
        );

        $row.appendChild($col);
      });
      $fragment.appendChild($row);
    });
    $minesweeperBoard.appendChild($fragment);
  };

  const playSound = mode => {
    new Audio(SOUND[mode]).play();
  };

  const handleGameOver = isWin => {
    showAllGameBoard();
    document.querySelector('.minesweeper-board').classList.toggle('win', isWin);
    playSound(isWin ? 'win' : 'lose');
    setTimeout(popupResult, 100, isWin);
  };

  return {
    renderNewGame() {
      gameBoard = createBoard(SQUARE.NORMAL);
      mineInfoBoard = createBoard(0);
      plantMineInGameBoard();
      renderGameBoard();
    },
    handleRightClick(userSelected) {
      if (userSelected.classList.contains('opened')) return;

      const { row } = userSelected.parentNode.dataset;
      const { col } = userSelected.dataset;

      // 우클릭 소리
      playSound('rightClk');

      // 깃발이였다면? 깃발 제거
      if (
        gameBoard[row][col] === SQUARE.FLAG ||
        gameBoard[row][col] === SQUARE.FLAG_MINE
      ) {
        gameBoard[row][col] =
          gameBoard[row][col] === SQUARE.FLAG ? SQUARE.NORMAL : SQUARE.MINE;
        userSelected.classList.remove(CLASS_NAME[SQUARE.FLAG]);
        userSelected.innerHTML = '';
        return;
      }
      // 깃발이 아니였다면? 깃발 꽂기
      gameBoard[row][col] =
        gameBoard[row][col] === SQUARE.NORMAL ? SQUARE.FLAG : SQUARE.FLAG_MINE;
      userSelected.classList.add(CLASS_NAME[SQUARE.FLAG]);
      userSelected.innerHTML = `<i class="fas fa-flag"></i>`;
    },
    handleLeftClick(userSelected) {
      if (userSelected.matches('.opened') || userSelected.matches('.flag'))
        return;

      const { row } = userSelected.parentNode.dataset;
      const { col } = userSelected.dataset;

      // 좌클릭 소리
      playSound('leftClk');

      // 지뢰인 경우 => 패배
      if (gameBoard[row][col] === SQUARE.MINE) {
        handleGameOver(false);
        return;
      }

      // 주변에 지뢰 전까지 열기
      const visited = Array.from({ length: ROW }, () => Array(COL).fill(0));
      openBoard(row, col, visited);

      // 지뢰 빼고 전부 열었을 경우 => 승리
      if (isAllMinesFound()) {
        handleGameOver(true);
      }
    },
    changeMode(mode) {
      const codeMode = mode.toUpperCase();
      ({ ROW, COL, MINE_NUM } = MODE[codeMode]);
    }
  };
})();

// event bindings ----------------------------------------
colorInit();
window.addEventListener('DOMContentLoaded', minesweeperGame.renderNewGame);

// 우클릭
document.querySelector('.minesweeper-board').oncontextmenu = e => {
  e.preventDefault();
  const $col = e.target.closest('.col');
  if (!$col) return;
  minesweeperGame.handleRightClick($col);
};

// 좌클릭
document.querySelector('.minesweeper-board').onclick = e => {
  const $col = e.target.closest('.col');
  if (!$col) return;
  minesweeperGame.handleLeftClick($col);
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

// 초기화 버튼 선택
document.querySelector('.restart').onclick = minesweeperGame.renderNewGame;
