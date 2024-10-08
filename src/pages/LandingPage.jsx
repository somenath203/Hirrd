import { Link } from "react-router-dom";
import Autoplay from "embla-carousel-autoplay";
import { useUser } from "@clerk/clerk-react";

import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem
} from "@/components/ui/carousel";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import companies from './../data/companies_data.json';
import faqs from './../data/faq.json';


const LandingPage = () => {

  const { user } = useUser();

  return (
    <main className="flex flex-col gap-10 sm:gap-20 py-10 sm:py-20">

      <section className="text-center">


        <h1 className="flex flex-col items-center justify-center gradient-title text-4xl sm:text-6xl lg:text-8xl tracking-tighter py-4 font-extrabold">
          
          Find your Dream Job 
          
          <span className="flex flex-col lg:flex-row items-center gap-2 sm:gap-6">
            
            and get 
          
            <img src="/logo.png" alt="logo" className="h-14 sm:h-24 lg:h-32" /> 
          
          </span> 
          
        </h1>


        <p className="text-gray-200 sm:mt-4 text-xl">

          Explore thousand of job listings or find the perfect candidate.

        </p>


      </section>


      {user?.unsafeMetadata?.role === 'recruiter' && <div className="flex gap-6 items-center justify-center">

        <Link to='/post-job'>

          <Button variant="destructive" size="xl" className='text-lg lg:text-2xl tracking-wider'>Post Job</Button>

        </Link>

      </div>}

      {user?.unsafeMetadata?.role === 'candidate' && <div className="flex gap-6 items-center justify-center">

        <Link to='/jobs'>

          <Button variant="blue" size="xl" className='text-lg lg:text-2xl tracking-wider'>Find Jobs</Button>

        </Link>

      </div>}

      {!user?.unsafeMetadata?.role && <div className="flex gap-6 items-center justify-center">

        <Link to='/onboarding'>

          <Button variant="destructive" size="xl" className='text-lg lg:text-2xl tracking-wider'>Get Started</Button>

        </Link>

      </div>}


      <Carousel
        plugins={[Autoplay({ delay: 2000 })]}
        className="w-full py-10"
    >
        <CarouselContent className='flex gap-5 sm:gap-20 items-center'>

          {companies.map(({ id, name, path }) => {

            return <CarouselItem key={id} className='basis-1/3 lg:basis-1/6'>

              <img src={path} alt={name} className="h-9 sm:h-14 object-contain" />

            </CarouselItem>

          })}

        </CarouselContent>

      </Carousel>


      <img src="/banner.jpeg" className="w-full" alt="banner" />


      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <Card>

          <CardHeader>

            <CardTitle className='text-center lg:text-left text-xl'>For Job Seekers</CardTitle>

          </CardHeader>

          <CardContent className='text-center lg:text-left text-lg'>

            Search and apply for jobs, track applications, and more
            
          </CardContent>

        </Card>

        <Card>

          <CardHeader>

            <CardTitle className='text-center lg:text-left text-xl'>For Employers</CardTitle>

          </CardHeader>

          <CardContent className='text-center lg:text-left text-lg'>

            Post jobs, manage applications, and find the best candidates
            
          </CardContent>

        </Card>


      </section>


      <Accordion type="single" collapsible>

        {faqs.map((faq, index) => (

          <AccordionItem key={index} value={`item-${index+1}`}>

            <AccordionTrigger>{faq.question}</AccordionTrigger>

            <AccordionContent>{faq.answer}</AccordionContent>

          </AccordionItem>

        ))}

      </Accordion>


    </main>
  )
}

export default LandingPage;