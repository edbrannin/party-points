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
  let lastGood = undefined;
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
  console.log(winner);
  return winner;
};

const monteCarlo = ({ people, total }, trials = 10000) => (
  new Array(trials)
    .map(() => pickAWinner({ people, total }))
    .reduce((state, name) => ({
      ...state,
      [name]: state[name] + 1,
    }), {})
);

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
      <pre>{JSON.stringify(this.state.simulation, null, 2)}</pre>
    );
    return (
      <div>
        <textarea
          ref={
            (textarea) => {
              this.bulkInput = textarea;
            }
          }
          rows={20}
          cols={120}
          onChange={this.bulkUpdate}
          style={{
            ...CENTER,
            display: 'block',
          }}
        />
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
                {this.state.simulation && <td>{this.state.simulation[p.name]}</td>}
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
