import { v4 as uuidv4 } from 'uuid';

import supabaseClient from '@/supabase';
import { supabaseUrl } from '@/supabase';


export const applyToAJob = async (token, _, jobApplicationDataOfCandidate) => {

    try {
        
        const supabase = await supabaseClient(token);


        const uploadedResumeFileName = `resume-${uuidv4()}-${jobApplicationDataOfCandidate[0].candidate_id}`;

        const { error: storageError } = await supabase.storage.from('resumes').upload(uploadedResumeFileName, jobApplicationDataOfCandidate[0].resume);

        if(storageError) {

            console.log('error uploading resume on the supabase storage');

            return null;

        }


        const urlOfTheUploadedResume = `${supabaseUrl}/storage/v1/object/public/resumes/${uploadedResumeFileName}`;

        const { data, error: uploadApplicantDataError } = await supabase
            .from('applications')
            .insert([{
                job_id: jobApplicationDataOfCandidate[0].job_id,
                candidate_id: jobApplicationDataOfCandidate[0].candidate_id,
                status: jobApplicationDataOfCandidate[0].status,
                resume: urlOfTheUploadedResume,  // Correctly mapping to `resume`
                skills: jobApplicationDataOfCandidate[0].skills,
                experience: jobApplicationDataOfCandidate[0].experience,
                education: jobApplicationDataOfCandidate[0].education,
                name: jobApplicationDataOfCandidate[0].name
            }])
            .select();
        

        
        if(uploadApplicantDataError) {

            console.log(uploadApplicantDataError);

            console.log("error uploading applicant data on supabase");
            
            return null;

        }


        return data;
        

    } catch (error) {
        
        console.log(error);
        
    }

}


export const updateApplicationStatus = async (token, { candidate_id }, status) => {

    try {
        
        const supabase = await supabaseClient(token);


        const { data, error } = await supabase
                                      .from('applications')
                                      .update({ status: status[0] })
                                      .eq('candidate_id', candidate_id)
                                      .select();

        
        if (error) {

            console.error('error updating applicant status', error);

            return null;

        }

        return data;

    } catch (error) {
        
        console.log(error);

    }

}


export const getAllApplicationsOfTheCurrentAuthenticatedCandidate = async (token, { user_id }) => {

    try {

        const supabase = await supabaseClient(token);

        const { data, error } = await supabase
                         .from('applications')
                         .select('*, job_to_which_the_application_belongs_to:jobs(title, company_to_which_this_job_belongs_to:companies(name))')
                         .eq('candidate_id', user_id);

        
        if (error) {

            console.error('error fetching all applications of the current logged in user', error);
                
            return null;
                
        }
                
        return data;

        
    } catch (error) {
        
        console.log(error);

    }

}