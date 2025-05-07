import './App.css';
import Navbar from './components/navbar.jsx';
import Footer from './components/footer.jsx';
import HomePage from './components/homePage.jsx';
import AboutPage from './components/about.jsx';
import CompanyProfile from './components/companyProfile.jsx';
import ECommerceTemplateDetail from './components/ECommerceTemplateDetail.jsx';
import TutorialPage from './components/tutorial.jsx';
import PortfolioTemplateDetail from './components/portofolioTemplates.jsx';
import { useState, useEffect } from 'react';

export default function App() {
  const [activeNav, setActiveNav] = useState('home');
  const [templateView, setTemplateView] = useState({
    show: false,
    type: null,
  });
  
  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeNav, templateView]);

  // Render content based on navigation and template view state
  const renderContent = () => {
    if (activeNav === 'home') {
      if (templateView.show) {
        if (templateView.type === 'ecommerce') {
          return <ECommerceTemplateDetail setActiveNav={() => {
            setTemplateView({ show: false, type: null });
            setActiveNav('home');
          }} />;
        } else if (templateView.type === 'portfolio') {
          return <PortfolioTemplateDetail setActiveNav={() => {
            setTemplateView({ show: false, type: null });
            setActiveNav('home');
          }} />;
        } else if (templateView.type === 'business') {
          return <CompanyProfile setActiveNav={() => {
            setTemplateView({ show: false, type: null });
            setActiveNav('home');
          }} />;
        }
      }
      return <HomePage setTemplateView={setTemplateView} setActiveNav={setActiveNav} />;
    }
    if (activeNav === 'about') return <AboutPage />;
    if (activeNav === 'tutorial') return <TutorialPage />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar activeNav={activeNav} setActiveNav={(nav) => {
        setTemplateView({ show: false, type: null });
        setActiveNav(nav);
      }} />
      
      {renderContent()}
      
      <Footer />
    </div>
  );
}