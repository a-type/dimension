import React from 'react';
import './App.css';
import { Logo } from './Logo';

function App() {
  return (
    <div className="App">
      <main className="App-container">
        <Logo />
        <h1>dimension</h1>
        <section>
          <a href="https://github.com/a-type/dimension">Github</a>
        </section>
      </main>
    </div>
  );
}

export default App;
