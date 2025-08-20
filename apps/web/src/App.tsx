import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header.tsx';
import Footer from './components/Footer.tsx';
import AdminLayout from './components/AdminLayout.tsx';
import Home from './pages/Home.tsx';
import Search from './pages/Search.tsx';
import Subject from './pages/Subject.tsx';
import Contribute from './pages/Contribute.tsx';
import Profile from './pages/Profile.tsx';
import Login from './pages/Login.tsx';
import Register from './pages/Register.tsx';
import VerifyEmail from './pages/VerifyEmail.tsx';
import Roadmaps from './pages/Roadmaps.tsx';
import RoadmapDetail from './pages/RoadmapDetail.tsx';
import CreateRoadmap from './pages/CreateRoadmap.tsx';
import AdminDashboard from './pages/AdminDashboard.tsx';
import AdminUsers from './pages/AdminUsers.tsx';
import AdminResources from './pages/AdminResources.tsx';
import AdminSubjects from './pages/AdminSubjects.tsx';
import AdminBranches from './pages/AdminBranches.tsx';
import AdminRoadmaps from './pages/AdminRoadmaps.tsx';
import AdminSettings from './pages/AdminSettings.tsx';

function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Routes>
        {/* Admin Routes - No header/footer */}
        <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
        <Route path="/admin/users" element={<AdminLayout><AdminUsers /></AdminLayout>} />
        <Route path="/admin/resources" element={<AdminLayout><AdminResources /></AdminLayout>} />
        <Route path="/admin/subjects" element={<AdminLayout><AdminSubjects /></AdminLayout>} />
        <Route path="/admin/branches" element={<AdminLayout><AdminBranches /></AdminLayout>} />
        <Route path="/admin/roadmaps" element={<AdminLayout><AdminRoadmaps /></AdminLayout>} />
        <Route path="/admin/settings" element={<AdminLayout><AdminSettings /></AdminLayout>} />

        {/* Regular Routes - With header/footer */}
        <Route path="*" element={
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
                <Route path="/register" element={<Register />} />
                <Route path="/verify-email/:token" element={<VerifyEmail />} />
                <Route path="/roadmaps" element={<Roadmaps />} />
                <Route path="/roadmaps/:id" element={<RoadmapDetail />} />
                <Route path="/roadmaps/create" element={<CreateRoadmap />} />
              </Routes>
            </main>
            <Footer />
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
