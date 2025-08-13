import { Routes, Route } from 'react-router-dom';
import ResumeFindPage from './pages/resume_finder';
import ResumeSearchedListPage from './pages/resume_results';
import ResumeDetailPage from './pages/resume_detail';
import CandidateProfile from './pages/candidate_update';
import NewJobPost from './pages/new_job';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import { FrappeProvider } from 'frappe-react-sdk';
import AuthMiddleware from './components/middelwares/authMiddleware';
function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <FrappeProvider>
      <AuthMiddleware>
        <Header />
        
        <Routes>
          <Route path="/resume_search/search" element={<ResumeFindPage />} />
          <Route path="/resume_search/results" element={<ResumeSearchedListPage />} />
          <Route path="/resume_search/detail/:id" element={<ResumeDetailPage />} />
          <Route path="/resume_search/update/:id" element={<CandidateProfile />} />
          <Route path="/resume_search/new-job" element={<NewJobPost />} />
        </Routes>
        
        <Footer />
      </AuthMiddleware>
      </FrappeProvider>
    </div>
  );
}


export default App;
