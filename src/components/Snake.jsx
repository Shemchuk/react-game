import React from 'react';
import * as CONST from '../modules/Constants';

class Snake extends React.Component {
  constructor(props) {
    super(props);

    this.timeStep = CONST.LOOP_TIME;
    this.timerId = 0;

    this.fieldSize = CONST.FIELD_SIZE;
    this.countOfCells = this.fieldSize * this.fieldSize;

    this.handleClick = this.handleClick.bind(this);
    this.pauseGame = this.pauseGame.bind(this);
    this.newGame = this.newGame.bind(this);
    this.keyHandler = this.keyHandler.bind(this);

    this.cells = new Array(this.countOfCells).fill(null);
    this.state = { cells: this.cells, ...CONST.DEFAULT_STATE };
    console.log('constructor state');
    console.log(this.state);

    this.initGame();
  }

  initGame() {
    this.direction = CONST.DIRECTION_RIGHT;
    this.snake = [101, 102, 103, 104, 105];
    this.apple = this.getRandomApplePosition();

    let cells = this.cells;

    // this.state = { cells, ...CONST.DEFAULT_STATE };

    // this.state = { cells: cells };
    console.log('initGame state');
    console.log(this.state);
    // this.state = { ...CONST.DEFAULT_STATE };

    // this.setState(() => {
    //   return { cells: cells };
    // });

    for (let i = 0; i < this.countOfCells; i++) {
      let isSnake = this.snake.find((item) => item === i);
      const isApple = this.apple === i ? 'apple' : null;

      if (isSnake) {
        cells[i] = { cellNumber: i, cellType: 'cell snake' };
      } else if (isApple) {
        cells[i] = { cellNumber: i, cellType: 'cell apple' };
      } else {
        cells[i] = { cellNumber: i, cellType: 'cell' };
      }
    }

    this.cells = cells;
    // this.setState(() => {
    //   return { cells: cells };
    // });
    // this.state = { cells, ...CONST.DEFAULT_STATE };

    // this.state = { cells, isGameOver: false, time: 0, isPause: false };
    console.log('initGame end state');
    console.log(this.state);
    // console.log(this.state.cells);
    this.roundTimerID = setInterval(() => this.tick(), 1000);

    this.gameLoop();
  }

  gameLoop() {
    this.timerId = setTimeout(() => {
      this.makeMove();
      if (!this.state.isGameOver) {
        this.gameLoop();
      }
    }, this.timeStep);
  }

  makeMove() {
    if (this.state.isPause) return;
    this.setState(() => {
      return { cells: this.cells };
    });

    let cells = this.state.cells.slice();
    let newHeadPosition = this.calcHeadSnakePosition();

    this.snake.push(newHeadPosition);

    if (this.eatApple(newHeadPosition)) {
      this.apple = this.getRandomApplePosition();
      cells[this.apple].cellType = 'cell apple';
    } else {
      const tailPosition = this.snake.shift();
      cells[tailPosition].cellType = 'cell';
    }

    cells[newHeadPosition].cellType = 'cell snake';

    this.cells = cells;
    this.setState(() => {
      return { cells: cells };
    });

    this.eatItself(newHeadPosition);
    // if (this.eatItself(newHeadPosition)) {
    //   this.pauseGame();
    // }
  }

  eatApple(headPosition) {
    if (headPosition === this.apple) {
      this.setState({ score: this.state.score + 1 });
      return true;
    }
    return false;
  }

  eatItself(headPosition) {
    const snake = this.snake.slice(0, -1);
    if (snake.includes(headPosition)) {
      this.setState({ isGameOver: true });
      return true;
    }
    return false;
  }

  calcHeadSnakePosition() {
    let newHeadPosition = this.snake[this.snake.length - 1];
    if (this.direction === CONST.DIRECTION_RIGHT) {
      newHeadPosition += 1;
      //if reached right wall
      if (newHeadPosition % CONST.FIELD_SIZE === 0) {
        newHeadPosition -= CONST.FIELD_SIZE;
      }
    }

    if (this.direction === CONST.DIRECTION_LEFT) {
      //if reached left wall
      if (newHeadPosition % CONST.FIELD_SIZE <= 0) {
        newHeadPosition += CONST.FIELD_SIZE;
      }
      newHeadPosition -= 1;
    }

    if (this.direction === CONST.DIRECTION_DOWN) {
      newHeadPosition += 20;
      //if reached bottom wall
      if (newHeadPosition >= this.countOfCells) {
        newHeadPosition -= this.countOfCells;
      }
    }

    if (this.direction === CONST.DIRECTION_UP) {
      newHeadPosition -= 20;
      //if reached top wall
      if (newHeadPosition < 0) {
        newHeadPosition += this.countOfCells;
      }
    }

    return newHeadPosition;
  }

  getRandomApplePosition() {
    const max = this.countOfCells - 1;
    let applePosition;
    do {
      applePosition = Math.floor(Math.random() * Math.floor(max));
    } while (this.snake.includes(applePosition));

    return applePosition;
  }

  handleClick(direction, e) {
    this.changeDirection(direction);
  }

