/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom';
import { MapPinIcon, Trash2Icon } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import BarLoader from 'react-spinners/BarLoader';
import { useEffect } from 'react';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import useFetch from '@/hooks_for_api_calls/use_fetch';
import { deleteJob } from '@/supabase_apis/jobs_api';


const JobCard = ({ jobData, fetchAllJobsAfterAJobIsDeleted }) => {

  
  const { user } = useUser();

  const { 
    executeCallbackFunction: deleteJobFunc,
    loading: loadingDeleteJob
  } = useFetch(deleteJob, {
    job_id: jobData.id
  });


  const handleDeleteJob = async () => {

    await deleteJobFunc().then(() => {

      fetchAllJobsAfterAJobIsDeleted();

    })

  }
  

  if(loadingDeleteJob) {

    return <BarLoader className="mb-4" width={'100%'} color="#36d7b7" />

  }

  return (
    <Card className='flex flex-col'>

      <CardHeader>

        <CardTitle  className="flex flex-col lg:flex-row gap-3 lg:gap-3 items-center lg:justify-between font-bold">
            
            <span className='text-lg text-center lg:text-2xl'>{jobData.title}</span>

            {jobData?.recruiter_id === user.id && (
                <Trash2Icon
                    fill="red"
                    size={18}
                    className="text-red-300 cursor-pointer"
                    onClick={handleDeleteJob}
                />
            )}
            
        </CardTitle>

      </CardHeader>

      <CardContent className='flex flex-col gap-4 flex-1'>

        <di className='flex items-center justify-between'>

            {jobData.company_to_which_this_job_belongs_to && <img src={jobData.company_to_which_this_job_belongs_to.logo_url} className='h-6' />}

            <div className='flex items-center gap-2'>

                <MapPinIcon size={15} /> {jobData.location}

            </div>
        
        </di>

        <hr />

        {jobData.description.split(' ').length <= 5 ? jobData.description : jobData.description.split(' ').slice(0, 5).join(' ') + ' . . . .'}

      </CardContent>

      <CardFooter className='flex items-center gap-2'>

        <Link to={`/job/${jobData.id}`} className='flex-1'>

            <Button variant="secondary" className="w-full">More Details</Button>

        </Link>

      </CardFooter>

    </Card>
  );
};

export default JobCard;
