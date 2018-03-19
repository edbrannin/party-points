import React, { Component } from 'react';
import './App.css';
import People from './People';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">MLM Party Points</h1>
        </header>
        <People />
      </div>
    );
  }
}

export default App;