  changeDirection(newDirection) {
    if (
      (this.direction === CONST.DIRECTION_RIGHT &&
        newDirection === CONST.DIRECTION_LEFT) ||
      (this.direction === CONST.DIRECTION_LEFT &&
        newDirection === CONST.DIRECTION_RIGHT) ||
      (this.direction === CONST.DIRECTION_UP &&
        newDirection === CONST.DIRECTION_DOWN) ||
      (this.direction === CONST.DIRECTION_DOWN &&
        newDirection === CONST.DIRECTION_UP)
    ) {
      return;
    }
    this.direction = newDirection;
    this.makeMove();
  }

  componentDidMount() {
    window.addEventListener('keydown', this.keyHandler);
  }

  tick() {
    if (this.state.isPause || this.state.isGameOver) return;

    const newTime = this.state.roundTime + 1000;
    this.setState({ roundTime: newTime });
  }

  componentWillUnmount() {
    clearTimeout(this.timerId);
    clearInterval(this.roundTimerID);
    window.removeEventListener('keydown', this.keyHandler);
  }

  pauseGame() {
    let isPause = this.state.isPause;
    if (isPause) {
      this.gameLoop();
    } else {
      clearTimeout(this.timerId);
    }
    isPause = !isPause;
    this.setState({ isPause });
  }

  keyHandler(e) {
    const buttonCode = e.code;

    if (e.stopPropagation) e.stopPropagation();

    switch (buttonCode) {
      case 'KeyW':
      case 'ArrowUp':
        this.changeDirection(CONST.DIRECTION_UP);
        break;

      case 'KeyS':
      case 'ArrowDown':
        this.changeDirection(CONST.DIRECTION_DOWN);
        break;

      case 'KeyA':
      case 'ArrowLeft':
        this.changeDirection(CONST.DIRECTION_LEFT);
        break;

      case 'KeyD':
      case 'ArrowRight':
        this.changeDirection(CONST.DIRECTION_RIGHT);
        break;

      case 'Escape':
        this.pauseGame();
        break;

      default:
        break;
    }
  }

  newGame() {
    clearTimeout(this.timerId);
    clearInterval(this.roundTimerID);

    // this.setState(() => {
    //   const cells = new Array(this.countOfCells).fill(null);

    //   return { cells, ...CONST.DEFAULT_STATE };
    // });
    this.setState({ ...CONST.DEFAULT_STATE });
    // this.setState({ isGameOver: false, score: 0 });
    this.initGame();
  }

  render() {
    return (
      <div className="game-container">
        <InfoBlock score={this.state.score} time={this.state.roundTime} />
        <Board
          cells={this.state.cells}
          isGameOver={this.state.isGameOver}
          score={this.state.score}
          newGame={this.newGame}
        />
        <ButtonBlock
          handleClick={this.handleClick}
          pauseGame={this.pauseGame}
          newGame={this.newGame}
          isPause={this.state.isPause}
        />
      </div>
    );
  }
}

function InfoBlock(props) {
  return (
    <div className="info-block">
      <Timer time={props.time} />
      <p className="info-block__text">Score: {props.score} </p>
    </div>
  );
}

function Timer(props) {
  const min = Math.floor(props.time / 60000);
  const sec = Math.floor(props.time / 1000);
  const timeMin = addZero(min % 60);
  const timeSec = addZero(sec % 60);
  return (
    <div className="info-block__text roundTime">
      {timeMin}:{timeSec}
    </div>
  );

  function addZero(n) {
    return (parseInt(n, 10) < 10 ? '0' : '') + n;
  }
}

function Cell(props) {
  return <div className={props.cellType}></div>;
}

function Board(props) {
  if (props.isGameOver) {
    return (
      <div className="board">
        <GameOver score={props.score} newGame={props.newGame} />
      </div>
    );
  } else
    return (
      <div className="board">
        {props.cells.map((cell) => {
          return <Cell key={cell.cellNumber} cellType={cell.cellType} />;
        })}
      </div>
    );
}

function GameOver(props) {
  return (
    <div className="game-over">
      <p className="game-over__text">GAME OVER!</p>
      <p className="game-over__text">Your score: {props.score}</p>
      <button className="new-game-button" onClick={props.newGame}>
        New game
      </button>
    </div>
  );
}

function ButtonBlock(props) {
  let icon;
  if (props.isPause) {
    icon = 'play_arrow';
  } else {
    icon = 'pause';
  }
  return (
    <div className="button-block">
      <button onClick={(e) => props.handleClick(CONST.DIRECTION_LEFT, e)}>
        &larr;
      </button>
      <button onClick={(e) => props.handleClick(CONST.DIRECTION_DOWN, e)}>
        &darr;
      </button>
      <button onClick={(e) => props.handleClick(CONST.DIRECTION_UP, e)}>
        &uarr;
      </button>
      <button onClick={(e) => props.handleClick(CONST.DIRECTION_RIGHT, e)}>
        &rarr;
      </button>
      <button onClick={props.pauseGame}>
        <span className="material-icons">{icon}</span>
      </button>
      <button onClick={props.newGame}>
        <span className="material-icons">replay</span>
      </button>
    </div>
  );
}

export default Snake;
