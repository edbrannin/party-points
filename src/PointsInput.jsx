import React, { Component } from 'react';

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

const EXAMPLE_INPUT = `
Alice 1 2 3
Bob 4 4
`.trim();

class PointsInput extends Component {
  constructor(props) {
    super(props);
    this.bulkUpdate = () => {
      props.onChange(parseText(this.bulkInput.value));
    };
  }

  render() {
    return (
      <div>
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
    );
  }
}

export default PointsInput;
export { parseText };
