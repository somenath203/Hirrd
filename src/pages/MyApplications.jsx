import { useUser } from "@clerk/clerk-react";
import BarLoader from "react-spinners/BarLoader";
import { useEffect } from "react";

import { getAllApplicationsOfTheCurrentAuthenticatedCandidate } from "@/supabase_apis/apply_for_job_application_apis";
import useFetch from "@/hooks_for_api_calls/use_fetch";
import ApplicationCard from "@/app_components/ApplicationCard";


const MyApplications = () => {

  const { user, isLoaded } = useUser();


  const {
    executeCallbackFunction: getAllApplicationsOfTheCurrentLoggedInUserFunc,
    data: allApplicationsOfTheCurrentLoggedInUserData,
    loading: loadingGetAllApplicationsOfTheCurrentLoggedInUser,
  } = useFetch(getAllApplicationsOfTheCurrentAuthenticatedCandidate, {
    user_id: user.id
  });

  useEffect(() => {

    getAllApplicationsOfTheCurrentLoggedInUserFunc();

  }, []);



  if(loadingGetAllApplicationsOfTheCurrentLoggedInUser) {

    return <BarLoader className="mb-4" width={'100%'} color="#36d7b7" />

  }


  if(!isLoaded) {

    return <BarLoader className="mb-4" width={'100%'} color="#36d7b7" />

  }


  return (
    <div>

      <h1 className="gradient-title font-extrabold text-3xl sm:text-7xl text-center pb-8">
        My Applications
      </h1>

      {allApplicationsOfTheCurrentLoggedInUserData?.length > 0 ? <div className="flex flex-col gap-5">
        {allApplicationsOfTheCurrentLoggedInUserData.map((application) => {
            return (
                <ApplicationCard key={application?.id} application={application} />
            )
        })}
      </div> : <div className="gradient-title font-extrabold text-xl mt-10 sm:text-3xl text-center pb-8">
        No Applications Found
    </div>}

    </div>
  )
}

export default MyApplications;