import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { State } from "country-state-city";
import { useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import BarLoader from "react-spinners/BarLoader";
import MDEditor from "@uiw/react-md-editor";
import { Navigate, useNavigate } from "react-router-dom";

import useFetch from "@/hooks_for_api_calls/use_fetch";
import { fetchAllCompanies } from "@/supabase_apis/companies_apis";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { createNewJob } from "@/supabase_apis/jobs_api";


const PostNewJob = () => {

  const zodFormValidationSchema = z.object({
    title: z.string().min(1, { message: "Title is required" }),
    description: z.string().min(1, { message: "Description is required" }),
    location: z.string().min(1, { message: "Select a location" }),
    company_id: z.string().min(1, { message: "Select or Add a new Company" }),
    requirements: z.string().min(1, { message: "Requirements are required" }),
  });

  const { isLoaded, user } = useUser();

  const navigate = useNavigate();


  const { 
    executeCallbackFunction: fetchCompaniesFunc,
    loading: loadingCompanies,
    data: allCompanies,
  } = useFetch(fetchAllCompanies);


  const { 
    executeCallbackFunction: createJobFunc,
    loading: loadingCreatedJob,
    data: createdJobData,
    error: createJobError
  } = useFetch(createNewJob);


  useEffect(() => {
    
    if(createdJobData?.length > 0) navigate('/jobs');

  }, [loadingCreatedJob]);


  useEffect(() => {

    if (isLoaded) {

      fetchCompaniesFunc();

    }

  }, [isLoaded]);


  const { register, handleSubmit, control, formState: { errors } } = useForm({
    defaultValues: {
      location: '',
      company_id: '',
      requirements: ''
    },
    resolver: zodResolver(zodFormValidationSchema)
  });


  const onSubmitForm = (data) => {

    createJobFunc({
      ...data,
      recruiter_id: user.id,
      isJoBActive: true
    });

  }


  if(user?.unsafeMetadata?.role !== 'recruiter') {

    return <Navigate to='/jobs' />

  }

  

  if(!isLoaded || loadingCompanies) {
    
    return <BarLoader className="mb-4" width={'100%'} color="#36d7b7" />

  }

  return (
    <div>

      <h1 className="gradient-title font-extrabold text-4xl sm:text-7xl text-center pb-8">
        Post a Job
      </h1>

      <form className="flex flex-col gap-4 p-4 pb-0" onSubmit={handleSubmit(onSubmitForm)}>


        <Input placeholder="enter the job title" {...register('title')} />
        {errors.title && <p className="text-red-500">{errors.title.message}</p>}


        <Textarea rows={4} className='!resize-none' placeholder='enter job description' {...register('description')} />
        {errors.description && <p className="text-red-500">{errors.description.message}</p>}


        <div className="flex gap-4 items-center">

          <Controller 
            name="location" 
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>

                <SelectTrigger>
                  <SelectValue placeholder="select job location" />
                </SelectTrigger>

                <SelectContent>

                  <SelectGroup>

                    {State.getStatesOfCountry('IN').map(({name}) => (

                      <SelectItem value={name} key={name}>{name}</SelectItem>

                    ))}

                  </SelectGroup>

                </SelectContent>

              </Select>
            )}
          />

          <Controller
            name="company_id"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>

                <SelectTrigger>
                  <SelectValue placeholder="select the company">
                    {field.value ? allCompanies?.find((company) => company.id === Number(field.value))?.name : "company"}
                    {/* since, in case of 'company' input, in value, we are having the company ID and 
                        not the company name, therefore, when we will select any company from the
                        select component, we will see nothing, therefore, in order to see the selected
                        value, we did the above thing */}
                  </SelectValue>
                </SelectTrigger>

                <SelectContent>

                  <SelectGroup>

                    {allCompanies?.map(({ name, id }) => (

                      <SelectItem value={id} key={name}>{name}</SelectItem>

                    ))}

                  </SelectGroup>

                </SelectContent>

              </Select>
            )}
          />

        </div>
        {errors.location && (
          <p className="text-red-500">{errors.location.message}</p>
        )}

        {errors.company_id && (
          <p className="text-red-500">{errors.company_id.message}</p>
        )}

        <Controller 
          name="requirements" 
          control={control}
          render={({ field }) => (

            <MDEditor 
              value={field.value} 
              onChange={field.onChange}
              textareaProps={{
                placeholder: "describe your job requirements in detail here",
              }}
            />
          )}
        />
        {errors.requirements && (
          <p className="text-red-500">{errors.requirements.message}</p>
        )}

        {createJobError?.message && (
          <p className="text-red-500">{createJobError?.message}</p>
        )}

        {loadingCreatedJob && <BarLoader className="mb-4" width={'100%'} color="#36d7b7" />}

        <Button disabled={loadingCreatedJob} type="submit" variant="blue" size="lg" className="mt-2">Submit</Button>

      </form>

    </div>
  )
}

export default PostNewJob;