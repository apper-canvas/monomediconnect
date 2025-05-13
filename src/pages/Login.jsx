import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { motion } from 'framer-motion';
import { AuthContext } from '../contexts/AuthContext';
import getIcon from '../utils/iconUtils';

function Login() {
  const { isInitialized, showLogin } = useContext(AuthContext);
  const HeartPulseIcon = getIcon("HeartPulse");

  useEffect(() => {
    if (isInitialized) {
      // Show login UI in this component
      showLogin();
    }
  }, [isInitialized, showLogin]);

  return (
    <motion.div 
      className="flex min-h-screen items-center justify-center bg-surface-50 text-center dark:bg-surface-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-full max-w-md space-y-8 p-6 bg-white dark:bg-surface-800 rounded-lg shadow-md">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <HeartPulseIcon className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-surface-800 dark:text-surface-100">Welcome Back</h1>
          <p className="mt-2 text-surface-600 dark:text-surface-400">Sign in to your MediConnect account</p>
        </div>
        
        <div id="authentication" className="min-h-[400px]"></div>
        
        <div className="text-center mt-4">
          <p className="text-sm text-surface-600 dark:text-surface-400">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-primary hover:text-primary-dark">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default Login;