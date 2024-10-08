/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import BarLoader from "react-spinners/BarLoader";
import { useUser } from "@clerk/clerk-react";
import { State } from "country-state-city";

import useFetch from "@/hooks_for_api_calls/use_fetch";
import { getAllJobs } from "@/supabase_apis/jobs_api";
import JobCard from "@/app_components/JobCard";
import { fetchAllCompanies } from "@/supabase_apis/companies_apis";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


const JobListing = () => {

  const { isLoaded } = useUser();

  const [ location, setLocation ] = useState('');
  const [ companyId, setCompanyId ] = useState('');
  const [ searchQuery, setSearchQuery ] = useState('');

  const { 
    executeCallbackFunction: fetchAllJobsFunc,
    data: allJobsData,
    loading: loadingAllJobsData
  } = useFetch(getAllJobs, {
    location: location,
    companyId: companyId,
    searchQuery: searchQuery
  });
  

  const { 
    executeCallbackFunction: fetchCompanies,
    data: allCompanies,
  } = useFetch(fetchAllCompanies);

  
  useEffect(() => {

    if (isLoaded) {

      fetchCompanies();

    }

  }, [isLoaded]);


  useEffect(() => {

    if (isLoaded) {

      fetchAllJobsFunc();

    }

  }, [isLoaded, location, companyId, searchQuery]);



  const handleSearchFilter = (e) => {

    e.preventDefault();


    let formData = new FormData(e.target);

    const searchTextQuery = formData.get('search-query');

    if(searchTextQuery) {

      setSearchQuery(searchTextQuery);
      
    }

  }


  const clearAllFilters = () => {

    setCompanyId('');

    setLocation('');

    setSearchQuery('');

  }


  if(!isLoaded) {
    
    return <BarLoader className="mb-4" width={'100%'} color="#36d7b7" />

  }


  return (
    <div>

      <h1 className="gradient-title font-extrabold text-4xl sm:text-7xl text-center pb-8">Latest Jobs</h1>
      
      <form onSubmit={handleSearchFilter} className="h-14 flex w-full gap-2 items-center mb-3">

        <Input 
          type='text' 
          placeholder='search job by the job title...'
          name='search-query'
          className='h-full flex-1 px-4 text-md'
          required
        />

        <Button
          type='submit'
          className='h-full sm:w-28'
          variant='blue'
        >Search</Button>

      </form>


      <div className="flex flex-col sm:flex-row gap-2">

        <Select value={location} onValueChange={(value) => setLocation(value)}>

          <SelectTrigger>
            <SelectValue placeholder="filter jobs by location" />
          </SelectTrigger>

          <SelectContent>

            <SelectGroup>

              {State.getStatesOfCountry('IN').map(({name}) => (

                <SelectItem value={name} key={name}>{name}</SelectItem>

              ))}

            </SelectGroup>

          </SelectContent>

        </Select>


        <Select value={companyId} onValueChange={(value) => setCompanyId(value)}>

          <SelectTrigger>
            <SelectValue placeholder="filter jobs by company" />
          </SelectTrigger>

          <SelectContent>

            <SelectGroup>

              {allCompanies?.map(({ name, id }) => (

                <SelectItem value={id} key={name}>{name}</SelectItem>

              ))}

            </SelectGroup>

          </SelectContent>

        </Select>


        <Button 
          variant='destructive' 
          className='sm:w-1/2'
          onClick={clearAllFilters}
        >Clear all Filters</Button>

      </div>

      
      {loadingAllJobsData && <BarLoader className="mt-4" width={'100%'} color="#36d7b7" />}

      
      {loadingAllJobsData === false && <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {allJobsData?.length ? allJobsData.map((job) => (

          <JobCard key={job.id} jobData={job} fetchAllJobsAfterAJobIsDeleted={fetchAllJobsFunc} />

        )) : <div>No jobs found</div>}


      </div>}

    </div>
  )

}

export default JobListing;