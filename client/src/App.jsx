import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ChatRoom from './pages/ChatRoom';

function App() {
  return (
    <Router>
      <div className="min-h-screen font-sans text-white bg-black selection:bg-white selection:text-black">
        <div className="glow-mesh"></div>
        <div className="relative z-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chat/:token" element={<ChatRoom />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
