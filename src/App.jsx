import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import getIcon from './utils/iconUtils';
import Home from './pages/Home';
import NotFound from './pages/NotFound';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const MoonIcon = getIcon("Moon");
  const SunIcon = getIcon("Sun");
  
  useEffect(() => {
    // Check for user preference
    const isDark = localStorage.getItem('darkMode') === 'true' || 
                  window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(isDark);
  }, []);
  
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);
  
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          onClick={toggleDarkMode}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-surface-800 shadow-soft transition-all hover:shadow-lg dark:bg-surface-800 dark:text-surface-100"
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {darkMode ? <SunIcon size={20} /> : <MoonIcon size={20} />}
        </motion.button>
      </div>
      
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
      
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={darkMode ? "dark" : "light"}
        toastClassName="text-sm font-medium"
      />
    </>
  );
}

export default App;