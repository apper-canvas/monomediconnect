import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { AppointmentService } from '../services/appointmentService';
import { AuthContext } from '../contexts/AuthContext';
import getIcon from '../utils/iconUtils';

export default function AppointmentList() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
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
  const CheckCircleIcon = getIcon("CheckCircle");
  const XCircleIcon = getIcon("XCircle");
  const ClockIcon = getIcon("Clock");
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  useEffect(() => {
    fetchAppointments();
  }, [filter]);
  
  const fetchAppointments = async () => {
    setLoading(true);
    try {
      let filterParams = {};
      
      // Apply filters based on selected option
      if (filter !== 'all') {
        filterParams.status = filter;
      }
      
      const response = await AppointmentService.fetchAppointments(filterParams);
      
      if (response && response.data) {
        setAppointments(response.data);
      } else {
        setAppointments([]);
      }
      setError(null);
    } catch (err) {
      console.error("Error fetching appointments:", err);
      setError("Failed to load appointments. Please try again.");
      toast.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };
  
  const handleStatusChange = async (id, newStatus) => {
    try {
      await AppointmentService.updateAppointment(id, { status: newStatus });
      
      // Update the local state
      setAppointments(prevAppointments => 
        prevAppointments.map(appointment => 
          appointment.Id === id ? { ...appointment, status: newStatus } : appointment
        )
      );
      
      toast.success(`Appointment status updated to ${newStatus}`);
    } catch (err) {
      console.error("Error updating appointment status:", err);
      toast.error("Failed to update appointment status");
    }
  };
  
  const handleDeleteAppointment = async (id) => {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      try {
        await AppointmentService.deleteAppointment(id);
        
        // Remove from local state
        setAppointments(prevAppointments => 
          prevAppointments.filter(appointment => appointment.Id !== id)
        );
        
        toast.success("Appointment deleted successfully");
      } catch (err) {
        console.error("Error deleting appointment:", err);
        toast.error("Failed to delete appointment");
      }
    }
  };
  
  // Format time from 24h to 12h format
  const formatTime = (time) => {
    if (!time) return "";
    const [hour, minute] = time.split(':');
    const hourNum = parseInt(hour);
    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    const hour12 = hourNum % 12 || 12;
    return `${hour12}:${minute} ${ampm}`;
  };
  
  // Get status badge style
  const getStatusBadge = (status) => {
    switch(status) {
      case 'Scheduled':
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case 'Completed':
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case 'Cancelled':
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      case 'No-show':
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      default:
        return "bg-surface-100 text-surface-800 dark:bg-surface-700 dark:text-surface-300";
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
                <Link to="/appointments" className="flex items-center gap-1.5 px-2 py-1 text-sm font-medium transition-colors text-primary">
                  <CalendarIcon size={16} />
                  Appointments
                </Link>
              </li>
              <li>
                <Link to="/services" className="flex items-center gap-1.5 px-2 py-1 text-sm font-medium transition-colors text-surface-600 hover:text-surface-900 dark:text-surface-400 dark:hover:text-surface-100">
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
                className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-lg font-medium transition-colors bg-primary/10 text-primary"
              >
                <CalendarIcon size={20} />
                Appointments
              </Link>
            </li>
            <li>
              <Link
                to="/services"
                onClick={() => setIsMenuOpen(false)}
                className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-lg font-medium transition-colors text-surface-700 hover:bg-surface-100 dark:text-surface-300 dark:hover:bg-surface-800"
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
              <h1 className="text-3xl font-bold">Your Appointments</h1>
              <p className="mt-2 text-surface-600 dark:text-surface-400">
                View and manage your healthcare appointments
              </p>
            </div>
            
            <div className="mt-4 flex items-center gap-4 md:mt-0">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="rounded-lg border border-surface-200 bg-white px-3 py-2 text-sm dark:border-surface-700 dark:bg-surface-800"
              >
                <option value="all">All Appointments</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
                <option value="No-show">No-show</option>
              </select>
              
              <button
                onClick={fetchAppointments}
                className="flex items-center gap-1.5 rounded-lg bg-surface-100 px-3 py-2 text-sm font-medium text-surface-700 transition-colors hover:bg-surface-200 dark:bg-surface-800 dark:text-surface-300 dark:hover:bg-surface-700"
              >
                <RefreshCwIcon size={16} />
                Refresh
              </button>
              
              <Link
                to="/"
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
              >
                Book New
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
                onClick={fetchAppointments}
                className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-red-100 px-4 py-2 text-sm font-medium text-red-800 hover:bg-red-200 dark:bg-red-800/30 dark:text-red-300 dark:hover:bg-red-700/30"
              >
                <RefreshCwIcon size={16} />
                Try Again
              </button>
            </div>
          ) : appointments.length === 0 ? (
            <div className="rounded-xl bg-white p-8 text-center shadow-card dark:bg-surface-800">
              <CalendarIcon className="mx-auto mb-4 h-16 w-16 text-surface-400" />
              <h2 className="mb-2 text-xl font-semibold">No Appointments Found</h2>
              <p className="mb-6 text-surface-600 dark:text-surface-400">
                {filter === 'all' 
                  ? "You don't have any appointments yet." 
                  : `You don't have any ${filter.toLowerCase()} appointments.`}
              </p>
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
              >
                <CalendarIcon size={16} />
                Book an Appointment
              </Link>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-surface-200 bg-white dark:border-surface-700 dark:bg-surface-800">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-surface-200 bg-surface-50 dark:border-surface-700 dark:bg-surface-900">
                    <tr>
                      <th className="whitespace-nowrap px-6 py-3 text-left text-sm font-medium text-surface-500 dark:text-surface-400">
                        Appointment Details
                      </th>
                      <th className="whitespace-nowrap px-6 py-3 text-left text-sm font-medium text-surface-500 dark:text-surface-400">
                        Date & Time
                      </th>
                      <th className="whitespace-nowrap px-6 py-3 text-left text-sm font-medium text-surface-500 dark:text-surface-400">
                        Status
                      </th>
                      <th className="whitespace-nowrap px-6 py-3 text-left text-sm font-medium text-surface-500 dark:text-surface-400">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-200 dark:divide-surface-700">
                    {appointments.map((appointment) => (
                      <tr 
                        key={appointment.Id}
                        className="hover:bg-surface-50 dark:hover:bg-surface-700/50"
                      >
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-medium">{appointment.fullName}</span>
                            <span className="text-sm text-surface-500 dark:text-surface-400">
                              {appointment.doctor} • {appointment.appointmentType}
                            </span>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {appointment.date ? format(new Date(appointment.date), 'MMM d, yyyy') : 'N/A'}
                            </span>
                            <span className="text-sm text-surface-500 dark:text-surface-400">
                              {formatTime(appointment.time)}
                            </span>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadge(appointment.status)}`}>
                            {appointment.status || 'Unknown'}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="flex items-center gap-2">
                            {appointment.status === 'Scheduled' && (
                              <>
                                <button
                                  onClick={() => handleStatusChange(appointment.Id, 'Completed')}
                                  className="rounded p-1 text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20"
                                  title="Mark as Completed"
                                >
                                  <CheckCircleIcon size={18} />
                                </button>
                                <button
                                  onClick={() => handleStatusChange(appointment.Id, 'Cancelled')}
                                  className="rounded p-1 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                                  title="Cancel Appointment"
                                >
                                  <XCircleIcon size={18} />
                                </button>
                                <button
                                  onClick={() => handleStatusChange(appointment.Id, 'No-show')}
                                  className="rounded p-1 text-yellow-600 hover:bg-yellow-50 dark:text-yellow-400 dark:hover:bg-yellow-900/20"
                                  title="Mark as No-show"
                                >
                                  <ClockIcon size={18} />
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => handleDeleteAppointment(appointment.Id)}
                              className="rounded p-1 text-surface-600 hover:bg-surface-100 hover:text-red-600 dark:text-surface-400 dark:hover:bg-surface-700 dark:hover:text-red-400"
                              title="Delete Appointment"
                            >
                              <XIcon size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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