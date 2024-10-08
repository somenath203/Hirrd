import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import BarLoader from 'react-spinners/BarLoader';
import { useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Navigate, useNavigate } from 'react-router-dom';

import useFetch from "@/hooks_for_api_calls/use_fetch";
import { Input } from "@/components/ui/input";
import { createNewCompany, fetchAllCompanies } from '@/supabase_apis/companies_apis';
import { Button } from '@/components/ui/button';
import { toast } from "sonner"



const NewCompany = () => {

    const { isLoaded, user } = useUser();

    const navigate = useNavigate();

    const {
        executeCallbackFunction: fetchAllCompaniesFunc,
        data: fetchAllCompaniesData,
        loading: loadingAllCompanies,
      } = useFetch(fetchAllCompanies);


    useEffect(() => {

      if (isLoaded) {
    
        fetchAllCompaniesFunc();
    
      }
    
    }, [isLoaded]);


    const {
        executeCallbackFunction: addNewCompanyFunc,
        data: companyData,
        error: addNewCompanyError,
        loading: loadingAddNewCompany,
    } = useFetch(createNewCompany);


    const companyFormValidationSchema = z.object({
        name: z.string().min(1, { message: 'Company name is required' }),
        logo: z
          .any()
          .refine(
            (file) =>
              file[0] &&
              (file[0].type === 'image/png' ||
                file[0].type === 'image/jpg' ||
                file[0].type === 'image/jpeg'),
            { message: 'Only Images are allowed' }
        ),
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm({
        resolver: zodResolver(companyFormValidationSchema),
    });


    const onSubmitForm = (companyData) => {

        const isCompanyAlreadyExistInDB = fetchAllCompaniesData.find((company) => company.name.toLowerCase() === companyData.name.toLowerCase());

        if (isCompanyAlreadyExistInDB) {

            toast("company with this name already exist in the database", {
                position: 'top-right',
                duration: 4000
            });

            
        } else {

            addNewCompanyFunc({
                ...companyData,
                logo: companyData?.logo[0]
            });

        }
        
    }


    useEffect(() => {
    
        if(companyData?.length > 0) navigate('/post-job');
    
    }, [loadingAddNewCompany]);


    if(user?.unsafeMetadata?.role !== 'recruiter') {

      return <Navigate to='/jobs' />
  
    }
  

  return (
    <div>

      <h1 className="gradient-title font-extrabold text-3xl sm:text-7xl text-center pb-8 mt-14">
        Add New Company
      </h1>

      {loadingAllCompanies && <BarLoader className="mb-4" width={'100%'} color="#36d7b7" />}

      <form onSubmit={handleSubmit(onSubmitForm)} className='flex flex-col gap-4'>

        <Input placeholder="enter the company name" {...register('name')} />
        {errors.name && (
            <p className='text-red-500'>{errors.name.message}</p>
        )}

        <Input type='file' accept='image/*' className='file:text-gray-500' {...register('logo')} />
        {errors.logo && (
            <p className='text-red-500'>{errors.logo.message}</p>
        )}


        {addNewCompanyError?.message && (
            <p className='text-red-500'>{addNewCompanyError.message}</p>
        )}

        {loadingAddNewCompany && <BarLoader className="mb-4" width={'100%'} color="#36d7b7" />}

        <Button disabled={loadingAddNewCompany} type="submit" variant="destructive" size='lg'>Add New Company</Button>
      
      </form>

    </div>
  )
}


export default NewCompany;