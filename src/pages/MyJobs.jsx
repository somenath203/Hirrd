import { useUser } from "@clerk/clerk-react";
import BarLoader from "react-spinners/BarLoader";
import { useEffect } from "react";

import useFetch from "@/hooks_for_api_calls/use_fetch";
import { getAllJobsOfTheCurrentlyLoggedInRecruiter } from "@/supabase_apis/jobs_api";
import JobCard from "@/app_components/JobCard";


const MyJobs = () => {

  const { user, isLoaded } = useUser();


  const {
    executeCallbackFunction: getAllJobsOfTheCurrentLoggedInUserFunc,
    data: allJobsOfTheCurrentLoggedInUserData,
    loading: loadingGetAllJobsOfTheCurrentLoggedInUser,
  } = useFetch(getAllJobsOfTheCurrentlyLoggedInRecruiter, {
    recruiter_id: user.id
  });

  useEffect(() => {

    getAllJobsOfTheCurrentLoggedInUserFunc();

  }, []);



  if(loadingGetAllJobsOfTheCurrentLoggedInUser) {

    return <BarLoader className="mb-4" width={'100%'} color="#36d7b7" />

  }


  if(!isLoaded) {

    return <BarLoader className="mb-4" width={'100%'} color="#36d7b7" />

  }


  return (
    <div>

      <h1 className="gradient-title font-extrabold text-4xl sm:text-7xl text-center pb-8">
        My Job Listing
      </h1>

      {allJobsOfTheCurrentLoggedInUserData?.length > 0 ? <div className="flex flex-col gap-5">
        {allJobsOfTheCurrentLoggedInUserData.map((job) => {
            return (
                <JobCard key={job?.id} jobData={job} fetchAllJobsAfterAJobIsDeleted={getAllJobsOfTheCurrentLoggedInUserFunc} />
            )
        })}
      </div> : <div className="gradient-title font-extrabold text-xl mt-10 sm:text-3xl text-center pb-8">
        No Job Data Found
    </div>}

    </div>
  )
}

export default MyJobs;