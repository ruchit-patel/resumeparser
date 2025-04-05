import { Routes, Route } from 'react-router-dom';
import ResumeFindPage from './pages/resume_finder';
import ResumeSearchedListPage from './pages/resume_results';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import { FrappeProvider } from 'frappe-react-sdk';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <FrappeProvider>
        <Header />
        
        <Routes>
          <Route path="/resume_search/search" element={<ResumeFindPage />} />
          <Route path="/resume_search/results" element={<ResumeSearchedListPage />} />
        </Routes>
        
        <Footer />
      </FrappeProvider>
    </div>
  );
}

export default App;
