import { useState } from "react";
import { useSession } from "@clerk/clerk-react";


const useFetch = (callbackFunction, options = {}) => {

  const { session } = useSession();


  const [data, setData] = useState(null);

  const [loading, setLoading] = useState();

  const [error, setError] = useState(null);


  const executeCallbackFunction = async (...args) => {

    setLoading(true);

    setError(null);


    try {

      const acccessTokenForSupabaseFromClerk = await session.getToken({
        template: 'supabase'
      });
      

      const response = await callbackFunction(acccessTokenForSupabaseFromClerk, options, args);

      
      setData(response);

      setError(null);

    } catch (error) {

      setError(error);

    } finally {

      setLoading(false);

    }

  };


  return { data, loading, error, executeCallbackFunction };

};


export default useFetch;