/* eslint-disable react-hooks/exhaustive-deps */
import { useUser } from '@clerk/clerk-react';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import BarLoader from 'react-spinners/BarLoader';
import { Briefcase, DoorClosed, DoorOpen, MapPinIcon } from 'lucide-react';
import MDEditor from '@uiw/react-md-editor';

import useFetch from '@/hooks_for_api_calls/use_fetch';
import {
  getParticularJob,
  updateHiringStatusOfAJob,
} from '@/supabase_apis/jobs_api';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import ApplyForJobApplicantDrawer from '@/app_components/ApplyForJobApplicantDrawer';
import ApplicationCard from '@/app_components/ApplicationCard';


const ParticularJob = () => {

  const { isLoaded, user } = useUser();

  const { id } = useParams();

  const {
    executeCallbackFunction: fetchParticularJobFunc,
    data: particularJobData,
    loading: loadingParticularJobData,
  } = useFetch(getParticularJob, {
    job_id: id,
  });

  const {
    executeCallbackFunction: updateJobHiringStatusFunc,
    loading: loadingUpdateJobHiringStatusData,
  } = useFetch(updateHiringStatusOfAJob, {
    job_id: id,
  });


  const handleJobHiringStatusChange = (value) => {

    const isJobActive = value === 'active';

    
    updateJobHiringStatusFunc(isJobActive).then(() => fetchParticularJobFunc());

  };

  useEffect(() => {

    if (isLoaded) {
      fetchParticularJobFunc();
    }

  }, [isLoaded]);


  if (!isLoaded || loadingParticularJobData) {

    return <BarLoader className="mb-4" width={'100%'} color="#36d7b7" />

  }


  return (
    <div className="flex flex-col gap-8 mt-5">

      <div className="flex flex-col-reverse gap-6 md:flex-row justify-between items-center">

        <h1 className="gradient-title font-extrabold pb-3 text-3xl sm:text-6xl">
          {particularJobData?.title}
        </h1>

        <img
          src={particularJobData?.company_to_which_this_job_belongs_to?.logo_url}
          alt={particularJobData?.title}
          className="h-12"
        />
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:gap-0 lg:justify-between">

        <div className="flex gap-2 items-center">

          <MapPinIcon />

          {particularJobData?.location}

        </div>


        <div className="flex item-center gap-2">

          <Briefcase />

          {particularJobData?.all_applications_of_the_job?.length} Applicants

        </div>


        <div className="flex item-center gap-2">

          {particularJobData?.isJoBActive ? (
            <>
              <DoorOpen /> Active
            </>
          ) : (
            <>
              <DoorClosed /> Closed
            </>
          )}

        </div>

      </div>


      {loadingUpdateJobHiringStatusData && <BarLoader width={'100%'} color="#36d7b7" />}
      
      {particularJobData?.recruiter_id === user?.id ? (
        <Select onValueChange={handleJobHiringStatusChange}>

          <SelectTrigger className={`w-full ${particularJobData?.isJoBActive ? "bg-green-950" : "bg-red-950"}`}>
            <SelectValue placeholder={`Hiring Status ${particularJobData?.isJoBActive ? "(Active)" : "(Closed)"}`} />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>

        </Select>
      ) : (
        <></>
      )}

      <h2 className="text-2xl sm:text-3xl font-bold">About the Job</h2>

      <p className="sm:text-lg">{particularJobData?.description}</p>

      <h2 className="text-2xl sm:text-2xl font-bold">
        What are we looking for
      </h2>

      <MDEditor.Markdown
        source={particularJobData?.requirements}
        className="bg-transparent sm:text-lg"
      />
        

      {particularJobData?.isJoBActive ? user?.unsafeMetadata?.role !== 'recruiter' ? particularJobData?.recruiter_id !== user?.id ? <ApplyForJobApplicantDrawer 
        detailsOfTheJobUserAppliedFor={particularJobData} 
        detailsOfUserWhoAppliedForTheJob={user}
        fetchParticularJobAfterUserSubmittedTheApplication={fetchParticularJobFunc}
        hasUserAlreadyAppliedForTheJob={particularJobData.all_applications_of_the_job.find((application) => application.candidate_id === user.id)}
      /> : <></> : <p className='text-center mt-4 p-4 w-full bg-blue-950'>You are not eligible to apply for this job because you are a recruiter</p> : <p className='text-center mt-4 p-4 w-full bg-red-950'>The Job is no longer active</p>}


      {particularJobData?.all_applications_of_the_job?.length > 0 && particularJobData?.recruiter_id === user?.id && <div className='flex flex-col gap-2'>

        <h2 className='text-2xl sm:text-3xl font-bold'>Applications</h2>

        {particularJobData?.all_applications_of_the_job?.map((application) => (

          <ApplicationCard 
            key={application.id} 
            application={application}
            particularJobData={particularJobData}
          />

        ))}

      </div>}
    
    
    </div>
  );
};

export default ParticularJob;
