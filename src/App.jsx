
import './App.css'
import Calculator from './Components/Calculator'

function App() {

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-violet-900 to-fuchsia-900 flex flex-col items-center justify-center p-4">
        <h1 className='text-6xl font-bold bg-gradient-to-r from-cyan-300 via-violet-300 to-fuchsia-300 bg-clip-text text-transparent mb-4'>Scientific Calculator</h1>
      <p className="text-white/90 text-xl font-medium mb-3">
            Advanced • Vibrant • Powerful
          </p>
      <Calculator />
    </div>
    </>
  )
}

export default App
