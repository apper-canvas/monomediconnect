import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';
import MainFeature from '../components/MainFeature';

export default function Home() {
  const [activeSection, setActiveSection] = useState('home');
  
  const HeartPulseIcon = getIcon("HeartPulse");
  const CalendarIcon = getIcon("Calendar");
  const UsersIcon = getIcon("Users");
  const ClipboardListIcon = getIcon("ClipboardList");
  const MenuIcon = getIcon("Menu");
  const XIcon = getIcon("X");
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const navItems = [
    { name: 'Home', id: 'home', icon: HeartPulseIcon },
    { name: 'Services', id: 'services', icon: ClipboardListIcon },
    { name: 'Doctors', id: 'doctors', icon: UsersIcon },
    { name: 'Appointments', id: 'appointments', icon: CalendarIcon },
  ];
  
  const handleNavClick = (id) => {
    setActiveSection(id);
    setIsMenuOpen(false);
    
    // Scroll to section
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  const serviceItems = [
    {
      title: "General Check-ups",
      description: "Regular health assessments to monitor your wellbeing and prevent potential health issues.",
      icon: "Stethoscope"
    },
    {
      title: "Specialized Care",
      description: "Expert treatment for specific health conditions by our specialized medical professionals.",
      icon: "HeartPulse"
    },
    {
      title: "Pediatric Services",
      description: "Comprehensive healthcare services designed specifically for infants, children and adolescents.",
      icon: "Baby"
    },
    {
      title: "Laboratory Tests",
      description: "Advanced diagnostic testing facilities for accurate and timely health assessments.",
      icon: "FlaskConical"
    }
  ];
  
  return (
    <div className="min-h-screen bg-surface-50 text-surface-800 dark:bg-surface-900 dark:text-surface-100">
      {/* Header */}
      <header className="fixed top-0 z-40 w-full border-b border-surface-200 bg-white/80 backdrop-blur-md dark:border-surface-700 dark:bg-surface-900/80">
        <div className="container-custom flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <HeartPulseIcon className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">MediConnect</span>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <ul className="flex space-x-6">
              {navItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => handleNavClick(item.id)}
                    className={`flex items-center gap-1.5 px-2 py-1 text-sm font-medium transition-colors ${
                      activeSection === item.id
                        ? "text-primary"
                        : "text-surface-600 hover:text-surface-900 dark:text-surface-400 dark:hover:text-surface-100"
                    }`}
                  >
                    <item.icon size={16} />
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          
          {/* Mobile Menu Toggle */}
          <button
            className="block rounded-lg p-2 text-surface-500 hover:bg-surface-100 hover:text-surface-900 dark:text-surface-400 dark:hover:bg-surface-800 dark:hover:text-white md:hidden"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
          </button>
        </div>
      </header>
      
      {/* Mobile Navigation Menu */}
      <div
        className={`fixed inset-0 z-30 transform bg-white pt-16 transition-transform duration-300 ease-in-out dark:bg-surface-900 md:hidden ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <nav className="container-custom py-6">
          <ul className="space-y-4">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleNavClick(item.id)}
                  className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-lg font-medium transition-colors ${
                    activeSection === item.id
                      ? "bg-primary/10 text-primary"
                      : "text-surface-700 hover:bg-surface-100 dark:text-surface-300 dark:hover:bg-surface-800"
                  }`}
                >
                  <item.icon size={20} />
                  {item.name}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      
      <main className="pt-16">
        {/* Hero Section */}
        <section id="home" className="bg-gradient-to-br from-primary/5 to-secondary/5 dark:from-primary/10 dark:to-secondary/10">
          <div className="container-custom grid items-center gap-8 py-12 md:grid-cols-2 md:gap-12 md:py-20 lg:py-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="mb-4 text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl">
                Healthcare <span className="text-primary">Simplified</span> For Everyone
              </h1>
              <p className="mb-6 text-lg text-surface-600 dark:text-surface-300 md:text-xl">
                Experience quality healthcare with easy appointment booking and personalized care from our expert medical team.
              </p>
              <div className="flex flex-col space-y-3 sm:flex-row sm:space-x-4 sm:space-y-0">
                <button
                  onClick={() => {
                    handleNavClick('appointments');
                    toast.success('Navigating to appointment booking');
                  }}
                  className="btn btn-primary px-6 py-3 text-base"
                >
                  Book Appointment
                </button>
                <button
                  onClick={() => {
                    handleNavClick('services');
                    toast.info('Exploring our services');
                  }}
                  className="btn btn-outline px-6 py-3 text-base"
                >
                  Explore Services
                </button>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="hidden md:block"
            >
              <img
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Healthcare professionals"
                className="h-auto w-full rounded-2xl object-cover shadow-soft"
              />
            </motion.div>
          </div>
        </section>
        
        {/* Services Section */}
        <section id="services" className="py-16 lg:py-24">
          <div className="container-custom">
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <h2 className="mb-4 text-3xl font-bold md:text-4xl">Our Healthcare Services</h2>
              <p className="text-lg text-surface-600 dark:text-surface-300">
                Comprehensive medical care tailored to your needs with a focus on quality and patient comfort.
              </p>
            </div>
            
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {serviceItems.map((service, index) => {
                const ServiceIcon = getIcon(service.icon);
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="card group"
                  >
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary transition-all group-hover:bg-primary group-hover:text-white dark:bg-primary/20">
                      <ServiceIcon size={24} />
                    </div>
                    <h3 className="mb-2 text-xl font-semibold">{service.title}</h3>
                    <p className="text-surface-600 dark:text-surface-400">{service.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
        
        {/* Doctors Section */}
        <section id="doctors" className="bg-surface-100 py-16 dark:bg-surface-800/50 lg:py-24">
          <div className="container-custom">
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <h2 className="mb-4 text-3xl font-bold md:text-4xl">Meet Our Doctors</h2>
              <p className="text-lg text-surface-600 dark:text-surface-300">
                Our team of experienced and caring healthcare professionals is committed to providing you with the best care.
              </p>
            </div>
            
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  name: "Dr. Sarah Johnson",
                  specialty: "Cardiology",
                  image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                  experience: "15+ years"
                },
                {
                  name: "Dr. Michael Chen",
                  specialty: "Pediatrics",
                  image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                  experience: "12+ years"
                },
                {
                  name: "Dr. Amara Patel",
                  specialty: "Neurology",
                  image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                  experience: "10+ years"
                }
              ].map((doctor, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="card overflow-hidden"
                >
                  <div className="mb-4 h-64 w-full overflow-hidden rounded-lg">
                    <img 
                      src={doctor.image} 
                      alt={doctor.name} 
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                  <h3 className="mb-1 text-xl font-semibold">{doctor.name}</h3>
                  <p className="mb-3 text-primary dark:text-primary-light">{doctor.specialty}</p>
                  <p className="text-surface-600 dark:text-surface-400">{doctor.experience} experience</p>
                  <button
                    onClick={() => {
                      handleNavClick('appointments');
                      toast.success(`Booking with ${doctor.name}`);
                    }}
                    className="mt-4 inline-flex items-center text-sm font-medium text-primary hover:text-primary-dark dark:text-primary-light dark:hover:text-primary"
                  >
                    Book Appointment
                    <svg className="ml-1 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Appointment Booking Section */}
        <section id="appointments" className="py-16 lg:py-24">
          <div className="container-custom">
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <h2 className="mb-4 text-3xl font-bold md:text-4xl">Book Your Appointment</h2>
              <p className="text-lg text-surface-600 dark:text-surface-300">
                Schedule your visit with our healthcare professionals in just a few steps.
              </p>
            </div>
            
            <div className="mx-auto max-w-3xl">
              <MainFeature />
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-surface-200 bg-white py-8 dark:border-surface-800 dark:bg-surface-900">
        <div className="container-custom">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <HeartPulseIcon className="h-6 w-6 text-primary" />
                <span className="text-lg font-bold">MediConnect</span>
              </div>
              <p className="text-surface-600 dark:text-surface-400">
                Providing quality healthcare services to our community since 2010.
              </p>
            </div>
            
            <div>
              <h4 className="mb-4 text-lg font-semibold">Contact Us</h4>
              <address className="not-italic text-surface-600 dark:text-surface-400">
                <p>123 Health Avenue</p>
                <p>Wellness City, WC 10001</p>
                <p>Phone: (123) 456-7890</p>
                <p>Email: info@mediconnect.com</p>
              </address>
            </div>
            
            <div>
              <h4 className="mb-4 text-lg font-semibold">Hours</h4>
              <div className="text-surface-600 dark:text-surface-400">
                <p>Monday - Friday: 8:00 AM - 7:00 PM</p>
                <p>Saturday: 9:00 AM - 5:00 PM</p>
                <p>Sunday: Closed</p>
                <p>Emergency: 24/7</p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 border-t border-surface-200 pt-6 text-center dark:border-surface-800">
            <p className="text-sm text-surface-600 dark:text-surface-400">
              © {new Date().getFullYear()} MediConnect. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}