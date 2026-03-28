import { useState, useEffect } from 'react';
import {
  AuthNavbar,
  AuthFooter,
  AuthModal,
  HeroSection,
  PartnerLogos,
  StatsSection,
  WhyMoodoSection,
  HowItWorksSection,
  FeaturesSection
} from '../components';

const Landing = ({ onLogin }) => {
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Warmup both backend and AI services when landing page loads
  useEffect(() => {
    const warmupServices = async () => {
      console.log('Warmup: Starting service warmup...');
      
      // Check if already warmed this session
      if (sessionStorage.getItem('services_warmed')) {
        console.log('Warmup: Services already warmed this session');
        return;
      }
      
      const warmupPromises = [];

      // Warmup backend API health endpoint
      const API_URL = import.meta.env.VITE_API_URL;
      console.log('Warmup: API_URL =', API_URL);
      
      if (API_URL) {
        const backendUrl = API_URL.replace('/api', '') + '/api/health';
        console.log('Warmup: Calling backend health at', backendUrl);
        
        warmupPromises.push(
          fetch(backendUrl, { 
            method: 'GET',
            signal: AbortSignal.timeout(5000)
          })
          .then(res => {
            console.log('Warmup: Backend health response:', res.status);
            return res;
          })
          .catch(err => console.log('Warmup: Backend health failed:', err.message))
        );
      }

      // Warmup AI service health endpoint
      const AI_URL = import.meta.env.VITE_AI_SERVICE_URL;
      console.log('Warmup: AI_URL =', AI_URL);
      
      if (AI_URL) {
        const aiHealthUrl = AI_URL + '/health';
        console.log('Warmup: Calling AI health at', aiHealthUrl);
        
        warmupPromises.push(
          fetch(aiHealthUrl, { 
            method: 'GET',
            signal: AbortSignal.timeout(5000)
          })
          .then(res => {
            console.log('Warmup: AI health response:', res.status);
            return res;
          })
          .catch(err => console.log('Warmup: AI health failed:', err.message))
        );
      }

      // Execute both warmup calls in parallel
      if (warmupPromises.length > 0) {
        console.log('Warmup: Executing', warmupPromises.length, 'warmup calls...');
        await Promise.allSettled(warmupPromises);
        sessionStorage.setItem('services_warmed', 'true');
        console.log('Warmup: All services warmed successfully');
      } else {
        console.log('Warmup: No services to warm up');
      }
    };
    
    // Delay slightly to not block initial render
    console.log('Warmup: Setting up warmup timer...');
    const timer = setTimeout(warmupServices, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleOpenModal = () => {
    setShowAuthModal(true);
  };

  const handleCloseModal = () => {
    setShowAuthModal(false);
  };

  const handleAuthSuccess = () => {
    onLogin();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      <AuthNavbar onLoginClick={handleOpenModal} />
      
      <HeroSection onGetStarted={handleOpenModal} />
      
      <PartnerLogos />
      
      {/* <StatsSection /> */}
      
      <div id="why-moodo" className="scroll-mt-20">
        <WhyMoodoSection />
      </div>
      
      <div id="how-it-works" className="scroll-mt-20">
        <HowItWorksSection />
      </div>
      
      <div id="features" className="scroll-mt-20">
        <FeaturesSection />
      </div>
      
      <AuthFooter />

      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2" />

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={handleCloseModal}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
};

export default Landing;
