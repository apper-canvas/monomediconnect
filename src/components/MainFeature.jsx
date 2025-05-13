import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { format, addDays, isWeekend } from 'date-fns';
import getIcon from '../utils/iconUtils';

export default function MainFeature() {
  // Declare all icon components
  const CalendarIcon = getIcon("Calendar");
  const ClockIcon = getIcon("Clock");
  const UserIcon = getIcon("User");
  const PhoneIcon = getIcon("Phone");
  const MailIcon = getIcon("Mail");
  const FileTextIcon = getIcon("FileText");
  const CheckCircleIcon = getIcon("CheckCircle");
  const RefreshCwIcon = getIcon("RefreshCw");
  const ChevronLeftIcon = getIcon("ChevronLeft");
  const ChevronRightIcon = getIcon("ChevronRight");
  
  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    doctorId: '',
    appointmentType: '',
    notes: '',
    date: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
    time: '09:00'
  });
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [currentDate, setCurrentDate] = useState(addDays(new Date(), 1));
  const [selectedDateInfo, setSelectedDateInfo] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  
  // Doctor options
  const doctors = [
    { id: 'dr-johnson', name: 'Dr. Sarah Johnson', specialty: 'Cardiology' },
    { id: 'dr-chen', name: 'Dr. Michael Chen', specialty: 'Pediatrics' },
    { id: 'dr-patel', name: 'Dr. Amara Patel', specialty: 'Neurology' },
  ];
  
  // Appointment types
  const appointmentTypes = [
    { id: 'checkup', name: 'General Check-up' },
    { id: 'consultation', name: 'Consultation' },
    { id: 'followup', name: 'Follow-up Visit' },
    { id: 'emergency', name: 'Urgent Care' },
  ];
  
  // Generate available times based on selected date
  useEffect(() => {
    const times = [];
    const selectedDay = new Date(formData.date);
    
    // Generate time slots between 9 AM and 5 PM
    for (let hour = 9; hour < 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        // Skip lunch time (12-1 PM)
        if (hour === 12) continue;
        
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        
        // Randomly make some slots unavailable
        const isAvailable = Math.random() > 0.3;
        
        if (isAvailable) {
          times.push(timeString);
        }
      }
    }
    
    // If weekend, limit hours
    if (isWeekend(selectedDay)) {
      setSelectedDateInfo({
        message: "Weekend hours are limited (9 AM - 12 PM).",
        type: "weekend"
      });
      setAvailableTimes(times.filter(time => parseInt(time.split(':')[0]) < 12));
    } else {
      setSelectedDateInfo(null);
      setAvailableTimes(times);
    }
    
    // Clear selected time if not available in new date
    if (!times.includes(formData.time)) {
      setFormData(prev => ({ ...prev, time: times.length > 0 ? times[0] : '' }));
    }
  }, [formData.date]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleDateChange = (e) => {
    const { value } = e.target;
    setFormData(prev => ({ ...prev, date: value }));
    setCurrentDate(new Date(value));
  };
  
  const handleNextStep = () => {
    // Validation for step 1
    if (step === 1) {
      if (!formData.fullName || !formData.email || !formData.phone) {
        toast.error("Please fill in all required fields");
        return;
      }
      
      if (!validateEmail(formData.email)) {
        toast.error("Please enter a valid email address");
        return;
      }
      
      if (!validatePhone(formData.phone)) {
        toast.error("Please enter a valid phone number");
        return;
      }
    }
    
    // Validation for step 2
    if (step === 2) {
      if (!formData.doctorId || !formData.appointmentType) {
        toast.error("Please select both a doctor and appointment type");
        return;
      }
    }
    
    setStep(prev => prev + 1);
  };
  
  const handlePrevStep = () => {
    setStep(prev => prev - 1);
  };
  
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  
  const validatePhone = (phone) => {
    return /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(phone);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.date || !formData.time) {
      toast.error("Please select both date and time");
      return;
    }
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast.success("Appointment booked successfully!");
      
      // Get selected doctor and appointment type names
      const doctor = doctors.find(doc => doc.id === formData.doctorId);
      const appointmentType = appointmentTypes.find(type => type.id === formData.appointmentType);
      
      console.log("Appointment booked:", {
        ...formData,
        doctor: doctor?.name,
        appointmentType: appointmentType?.name,
        dateTime: `${formData.date} at ${formData.time}`
      });
    }, 1500);
  };
  
  const handleReset = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      doctorId: '',
      appointmentType: '',
      notes: '',
      date: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
      time: '09:00'
    });
    setStep(1);
    setSubmitted(false);
  };
  
  const nextDay = () => {
    const nextDate = addDays(currentDate, 1);
    setCurrentDate(nextDate);
    setFormData(prev => ({ ...prev, date: format(nextDate, 'yyyy-MM-dd') }));
  };
  
  const prevDay = () => {
    // Don't allow selecting dates in the past
    if (currentDate <= new Date()) return;
    
    const prevDate = addDays(currentDate, -1);
    setCurrentDate(prevDate);
    setFormData(prev => ({ ...prev, date: format(prevDate, 'yyyy-MM-dd') }));
  };
  
  // Format time for display (24h to 12h format)
  const formatTime = (time) => {
    const [hour, minute] = time.split(':');
    const hourNum = parseInt(hour);
    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    const hour12 = hourNum % 12 || 12;
    return `${hour12}:${minute} ${ampm}`;
  };
  
  // Form steps
  const renderStep1 = () => (
    <div>
      <h3 className="mb-4 text-xl font-medium">Personal Information</h3>
      
      <div className="mb-4">
        <label htmlFor="fullName" className="form-label">Full Name*</label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-surface-500">
            <UserIcon size={18} />
          </span>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="input-field pl-10"
            placeholder="John Doe"
            required
          />
        </div>
      </div>
      
      <div className="mb-4">
        <label htmlFor="email" className="form-label">Email Address*</label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-surface-500">
            <MailIcon size={18} />
          </span>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="input-field pl-10"
            placeholder="john@example.com"
            required
          />
        </div>
      </div>
      
      <div className="mb-4">
        <label htmlFor="phone" className="form-label">Phone Number*</label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-surface-500">
            <PhoneIcon size={18} />
          </span>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="input-field pl-10"
            placeholder="(123) 456-7890"
            required
          />
        </div>
      </div>
    </div>
  );
  
  const renderStep2 = () => (
    <div>
      <h3 className="mb-4 text-xl font-medium">Appointment Details</h3>
      
      <div className="mb-6">
        <label htmlFor="doctorId" className="form-label">Select Doctor*</label>
        <select
          id="doctorId"
          name="doctorId"
          value={formData.doctorId}
          onChange={handleChange}
          className="select-field"
          required
        >
          <option value="">Select a doctor</option>
          {doctors.map((doctor) => (
            <option key={doctor.id} value={doctor.id}>
              {doctor.name} - {doctor.specialty}
            </option>
          ))}
        </select>
      </div>
      
      <div className="mb-6">
        <label htmlFor="appointmentType" className="form-label">Appointment Type*</label>
        <select
          id="appointmentType"
          name="appointmentType"
          value={formData.appointmentType}
          onChange={handleChange}
          className="select-field"
          required
        >
          <option value="">Select appointment type</option>
          {appointmentTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>
      </div>
      
      <div className="mb-4">
        <label htmlFor="notes" className="form-label">Additional Notes</label>
        <div className="relative">
          <span className="absolute left-3 top-3 text-surface-500">
            <FileTextIcon size={18} />
          </span>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="input-field min-h-[100px] pl-10"
            placeholder="Please share any symptoms or concerns..."
          />
        </div>
      </div>
    </div>
  );
  
  const renderStep3 = () => (
    <div>
      <h3 className="mb-4 text-xl font-medium">Schedule Appointment</h3>
      
      <div className="mb-6">
        <label className="form-label">Select Date*</label>
        <div className="relative mb-2">
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleDateChange}
            min={format(addDays(new Date(), 1), 'yyyy-MM-dd')}
            max={format(addDays(new Date(), 30), 'yyyy-MM-dd')}
            className="input-field"
            required
          />
        </div>
        
        <div className="mb-4 flex items-center justify-between rounded-lg bg-surface-100 p-3 dark:bg-surface-800">
          <button 
            type="button"
            onClick={prevDay}
            className="rounded-full p-1 hover:bg-surface-200 dark:hover:bg-surface-700"
            aria-label="Previous day"
          >
            <ChevronLeftIcon size={20} />
          </button>
          
          <div className="flex flex-col items-center">
            <span className="text-sm font-medium text-surface-500 dark:text-surface-400">
              {format(currentDate, 'EEEE')}
            </span>
            <span className="text-lg font-semibold">
              {format(currentDate, 'MMMM d, yyyy')}
            </span>
          </div>
          
          <button 
            type="button"
            onClick={nextDay}
            className="rounded-full p-1 hover:bg-surface-200 dark:hover:bg-surface-700"
            aria-label="Next day"
          >
            <ChevronRightIcon size={20} />
          </button>
        </div>
        
        {selectedDateInfo && (
          <div className={`mb-4 rounded-lg p-3 text-sm ${
            selectedDateInfo.type === 'weekend' ? 'bg-yellow-50 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200' : ''
          }`}>
            <p>{selectedDateInfo.message}</p>
          </div>
        )}
      </div>
      
      <div className="mb-6">
        <label className="form-label">Select Time*</label>
        
        {availableTimes.length === 0 ? (
          <div className="rounded-lg bg-red-50 p-4 text-center text-red-800 dark:bg-red-900/30 dark:text-red-200">
            No available times for this date. Please select another date.
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
            {availableTimes.map((time) => (
              <button
                key={time}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, time }))}
                className={`flex items-center justify-center rounded-lg border p-3 text-sm transition-colors ${
                  formData.time === time
                    ? 'border-primary bg-primary/10 text-primary dark:border-primary-light dark:bg-primary/20 dark:text-primary-light'
                    : 'border-surface-200 bg-white hover:border-primary hover:bg-primary/5 dark:border-surface-700 dark:bg-surface-800 dark:hover:border-primary-light dark:hover:bg-primary/10'
                }`}
              >
                <ClockIcon size={14} className="mr-1" />
                {formatTime(time)}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
  
  const renderConfirmation = () => {
    // Get selected doctor and appointment type information
    const doctor = doctors.find(doc => doc.id === formData.doctorId);
    const appointmentType = appointmentTypes.find(type => type.id === formData.appointmentType);
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="mb-6 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
            <CheckCircleIcon size={50} />
          </div>
        </div>
        
        <h3 className="mb-2 text-2xl font-bold">Appointment Confirmed!</h3>
        <p className="mb-6 text-surface-600 dark:text-surface-300">
          We've booked your appointment with {doctor.name}.
        </p>
        
        <div className="mb-8 rounded-xl bg-surface-100 p-6 dark:bg-surface-800">
          <div className="mb-4 grid grid-cols-2 gap-4 text-left">
            <div>
              <p className="text-sm font-medium text-surface-500 dark:text-surface-400">Date</p>
              <p className="font-medium">{format(new Date(formData.date), 'MMMM d, yyyy')}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-surface-500 dark:text-surface-400">Time</p>
              <p className="font-medium">{formatTime(formData.time)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-surface-500 dark:text-surface-400">Doctor</p>
              <p className="font-medium">{doctor.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-surface-500 dark:text-surface-400">Service</p>
              <p className="font-medium">{appointmentType.name}</p>
            </div>
          </div>
          
          <p className="text-center text-sm text-surface-500 dark:text-surface-400">
            A confirmation has been sent to your email ({formData.email})
          </p>
        </div>
        
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center rounded-lg bg-primary px-6 py-3 text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-surface-900"
        >
          <RefreshCwIcon size={18} className="mr-2" />
          Book Another Appointment
        </button>
      </motion.div>
    );
  };
  
  return (
    <div className="overflow-hidden rounded-2xl border border-surface-200 bg-white shadow-card dark:border-surface-700 dark:bg-surface-800 dark:shadow-none">
      {!submitted ? (
        <form onSubmit={handleSubmit}>
          {/* Progress indicator */}
          <div className="flex border-b border-surface-200 dark:border-surface-700">
            {[1, 2, 3].map((stepNumber) => (
              <div
                key={stepNumber}
                className={`flex-1 p-4 text-center text-sm font-medium ${
                  step === stepNumber
                    ? 'border-b-2 border-primary text-primary dark:border-primary-light dark:text-primary-light'
                    : step > stepNumber
                    ? 'border-b-2 border-secondary text-secondary dark:border-secondary-light dark:text-secondary-light'
                    : 'text-surface-500 dark:text-surface-400'
                }`}
              >
                Step {stepNumber}
              </div>
            ))}
          </div>
          
          {/* Form content */}
          <div className="p-6 sm:p-8">
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
            
            {/* Navigation buttons */}
            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="btn btn-outline"
                >
                  Back
                </button>
              ) : <div></div>}
              
              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="btn btn-primary"
                >
                  Continue
                </button>
              ) : (
                <button
                  type="submit"
                  className="btn btn-primary relative"
                  disabled={loading || availableTimes.length === 0}
                >
                  {loading ? (
                    <>
                      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                        <svg className="h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </span>
                      <span className="opacity-0">Confirm Appointment</span>
                    </>
                  ) : (
                    "Confirm Appointment"
                  )}
                </button>
              )}
            </div>
          </div>
        </form>
      ) : (
        <div className="p-6 sm:p-8">
          {renderConfirmation()}
        </div>
      )}
    </div>
  );
}