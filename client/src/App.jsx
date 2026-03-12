import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ChatRoom from './pages/ChatRoom';

function App() {
  return (
    <Router>
      <div className="min-h-screen font-sans text-gray-900 bg-gray-50">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat/:token" element={<ChatRoom />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
