import React from 'react';
import './App.css';
import { Logo } from './Logo';
import { Select } from './demos/Select';
import { Tree } from './demos/Tree';

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
          <p>from the obligatory auto-complete box...</p>
          <Select />
          <p>...to a nested tree view.</p>
          <Tree />
        </section>
        <section>
          <p>ready to learn more?</p>
          <a href="https://a-type.github.io/dimension/docs">
            read the docs
          </a>{' '}
        </section>
      </main>
    </div>
  );
}

export default App;
