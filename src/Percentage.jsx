import React from 'react';

const Percentage = ({ count, total }) => (
  <span>
    {Math.round((count / total) * 1000) / 10}
    %
  </span>
);

export default Percentage;
