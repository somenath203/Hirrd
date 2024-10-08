/* eslint-disable react/prop-types */
import { useUser } from '@clerk/clerk-react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';


const ProtectedRoute = ({ children }) => {

  const { isSignedIn, isLoaded, user } = useUser();

  const navigate = useNavigate();

  const { pathname } = useLocation();

  const [openSignInModal, setOpenSignInModal] = useState(false);


  useEffect(() => {

    if (isLoaded && !isSignedIn) {

      setOpenSignInModal(true);

    }

  }, [isSignedIn, isLoaded]);


  const handleCloseModal = () => {

    setOpenSignInModal(false);

    navigate('/'); 

  };


  if(user !== undefined && !user?.unsafeMetadata?.role && pathname !== '/onboarding') {

    return <Navigate to='/onboarding' />

  }



  if (isLoaded && !isSignedIn) {
    return (
      <>
        <AlertDialog open={openSignInModal} onOpenChange={setOpenSignInModal}>

        <AlertDialogContent>

            <AlertDialogHeader>

            <AlertDialogTitle className='text-center'>Authentication required to access this route</AlertDialogTitle>

            <AlertDialogDescription className='text-center'>
                To continue, please sign in. Authentication is necessary to ensure secure access to this section of the application.
            </AlertDialogDescription>

            </AlertDialogHeader>

            <AlertDialogFooter>
                <AlertDialogCancel onClick={handleCloseModal}>Back to Home Page</AlertDialogCancel>
            </AlertDialogFooter>

        </AlertDialogContent>

        </AlertDialog>
      </>
    );
  }

  return isSignedIn ? children : null;
};

export default ProtectedRoute;