import React from 'react';
import './App.css';
import { Logo } from './Logo';
import { Select } from './demos/Select';

function App() {
  return (
    <div className="App">
      <main className="App-container">
        <Logo />
        <h1>dimension</h1>
        <section>
          <a href="https://github.com/a-type/dimension">Github</a>
        </section>
        <section>
          <p>
            dimension is an intuitive, flexible keyboard selection system for
            the web
          </p>
          <p>
            with dimension, you can construct a variety of common interactive
            components using consistent and understandable patterns
          </p>
          <Select />
        </section>
      </main>
    </div>
  );
}

export default App;
