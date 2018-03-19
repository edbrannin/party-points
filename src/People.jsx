import React, { Component } from 'react';
import Person from './Person';
import ResultsTable from './ResultsTable'
import PointsInput from './PointsInput';

const byIndex = ({ people }) => {
  const state = { soFar: 0 };
  const answer = [];
  // FIXME messy
  people.map((p) => {
    answer[state.soFar] = p.name;
    state.soFar += p.sum;
    return undefined;
  });
  return answer;
};

const nextBelowIndex = ({ people }, target) => {
  let lastGood;
  byIndex({ people }).forEach((person, index) => {
    if (index <= target) {
      lastGood = person;
    }
  });
  return lastGood;
};

const pickAWinner = ({ people, total }) => {
  const randomIndex = Math.floor(Math.random() * total);
  const winner = nextBelowIndex({ people }, randomIndex);
  return winner;
};

const monteCarlo = ({ people, total }, trials = 10000) => {
  const winners = [];
  for (let i = 0; i < trials; i += 1) {
    winners.push(pickAWinner({ people, total }));
  }
  return winners
    .reduce((state, name) => ({
      ...state,
      [name]: (state[name] || 0) + 1,
      total: state.total + 1,
    }), { total: 0 });
};

class People extends Component {
  constructor(props) {
    super(props);
    this.state = { people: [] };
    this.addPerson = () => this.setState(oldState => ({
      people: [
        ...oldState.people,
        <Person />,
      ],
    }));
    this.updatePeople = (data) => {
      this.setState(data);
    };
    this.simulate = () => {
      this.setState({
        simulation: monteCarlo(this.state),
      });
    };
    this.pickAWinner = () => {
      this.setState({
        winner: pickAWinner(this.state),
      });
    };
  }

  render() {
    return (
      <div style={{
        margin: '1em',
      }}
      >
        <div style={{
          display: 'inline-block',
          maxWidth: '70%',
          margin: '1em',
        }}
        >
          <PointsInput onChange={this.updatePeople} />
        </div>
        <div
          style={{
            display: 'inline-block',
            margin: '1em',
            visibility: this.state.people.length ? 'visible' : 'hidden',
            opacity: this.state.people.length && 1,
            transition: 'opacity 0.5s linear',
          }}
        >
          { this.state.winner && <h1>Winner: {this.state.winner}!</h1>}
          <ResultsTable
            total={this.state.total}
            people={this.state.people}
            simulation={this.state.simulation}
          />
          <button onClick={this.simulate}>Simulate</button>
          <button onClick={this.pickAWinner}>Pick A Winner</button>
        </div>
      </div>
    );
  }
}

export default People;
export {
  byIndex,
  nextBelowIndex,
};
