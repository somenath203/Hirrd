/* eslint-disable react/prop-types */
import { Boxes, BriefcaseBusiness, School } from "lucide-react";
import BarLoader from 'react-spinners/BarLoader';
import { useUser } from "@clerk/clerk-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import useFetch from "@/hooks_for_api_calls/use_fetch";
import { updateApplicationStatus } from "@/supabase_apis/apply_for_job_application_apis";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
  


const ApplicationCard = ({ particularJobData, application }) => {


    const { user } = useUser();


    const handleDownloadResume = () => {

    const anchorTag = document.createElement('a');

    anchorTag.href = application?.resume;

    anchorTag.target = '_blank';

    anchorTag.click();

  }


  const { 
    executeCallbackFunction: updatedApplicationStatus,
    loading: loadingUpdatedApplicationStatus
  } = useFetch(updateApplicationStatus, {
        candidate_id: application?.candidate_id
  });


  const handleApplicationStatusChange = (status) => {

    updatedApplicationStatus(status);

  }


  return (
    <Card>

       {loadingUpdatedApplicationStatus && <BarLoader className="mb-4" width={'100%'} color="#36d7b7" />}

        <CardHeader>

            <CardTitle className='flex flex-col lg:flex-row gap-4 lg:gap-0 items-center lg:justify-between font-bold'>
                
                <span className="text-xl text-center">{application?.name}</span>

                <Button className='tracking-wider' variant='secondary' onClick={handleDownloadResume}>
                    Download Resume
                </Button>
            
            </CardTitle>

        </CardHeader>

        <CardContent className='flex flex-col gap-4 flex-1'>

            <div className="flex flex-col gap-3 md:gap-0 md:flex-row justify-between">

                <div className="flex items-center gap-2"> 
                    
                    <BriefcaseBusiness size={15} /> {application?.experience} years of experience 
                
                </div>

                <div className="flex items-center gap-2"> 
                    
                    <School size={15} /> Education level: {application?.education} 
                
                </div>

                <div className="flex items-center gap-2"> 
                    
                    <Boxes size={15} /> 
                    
                    Skills: {application?.skills} 
                
                </div>

            </div>


            {application?.job_to_which_the_application_belongs_to?.title && application?.job_to_which_the_application_belongs_to?.company_to_which_this_job_belongs_to?.name && <div className="flex flex-col gap-3 mt-2">

                <div>
                    Job Title: <span className="font-bold">{application?.job_to_which_the_application_belongs_to?.title}</span>
                </div>

                <div>
                    Company: <span className="font-bold">{application?.job_to_which_the_application_belongs_to?.company_to_which_this_job_belongs_to?.name}</span>
                </div>

            </div>}


            <hr />

        </CardContent>

        <CardFooter className='flex items-center flex-col gap-4 lg:gap-0 lg:flex-row lg:justify-between'>

            <div className="flex items-center gap-2">

                Applied at: <span>{new Date(application?.created_at).toLocaleString()}</span>

            </div>

            {user.id !== particularJobData?.recruiter_id ? (

                <div className="flex items-center gap-2 capitalize">

                    Status of Application: <span className="font-bold">{application?.status}</span>

                </div>

            ) : <Select onValueChange={handleApplicationStatusChange} defaultValue={application?.status}>
                    <SelectTrigger className='w-52'>
                        <SelectValue placeholder="application status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="applied">Applied</SelectItem>
                        <SelectItem value="interviewing">Interviewing</SelectItem>
                        <SelectItem value="hired">Hired</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                </Select>
            }

        </CardFooter>

    </Card>
  )
}

export default ApplicationCard;