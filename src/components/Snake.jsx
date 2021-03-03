import React from 'react';
import * as CONST from '../modules/Constants';

class Snake extends React.Component {
  constructor(props) {
    super(props);

    this.snake = [101, 102, 103, 104, 105];
    this.apple = 250;

    this.direction = CONST.DIRECTION_RIGHT;
    this.fieldSize = CONST.FIELD_SIZE;
    this.countOfCells = this.fieldSize * this.fieldSize;

    this.handleClick = this.handleClick.bind(this);
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
  }

  makeMove() {
    let cells = this.state.cells.slice();
    let newHeadPosition = this.calcHeadSnakePosition();

    this.snake.push(newHeadPosition);
    const tailPosition = this.snake.shift();
    console.log(cells[newHeadPosition]);

    cells[newHeadPosition].cellType = 'cell snake';
    cells[tailPosition].cellType = 'cell';

    this.setState(() => {
      return { cells: cells };
    });
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
      newHeadPosition -= 1;
      //if reached left wall
      if (newHeadPosition % CONST.FIELD_SIZE <= 0) {
        newHeadPosition += CONST.FIELD_SIZE;
      }
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

  handleClick(direction, e) {
    // console.log(direction);
    // console.log(e);
    this.changeDirection(direction);
    this.makeMove();
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
    // this.setState(() => {
    //   return { cells: cells };
    // });
    //this.cells.push(<Cell key={i} cellType={this.state.cells[i].cellType} />);
    // console.log(cells);
    console.log(this.state.cells);
  }

  componentWillUnmount() {}

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
