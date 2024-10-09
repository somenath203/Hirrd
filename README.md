# Hirrd

## Demo video of the overall project

![Screenshot (726)](https://github.com/user-attachments/assets/154ed610-389d-4c89-beb2-1e9a3c9a99bf)

https://www.youtube.com/watch?v=kIlSobvizAM

## Introduction

**Hirrd** is a full-stack job portal designed to make job applications and recruitment easier for both applicants and recruiters. Job seekers can apply for jobs, track their application status, and view the history of all their applications. On the other hand, recruiters can create job posts, manage applicants, and track the hiring process with ease.

## Features of the Application

### For Applicants:
- **Apply for Jobs:** Applicants can apply for job listings posted by various companies.
- **Track Applications:** View all the jobs applied for and check the status of each application.
  - Statuses include: `Rejected`, `Interviewing`, or `Hired`.
- **Application History:** Access detailed information about each application, including job descriptions and the application status.

### For Recruiters:
- **Create Job Postings:** Recruiters can add new job listings to attract potential candidates.
- **Company Management:** Add new companies to the platform for job postings.
- **View Applicants:** Check the details of every applicant who applied to a job posted by the recruiter.
- **Update Application Status:** Update the status of a specific applicant’s job application to reflect their progress i.e. `Rejected`, `Interviewing`, or `Hired`.
- **Delete Job Posts:** Remove any job posts that are no longer relevant or active.
- **Manage Job Listings:** View a detailed list of all the jobs created by the recruiter.

## Technologies Used

- **React (via Vite)**: The frontend framework used to build the application.
- **TailwindCSS:** A utility-first CSS framework that ensures the design is responsive, modern, and easy to customize.
- **ShadCN UI:** A component library integrated to enhance the user interface with accessible and reusable components.
- **Supabase:** A backend service for managing the database and handling application data like job posts and applicant information.
- **Clerk Authentication:** A secure authentication solution that allows users (both applicants and recruiters) to sign in and manage their accounts.
- **React-Hook-Form:** A lightweight library used to manage forms and handle form validation with ease.
- **Zod:** A validation library used for ensuring data integrity by validating input forms before submission.

## Deployment

The project **Hirrd** is deployed on Vercel.

Here is the deployment link: https://hirrd-som.vercel.app/
