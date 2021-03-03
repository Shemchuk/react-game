import React from 'react';
import * as CONST from '../modules/Constants';

class Snake extends React.Component {
  constructor(props) {
    super(props);

    this.timeStep = CONST.LOOP_TIME;
    this.timerId = 0;
    this.direction = CONST.DIRECTION_RIGHT;
    this.fieldSize = CONST.FIELD_SIZE;
    this.countOfCells = this.fieldSize * this.fieldSize;
    this.isGameOver = false;

    this.snake = [101, 102, 103, 104, 105];
    this.apple = this.getRandomApplePosition();

    this.handleClick = this.handleClick.bind(this);
    this.stopGame = this.stopGame.bind(this);
    this.keyHandler = this.keyHandler.bind(this);

    let cells = [];
    this.state = { cells };

    this.initGame();
  }

  initGame() {
    let cells = []; //this.state.cells.slice();
    this.state = { cells };
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

    this.setState(() => {
      return { cells: cells };
    });

    console.log(this.state.cells);

    this.gameLoop();
  }

  gameLoop() {
    this.timerId = setTimeout(() => {
      this.makeMove();
      if (!this.isGameOver) {
        this.gameLoop();
      }
    }, this.timeStep);
  }

  makeMove() {
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

    this.setState(() => {
      return { cells: cells };
    });

    if (this.eatItself(newHeadPosition)) {
      this.stopGame();
      alert('Game over!');
    }
  }

  eatApple(headPosition) {
    if (headPosition === this.apple) {
      return true;
    }
    return false;
  }

  eatItself(headPosition) {
    const snake = this.snake.slice(0, -1);
    if (snake.includes(headPosition)) {
      this.isGameOver = true;
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
      console.log(applePosition);
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
  }

  componentDidMount() {
    window.addEventListener('keydown', this.keyHandler);
    console.log(this.state.cells);
  }

  componentWillUnmount() {
    clearTimeout(this.timerId);
    windows.removeEventListener('keydown', this.keyHandler);
  }

  stopGame() {
    clearTimeout(this.timerId);
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
        this.stopGame();
        break;

      default:
        break;
    }
  }

  render() {
    return (
      <div>
        <div className="board">
          {this.state.cells.map((cell) => {
            return <Cell key={cell.cellNumber} cellType={cell.cellType} />;
          })}
        </div>
        <button onClick={(e) => this.handleClick(CONST.DIRECTION_LEFT, e)}>
          left
        </button>
        <button onClick={(e) => this.handleClick(CONST.DIRECTION_DOWN, e)}>
          down
        </button>
        <button onClick={(e) => this.handleClick(CONST.DIRECTION_UP, e)}>
          up
        </button>
        <button onClick={(e) => this.handleClick(CONST.DIRECTION_RIGHT, e)}>
          right
        </button>
        <button onClick={this.stopGame}>stop</button>
      </div>
    );
  }
}

function Cell(props) {
  // let snakeClass = '';
  // if (props.snake) {
  //   snakeClass = 'snake';
  // }
  return <div className={props.cellType}></div>;
}

export default Snake;
