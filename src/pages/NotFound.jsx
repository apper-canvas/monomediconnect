import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import getIcon from '../utils/iconUtils';

export default function NotFound() {
  const AlertCircleIcon = getIcon("AlertCircle");
  const HomeIcon = getIcon("Home");
  
  return (
    <motion.div 
      className="flex min-h-screen flex-col items-center justify-center bg-surface-50 text-center dark:bg-surface-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mx-auto max-w-lg px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="mb-8 flex justify-center"
        >
          <AlertCircleIcon className="h-24 w-24 text-primary" />
        </motion.div>
        
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-surface-900 dark:text-white md:text-5xl">
          404 - Page Not Found
        </h1>
        
        <p className="mb-8 text-lg text-surface-600 dark:text-surface-300">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        
        <Link 
          to="/"
          className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-base font-medium text-white transition-all hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-surface-900"
        >
          <HomeIcon className="mr-2 h-5 w-5" />
          Back to Home
        </Link>
      </div>
    </motion.div>
  );
}