import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePage } from '@inertiajs/react'; // Assuming Inertia.js is used for page props

interface UserProps {
  user?: {
    type?: string;
    id?: string;
  };
  [key: string]: any; // Allow other properties
}

export default function HomeRedirector() {
  const navigate = useNavigate();
  const { props } = usePage<UserProps>(); // Get page props from Inertia.js

  useEffect(() => {
    // This is a placeholder. In a real application, you would make an API call
    // to GET / to fetch the user type after successful login.
    // For now, we'll simulate it using a prop or a direct fetch.

    // Assuming user type is available in props after login
    const userType = props.user?.type; // Adjust this based on your actual Inertia.js prop structure

    if (userType) {
      if (userType === 'Teacher') {
        navigate('/teacherhome');
      } else if (userType === 'Student') {
        navigate('/studenthome');
      } else if (userType === 'Admin') {
        navigate('/adminhome');
      } else {
        // Handle unknown user type or redirect to a default page
        console.warn('Unknown user type:', userType);
        navigate('/login'); // Redirect to login if user type is not recognized
      }
    } else {
      // If userType is not available, it means the user is not logged in or session expired.
      // Redirect to login page.
      navigate('/login');
    }
  }, [navigate, props.user?.type]);

  return (
    <div>Loading user profile...</div>
  );
}
