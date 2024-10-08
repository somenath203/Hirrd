/* eslint-disable no-undef */
import supabaseClient from '@/supabase';
import { v4 as uuidv4 } from 'uuid';

import { supabaseUrl } from '@/supabase';


export const fetchAllCompanies = async (token) => {

    try {
        
        const supabase = await supabaseClient(token);

        const { data, error } = await supabase
                                      .from('companies')
                                      .select('*');

        
        if (error) {

            console.error('error fetching companies: ', error);

            return null;

        }

        return data;

    } catch (error) {
        
        console.log(error);
        
    }

}



export const createNewCompany = async (token, _, companyData) => {

    try {
        
        const supabase = await supabaseClient(token);


        const uploadedCompanyLogoFileName = `logo-${uuidv4()}-${companyData[0].name}`;

        const { error: storageError } = await supabase.storage.from('company_logos').upload(uploadedCompanyLogoFileName, companyData[0].logo);

        if(storageError) {

            console.log(storageError);

            console.log('error uploading company logo on the supabase storage');

            return null;

        }

        const urlOfTheUploadedCompanyLogo = `${supabaseUrl}/storage/v1/object/public/company_logos/${uploadedCompanyLogoFileName}`;


        const { data, error } = await supabase
                                      .from('companies')
                                      .insert([{
                                        name: companyData[0].name,
                                        logo_url: urlOfTheUploadedCompanyLogo
                                      }])
                                      .select();


        if (error) {

            console.error('error creating company: ', error);

            return null;

        }


        return data;

    } catch (error) {
        
        console.log(error);
        
    }

}