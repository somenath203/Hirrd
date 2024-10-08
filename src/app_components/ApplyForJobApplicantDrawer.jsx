/* eslint-disable react/prop-types */
import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import BarLoader from 'react-spinners/BarLoader';

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import useFetch from '@/hooks_for_api_calls/use_fetch';
import { applyToAJob } from '@/supabase_apis/apply_for_job_application_apis';


const ApplyForJobApplicantDrawer = ({
  detailsOfTheJobUserAppliedFor,
  detailsOfUserWhoAppliedForTheJob,
  fetchParticularJobAfterUserSubmittedTheApplication,
  hasUserAlreadyAppliedForTheJob,
}) => {

  const zodFormvalidationSchema = z.object({
    experience: z.number().min(0, { message: "Experience must be at least 0" }).int(),
    skills: z.string().min(1, { message: 'skill is required' }),
    education: z.enum(['Intermediate', 'Graduate', 'Post Graduate'], { message: 'education is required' }),
    resume: z.any().refine(file => file[0] && (file[0].type === 'application/pdf'), { message: 'only pdf is allowed' })
  });


  const { register, handleSubmit, control, formState: { errors }, reset } = useForm({
    resolver: zodResolver(zodFormvalidationSchema)
  });


  const {
    executeCallbackFunction: applyToAJobFunc,
    error: applyToAJobError,
    loading: loadingApplyToAJobData,
  } = useFetch(applyToAJob);


  const onSubmitForm = (data) => {

    applyToAJobFunc({
      ...data,
      job_id: detailsOfTheJobUserAppliedFor.id,
      candidate_id: detailsOfUserWhoAppliedForTheJob.id,
      name: detailsOfUserWhoAppliedForTheJob.fullName,
      status: 'applied',
      resume: data.resume[0],
    })
    .then(() => {

      fetchParticularJobAfterUserSubmittedTheApplication();

      reset();

    });

  }


  return (
    <Drawer open={hasUserAlreadyAppliedForTheJob ? false : undefined}>

      <DrawerTrigger asChild>

        <Button
          size="lg" 
          variant={detailsOfTheJobUserAppliedFor?.isJoBActive && !hasUserAlreadyAppliedForTheJob ? "blue" : "destructive"}
          disabled={!detailsOfTheJobUserAppliedFor?.isJoBActive || hasUserAlreadyAppliedForTheJob}
        >
            {detailsOfTheJobUserAppliedFor?.isJoBActive ? (hasUserAlreadyAppliedForTheJob ? "You have applied for this job" : "Apply for the Job") : "Hiring Closed"}
        </Button>

      </DrawerTrigger>

      <DrawerContent>

        <DrawerHeader>
          <DrawerTitle className="text-center">Apply for {detailsOfTheJobUserAppliedFor?.title} at {detailsOfTheJobUserAppliedFor?.company_to_which_this_job_belongs_to?.name}</DrawerTitle>
          <DrawerDescription className="text-center">Please fill the form below</DrawerDescription>
        </DrawerHeader>

        <form className='flex flex-col gap-4 p-4 pb-0' onSubmit={handleSubmit(onSubmitForm)}>
          
          <Input 
            type='number' 
            placeholder='enter the total years of exprience you have(write 0 in case of no experience)' 
            className='flex-1'
            {...register('experience', { valueAsNumber: true })}
          />
          {errors.experience && (
            <p className='text-red-500'>{errors.experience.message}</p>
          )}

          <Textarea 
            placeholder="write about your skills (comma separated)" 
            rows={4} 
            className='flex-1 !resize-none'
            {...register('skills')}
          />
          {errors.skills && (
            <p className='text-red-500'>{errors.skills.message}</p>
          )}

          
          <Controller
            name='education'
            control={control}
            render={({ field }) => (
              <RadioGroup onValueChange={field.onChange} {...field}>

                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Intermediate" id="intermediate" />
                  <Label htmlFor="intermediate">Intermediate</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Graduate" id="graduate" />
                  <Label htmlFor="graduate">Graduate</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Post Graduate" id="post-graduate" />
                  <Label htmlFor="post-graduate">Post Graduate</Label>
                </div>

              </RadioGroup>
            )}
          />
          {errors.education && (
            <p className='text-red-500'>{errors.education.message}</p>
          )}

          <Input 
            type='file' 
            accept=".pdf, .doc, .docx" 
            className='flex-1 file:text-gray-500'
            {...register('resume')}
          />
          {errors.resume && (
            <p className='text-red-500'>{errors.resume.message}</p>
          )}

          {applyToAJobError?.message && (
            <p className='text-red-500'>{applyToAJobError?.message}</p>
          )}

          {loadingApplyToAJobData && <BarLoader className="mb-4" width={'100%'} color="#36d7b7" />}

          <Button disabled={loadingApplyToAJobData} type="submit" variant="blue" size="lg">Submit Application</Button>

        </form>
        
        <DrawerFooter>

          <DrawerClose asChild>
            <Button disabled={loadingApplyToAJobData} variant="outline">Cancel</Button>
          </DrawerClose>

        </DrawerFooter>

      </DrawerContent>

    </Drawer>
  );
};

export default ApplyForJobApplicantDrawer;
