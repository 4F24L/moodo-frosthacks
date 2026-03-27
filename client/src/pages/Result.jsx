import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import EnhancedAnalysisResult from '../components/dashboard/EnhancedAnalysisResult';

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const result = location.state?.result;
  
  useEffect(() => {
    if (!result) {
      navigate('/dashboard');
    }
  }, [result, navigate]);

  if (!result) return null;

  return (
    <div className="w-full h-[calc(100vh-4rem)] overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }} 
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="h-full"
      >
        <EnhancedAnalysisResult result={result} />
      </motion.div>
    </div>
  );
};

export default Result;
