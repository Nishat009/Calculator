
import './App.css'
import Calculator from './Components/Calculator'

function App() {
  return (
    <div className="app-shell">
      <div className="app-container">
        <header className="page-header">
          <a className="brand-mark" href="/" aria-label="Orbit calculator home"><span>o</span></a>
          <div className="brand-copy"><strong>orbit</strong><span>CALCULATOR</span></div>
          <div className="header-tag"><span className="status-pulse" /> SCIENTIFIC MODE</div>
        </header>
        <section className="intro">
          <span className="eyebrow">A LITTLE MORE POWER, BUILT RIGHT IN</span>
          <h1>Think beyond <span>numbers.</span></h1>
          <p>Everything you need to work through the big ideas.</p>
        </section>
        <Calculator />
        <footer className="page-footer"><span>MADE FOR CURIOUS MINDS</span><span>ORBIT <i>·</i> 2026</span></footer>
      </div>
    </div>
  )
}

export default App
