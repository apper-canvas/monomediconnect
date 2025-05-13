import { createContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUser, clearUser } from '../store/userSlice';

// Create the authentication context
export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Initialize ApperUI once when the app loads
  useEffect(() => {
    const { ApperClient, ApperUI } = window.ApperSDK;
    
    try {
      const client = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      // Initialize but don't show login yet
      ApperUI.setup(client, {
        target: '#authentication',
        clientId: import.meta.env.VITE_APPER_PROJECT_ID,
        view: 'both',
        onSuccess: function(user) {
          // Store user data in Redux store
          if (user && user.isAuthenticated) {
            dispatch(setUser(user));
            navigate('/dashboard');
          } else {
            navigate('/login');
          }
        },
        onError: function(error) {
          console.error("Authentication failed:", error);
          navigate('/login');
        }
      });
      
      setIsInitialized(true);
    } catch (error) {
      console.error("Error initializing ApperUI:", error);
    }
  }, [dispatch, navigate]);
  
  // Authentication methods to share via context
  const authMethods = {
    isInitialized,
    logout: async () => {
      try {
        const { ApperUI } = window.ApperSDK;
        await ApperUI.logout();
        dispatch(clearUser());
        navigate('/login');
      } catch (error) {
        console.error("Logout failed:", error);
      }
    },
    showLogin: () => {
      try {
        const { ApperUI } = window.ApperSDK;
        ApperUI.showLogin("#authentication");
      } catch (error) {
        console.error("Error showing login:", error);
      }
    },
    showSignup: () => {
      try {
        const { ApperUI } = window.ApperSDK;
        ApperUI.showSignup("#authentication");
      } catch (error) {
        console.error("Error showing signup:", error);
      }
    }
  };
  
  return (
    <AuthContext.Provider value={authMethods}>
      {children}
    </AuthContext.Provider>
  );
}