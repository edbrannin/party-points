import React from 'react';
import Percentage from './Percentage';

const CENTER = {
  marginLeft: 'auto',
  marginRight: 'auto',
};

const ResultsTable = ({
  total,
  people,
  simulation,
}) => (
  <div>
    {total && <p style={CENTER}>Total points: {total}</p>}
    <table style={CENTER}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Points</th>
          <th>%</th>
          {simulation && <th>Simulated %</th>}
        </tr>
      </thead>
      <tbody>
        {people.map(p => (
          <tr key={p.name}>
            <td>{p.name}</td>
            <td>{p.sum}</td>
            <td><Percentage count={p.sum} total={total} /></td>
            {
              simulation &&
                <td>
                  <Percentage
                    count={simulation[p.name]}
                    total={simulation.total}
                  />
                </td>
            }
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default ResultsTable;
