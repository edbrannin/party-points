import React, { Component } from 'react';
import Person from './Person';

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

const CENTER = {
  marginLeft: 'auto',
  marginRight: 'auto',
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
    }), {total: 0});
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
    const simulation = this.state.simulation && (
      <pre style={{
        textAlign: 'left',
      }}
      >{JSON.stringify(this.state.simulation, null, 2)}</pre>
    );
    return (
      <div style={{
        margin: '1em',
      }}
      >
        <div style={{
          float: 'left',
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
              ...CENTER,
              display: 'block',
            }}
          />
        </div>
        <p style={CENTER}>Total points: {this.state.total}</p>
        <table style={CENTER}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Points</th>
              <th>%</th>
              {this.state.simulation && <th>Simulated %</th>}
            </tr>
          </thead>
          <tbody>
            {this.state.people.map(p => (
              <tr key={p.name}>
                <td>{p.name}</td>
                <td>{p.sum}</td>
                <td>{Math.round((p.sum / this.state.total) * 1000) / 10}%</td>
                {
                  this.state.simulation &&
                    <td>
                      {
                        Math.round((this.state.simulation[p.name] / this.state.simulation.total) * 1000) / 10
                      }
                      %
                    </td>
                }
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={this.simulate}>Simulate</button>
        <button onClick={this.pickAWinner}>Pick A Winner</button>
        { this.state.winner && <p>Winner: {this.state.winner}!</p>}
        {simulation}
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
