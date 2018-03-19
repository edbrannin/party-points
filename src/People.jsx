import React, { Component } from 'react';
import Person from './Person';
import ResultsTable from './ResultsTable'

const add = (a, b) => a + b;

const parseText = (text) => {
  const lines = text.split(/\r?\n/g);
  const people = lines
    .map(line => /(\D+) +([\d ]+)/.exec(line))
    .filter(match => match)
    .map(match => ({
      name: match[1],
      values: match[2].split(/ +/g).map(Number).filter(Boolean),
    }))
    .map(row => ({
      ...row,
      sum: row.values.reduce(add, 0),
    }));
  return {
    people,
    total: people.map(a => a.sum).reduce(add, 0),
  };
};

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

const EXAMPLE_INPUT = `
Ed 1 2 3
Jen 4 4
`;

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
    this.bulkUpdate = () => {
      this.setState({
        ...parseText(this.bulkInput.value),
      });
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
          <div style={{
            textAlign: 'left',
          }}
          >
            <p>Enter names and lists of point-values, one person per line.</p>
            <p>Example:</p>
            <blockquote>
              <pre>{EXAMPLE_INPUT}</pre>
            </blockquote>
            <p>
              Then click &quot;Simulate&quot; to demonstrate fairness,
              or Pick A Winner to.... pick a winner.
            </p>
          </div>
          <textarea
            ref={
              (textarea) => {
                this.bulkInput = textarea;
              }
            }
            rows={20}
            cols={60}
            onChange={this.bulkUpdate}
            style={{
              display: 'block',
            }}
          />
        </div>
        <div
          style={{
            display: 'inline-block',
            margin: '1em',
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
  parseText,
  byIndex,
  nextBelowIndex,
};
