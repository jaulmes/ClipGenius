// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Features from './pages/Features';
import Pricing from './pages/Pricing';
import AppDashboard from './pages/AppDashboard';
import ScriptToVideo from './pages/ScriptToVideo';
import ArtistManager from './pages/Admin/ArtistManager';
import CelebrityVideo from './pages/CelebrityVideo/CelebrityVideo';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/features" element={<Features />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/app" element={<AppDashboard />} />
        <Route path="/script-to-video" element={<ScriptToVideo />} />
        <Route path="/admin" element={<ArtistManager />} />
        <Route path="/celebrity-video" element={<CelebrityVideo />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
