import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header.tsx';
import Footer from './components/Footer.tsx';
import Home from './pages/Home.tsx';
import Search from './pages/Search.tsx';
import Subject from './pages/Subject.tsx';
import Contribute from './pages/Contribute.tsx';
import Profile from './pages/Profile.tsx';
import Login from './pages/Login.tsx';
import Roadmaps from './pages/Roadmaps.tsx';
import RoadmapDetail from './pages/RoadmapDetail.tsx';
import CreateRoadmap from './pages/CreateRoadmap.tsx';

function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/subject/:code" element={<Subject />} />
            <Route path="/contribute" element={<Contribute />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/roadmaps" element={<Roadmaps />} />
            <Route path="/roadmaps/:id" element={<RoadmapDetail />} />
            <Route path="/roadmaps/create" element={<CreateRoadmap />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
