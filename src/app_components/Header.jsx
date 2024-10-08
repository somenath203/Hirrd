import { Briefcase, BriefcaseBusinessIcon, CirclePlus, Dock, PlusIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  SignUpButton,
  useUser,
} from '@clerk/clerk-react';

import { Button } from '@/components/ui/button';


const Header = () => {

  const { user } = useUser();
  
  return (
    <nav className="py-4 flex flex-col gap-4 lg:flex-row lg:gap-0 lg:justify-between items-center">

      <Link to='/'>

        <img src="/logo.png" alt="navbar logo" className="h-20" />

      </Link>


      <div>

          <SignedOut>

            <div className='flex items-center gap-3'>

              <SignInButton 
                mode='modal' 
                fallbackRedirectUrl='/onboarding'
                signUpForceRedirectUrl='/onboarding'
              >

                <Button variant='outlined'>Sign In</Button>

              </SignInButton>

              <SignUpButton 
                mode='modal' 
                fallbackRedirectUrl='/onboarding'
                signInForceRedirectUrl='/onboarding'
              >

                <Button>Sign Up</Button>

              </SignUpButton>

            </div>

          </SignedOut>


          <SignedIn>

            <div className='flex items-center'>


              <UserButton appearance={{
                  elements: {
                    avatarBox: 'w-10 h-10' 
                  }
                }}
              >

                <UserButton.MenuItems>

                  <UserButton.Link 
                    label='All Jobs'
                    labelIcon={<Briefcase size={15} />}
                    href='/jobs' 
                  />

                  {user?.unsafeMetadata?.role === 'candidate' && <UserButton.Link 
                    label='My Applications'
                    labelIcon={<Dock size={15} />}
                    href='/my-applications' 
                  />}

                  {user?.unsafeMetadata?.role === 'recruiter' && <UserButton.Link 
                    label='My Job Listings'
                    labelIcon={<BriefcaseBusinessIcon size={15} />}
                    href='/my-jobs' 
                  />}

                  {user?.unsafeMetadata?.role === 'recruiter' && <UserButton.Link 
                    label='Create Job'
                    labelIcon={<PlusIcon size={15} />}
                    href='/post-job' 
                  />}

                  {user?.unsafeMetadata?.role === 'recruiter' && <UserButton.Link 
                    label='Add Company'
                    labelIcon={<CirclePlus size={15} />}
                    href='/new-company' 
                  />}
                
                </UserButton.MenuItems>


              </UserButton>

            </div>
            
          </SignedIn>


      </div>

    </nav>
  );
};

export default Header;
