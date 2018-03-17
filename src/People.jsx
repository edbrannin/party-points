import React, { Component } from 'react';
import Person from './Person';

const add = (a, b) => a + b;

const parseText = (text) => {
  const lines = text.split(/\r?\n/g);
  const people = lines
    .map(line => /([a-zA-Z ]+) ([\d ]+)/.exec(line))
    .filter(match => match)
    .map(match => ({
      name: match[1],
      values: match[2].split(/ +/g).map(Number).filter(Boolean),
    }))
    .map(row => ({
      ...row,
      sum: row.values.reduce(add, 0),
    }));
  console.log(people);
  return {
    people,
    total: people.map(a => a.sum).reduce(add, 0),
  };
};

const monteCarlo = data => data;

const CENTER = {
  marginLeft: 'auto',
  marginRight: 'auto',
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
    this.bulkUpdate = () => {
      this.setState({
        ...parseText(this.bulkInput.value),
      });
    };
    this.simulate = () => {
      this.setState({
        simulation: monteCarlo(this.state.data),
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
            <th>Name</th>
            <th>Points</th>
            <th>%</th>
          </thead>
          <tbody>
            {this.state.people.map(p => (
              <tr>
                <td>{p.name}</td>
                <td>{p.sum}</td>
                <td>{Math.round((p.sum / this.state.total) * 1000) / 10}%</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={this.simulate}>Simulate</button>
        <button onClick={this.pickAWinner}>Pick A Winner</button>
        {simulation}
      </div>
    );
  }
}

export default People;
