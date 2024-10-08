import supabaseClient from '@/supabase';


export const getAllJobs = async (token, { location, companyId, searchQuery }) => {

  try {

    const supabase = await supabaseClient(token);

    let allJobs = supabase
      .from('jobs')
      .select(
        '*, company_to_which_this_job_belongs_to:companies(name, logo_url)'
      );

    if (location) {

      allJobs = allJobs.eq('location', location);

    }

    if (companyId) {

      allJobs = allJobs.eq('company_id', companyId);

    }

    if (searchQuery) {

      allJobs = allJobs.ilike('title', `%${searchQuery}%`);

    }


    const { data, error } = await allJobs;

    if (error) {

      console.log('error fetching jobs: ', error);

      return null;

    }

    return data;

  } catch (error) {

    console.log(error);

  }

};


export const getParticularJob = async (token, { job_id }) => {

  try {

    const supabase = await supabaseClient(token);

    const { data, error } = await supabase
                                  .from('jobs')
                                  .select('*, company_to_which_this_job_belongs_to:companies(name, logo_url), all_applications_of_the_job: applications(*)')
                                  .eq('id', job_id)
                                  .single();


    if (error) {

      console.log('error fetching a particular job: ', error);

      return null;

    }

    
                              
    return data;
    
  } catch (error) {
    
    console.log(error);

  }

}


export const createNewJob = async (token, _, jobData) => {

  try {

    const supabase = await supabaseClient(token);

    const { data, error } = await supabase
                                  .from('jobs')
                                  .insert([{
                                    recruiter_id: jobData[0].recruiter_id,
                                    title: jobData[0].title,
                                    company_id: jobData[0].company_id,
                                    description: jobData[0].description,
                                    location: jobData[0].location,
                                    requirements: jobData[0].requirements,
                                    isJoBActive: jobData[0].isJoBActive
                                  }])
                                  .select();


    if (error) {

      console.log('error creating a particular job: ', error);

      return null;

    }
                            

    return data;
    
    
  } catch (error) {
    
    console.log(error);

  }

}


export const updateHiringStatusOfAJob = async (token, { job_id }, isJobActive) => {

  try {

    const supabase = await supabaseClient(token);

    const { data, error } = await supabase
                                  .from('jobs')
                                  .update({ isJoBActive: isJobActive[0]})
                                  .eq('id', job_id)
                                  .select();


    if (error) {

      console.log('error updating job status: ', error);

      return null;
      
    }
                              
    return data;
    
  } catch (error) {
    
    console.log(error);

  }

}


export const getAllJobsOfTheCurrentlyLoggedInRecruiter = async (token, { recruiter_id }) => {

  try {

    const supabase = await supabaseClient(token);

    let allJobs = supabase
      .from('jobs')
      .select(
        '*, company_to_which_this_job_belongs_to:companies(name, logo_url)'
      )
      .eq('recruiter_id', recruiter_id);


    const { data, error } = await allJobs;

    if (error) {

      console.log('error fetching jobs of the currently logged in user: ', error);

      return null;

    }

    return data;

  } catch (error) {

    console.log(error);

  }

};


export const deleteJob = async (token, { job_id }) => {

  try {

    const supabase = await supabaseClient(token);

    const { data, error } = await supabase
                            .from('jobs')
                            .delete()
                            .eq('id', job_id)
                            .select();

    if (error) {

      console.log('error deleting job of the currently logged in user: ', error);
  
      return null;
  
    }

    return data;
    
  } catch (error) {
    
    console.log(error);

  }

}