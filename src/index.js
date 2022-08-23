import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props) {
  return (
    <button
      className="square"
      onClick={props.onClick}
      style={props.estAligne ? { color: 'red' } : { color: 'black' }}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  // affiche la grille de jeu
  renderSquare(i) {
    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        estAligne={this.props.alignementCasesGagnant[i] ? true : false}
      />
    );
  }

  render() {
    let plateau = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
    ];
    let listePlateauDeJeu = [];
    plateau.map((ligne, y) => {
      listePlateauDeJeu.push(
        <div className="board-row" key={y}>
          {ligne.map((colonne, x) => {
            let indice = colonne;
            return this.renderSquare(indice);
          })}
        </div>
      );
    });
    return <div>{listePlateauDeJeu}</div>;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          x: 'colonne',
          y: 'ligne',
        },
      ],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares).gagnant || squares[i]) {
      return; //ignore le clic si qqn a deja gagné la partie ou si la case est déja remplie.
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([
        {
          squares: squares,
          x: (i % 3) + 1,
          y: Math.floor(i / 3) + 1,
        },
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move
        ? 'Revenir au tour n°' + move
        : 'Revenir au début de la partie';
      return (
        <li key={move}>
          <button
            onClick={() => this.jumpTo(move)}
            style={
              move === this.state.stepNumber
                ? { fontWeight: 'bold' }
                : { fontWeight: 'normal' }
            }
          >
            {desc}
          </button>{' '}
          {history[move].x + ' ' + history[move].y}
        </li>
      );
    });
    let status;
    let alignementCasesGagnant = [
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
    ];
    let finEtMatchNul = true;
    for (const uneCase of current.squares) {
      // pour déterminer si on a cochées toutes les cases
      uneCase === null ? (finEtMatchNul = false) : null;
    }
    if (winner.gagnant) {
      status = winner.gagnant + ' a gagné';
      //détermine les cases alignées
      alignementCasesGagnant[winner.casesGagnantes[0]] = true;
      alignementCasesGagnant[winner.casesGagnantes[1]] = true;
      alignementCasesGagnant[winner.casesGagnantes[2]] = true;
    } else if (finEtMatchNul) {
      status = 'Match nul';
    } else {
      status = 'Prochain joueur : ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            alignementCasesGagnant={alignementCasesGagnant}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  // retourne null si aucun des joueurs n'a gagné sinon retourne le nom du gagnant et la position des cases alignées
  // squares : liste de longeur 9 representant le jeu
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        gagnant: squares[a],
        casesGagnantes: [a, b, c],
      };
    }
  }
  return {
    gagnant: null,
    casesGagnantes: null,
  };
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Game />);
