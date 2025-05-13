import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { ServiceDataService } from '../services/serviceService';
import { AuthContext } from '../contexts/AuthContext';
import getIcon from '../utils/iconUtils';

export default function ServiceList() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { logout } = useContext(AuthContext);
  
  // Icons
  const HeartPulseIcon = getIcon("HeartPulse");
  const CalendarIcon = getIcon("Calendar");
  const HomeIcon = getIcon("Home");
  const ClipboardListIcon = getIcon("ClipboardList");
  const UserIcon = getIcon("User");
  const LogOutIcon = getIcon("LogOut");
  const MenuIcon = getIcon("Menu");
  const XIcon = getIcon("X");
  const RefreshCwIcon = getIcon("RefreshCw");
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  useEffect(() => {
    fetchServices();
  }, []);
  
  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await ServiceDataService.fetchServices();
      
      if (response && response.data) {
        setServices(response.data);
      } else {
        setServices([]);
      }
      setError(null);
    } catch (err) {
      console.error("Error fetching services:", err);
      setError("Failed to load services. Please try again.");
      toast.error("Failed to load services");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-surface-50 text-surface-800 dark:bg-surface-900 dark:text-surface-100">
      {/* Header */}
      <header className="fixed top-0 z-40 w-full border-b border-surface-200 bg-white/80 backdrop-blur-md dark:border-surface-700 dark:bg-surface-900/80">
        <div className="container mx-auto px-4 flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <HeartPulseIcon className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">MediConnect</span>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <ul className="flex space-x-6">
              <li>
                <Link to="/dashboard" className="flex items-center gap-1.5 px-2 py-1 text-sm font-medium transition-colors text-surface-600 hover:text-surface-900 dark:text-surface-400 dark:hover:text-surface-100">
                  <HomeIcon size={16} />
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/appointments" className="flex items-center gap-1.5 px-2 py-1 text-sm font-medium transition-colors text-surface-600 hover:text-surface-900 dark:text-surface-400 dark:hover:text-surface-100">
                  <CalendarIcon size={16} />
                  Appointments
                </Link>
              </li>
              <li>
                <Link to="/services" className="flex items-center gap-1.5 px-2 py-1 text-sm font-medium transition-colors text-primary">
                  <ClipboardListIcon size={16} />
                  Services
                </Link>
              </li>
            </ul>
          </nav>
          
          {/* User Menu */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <UserIcon size={16} />
              </div>
            </div>
            
            <button 
              onClick={logout}
              className="hidden md:flex items-center gap-1.5 rounded-lg border border-surface-200 px-3 py-1.5 text-sm font-medium text-surface-700 transition-colors hover:bg-surface-100 dark:border-surface-700 dark:text-surface-300 dark:hover:bg-surface-800"
            >
              <LogOutIcon size={16} />
              Logout
            </button>
            
            {/* Mobile Menu Toggle */}
            <button
              className="block rounded-lg p-2 text-surface-500 hover:bg-surface-100 hover:text-surface-900 dark:text-surface-400 dark:hover:bg-surface-800 dark:hover:text-white md:hidden"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
            </button>
          </div>
        </div>
      </header>
      
      {/* Mobile Navigation Menu */}
      <div
        className={`fixed inset-0 z-30 transform bg-white pt-16 transition-transform duration-300 ease-in-out dark:bg-surface-900 md:hidden ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <nav className="container mx-auto px-4 py-6">
          <div className="mb-6 flex items-center gap-3 border-b border-surface-200 pb-4 dark:border-surface-700">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <UserIcon size={20} />
            </div>
          </div>
          
          <ul className="space-y-4">
            <li>
              <Link
                to="/dashboard"
                onClick={() => setIsMenuOpen(false)}
                className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-lg font-medium transition-colors text-surface-700 hover:bg-surface-100 dark:text-surface-300 dark:hover:bg-surface-800"
              >
                <HomeIcon size={20} />
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/appointments"
                onClick={() => setIsMenuOpen(false)}
                className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-lg font-medium transition-colors text-surface-700 hover:bg-surface-100 dark:text-surface-300 dark:hover:bg-surface-800"
              >
                <CalendarIcon size={20} />
                Appointments
              </Link>
            </li>
            <li>
              <Link
                to="/services"
                onClick={() => setIsMenuOpen(false)}
                className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-lg font-medium transition-colors bg-primary/10 text-primary"
              >
                <ClipboardListIcon size={20} />
                Services
              </Link>
            </li>
            <li>
              <button
                onClick={() => {
                  logout();
                  setIsMenuOpen(false);
                }}
                className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-lg font-medium transition-colors text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
              >
                <LogOutIcon size={20} />
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </div>
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold">Our Services</h1>
              <p className="mt-2 text-surface-600 dark:text-surface-400">
                Explore the healthcare services offered by MediConnect
              </p>
            </div>
            
            <div className="mt-4 flex items-center gap-4 md:mt-0">
              <button
                onClick={fetchServices}
                className="flex items-center gap-1.5 rounded-lg bg-surface-100 px-3 py-2 text-sm font-medium text-surface-700 transition-colors hover:bg-surface-200 dark:bg-surface-800 dark:text-surface-300 dark:hover:bg-surface-700"
              >
                <RefreshCwIcon size={16} />
                Refresh
              </button>
              
              <Link
                to="/"
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
              >
                Book Appointment
              </Link>
            </div>
          </div>
          
          {loading ? (
            <div className="flex h-60 items-center justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="rounded-xl bg-red-50 p-6 text-center text-red-800 dark:bg-red-900/30 dark:text-red-200">
              <p>{error}</p>
              <button
                onClick={fetchServices}
                className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-red-100 px-4 py-2 text-sm font-medium text-red-800 hover:bg-red-200 dark:bg-red-800/30 dark:text-red-300 dark:hover:bg-red-700/30"
              >
                <RefreshCwIcon size={16} />
                Try Again
              </button>
            </div>
          ) : services.length === 0 ? (
            <div className="rounded-xl bg-white p-8 text-center shadow-card dark:bg-surface-800">
              <ClipboardListIcon className="mx-auto mb-4 h-16 w-16 text-surface-400" />
              <h2 className="mb-2 text-xl font-semibold">No Services Found</h2>
              <p className="mb-6 text-surface-600 dark:text-surface-400">
                There are no services available at the moment.
              </p>
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
              >
                Return to Home
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => {
                const ServiceIcon = getIcon(service.icon || "Activity");
                return (
                  <motion.div
                    key={service.Id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="rounded-xl bg-white p-6 shadow-card dark:bg-surface-800"
                  >
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <ServiceIcon size={24} />
                    </div>
                    <h2 className="mb-2 text-xl font-semibold">{service.title || service.Name}</h2>
                    <p className="mb-4 text-surface-600 dark:text-surface-400">
                      {service.description || "No description available"}
                    </p>
                    <Link
                      to="/"
                      className="inline-flex items-center text-primary hover:text-primary-dark"
                    >
                      Book Appointment
                      <svg className="ml-1 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-surface-200 bg-white py-4 dark:border-surface-800 dark:bg-surface-900">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-surface-600 dark:text-surface-400">
            © {new Date().getFullYear()} MediConnect. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}