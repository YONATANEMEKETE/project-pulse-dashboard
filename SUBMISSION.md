# Submission Notes

## What I Implemented

I implemented all the required features outlined in the assessment, focusing on clean data integration, reusable architecture, and a smooth user experience.

### API Integration

- Integrated **Projects** and **Team Members** pages with the backend API.
- Replaced all static/mock data with real API data.
- Created reusable **API utility functions** to handle requests and keep the codebase clean.
- Properly handled **loading, error, and success states** for all API interactions.

### Projects Page

- Integrated reading projects from the API.
- Implemented **Add New Project** functionality with API integration.
- Added **filtering functionality** for projects.
- Implemented **refetch functionality** to refresh the projects list when needed.
- Improved loading UI using **Skeleton components**.
- Handled empty, loading, and error states gracefully.

### Team Members Page

- Integrated fetching team members from the API.
- Implemented **search functionality** to filter team members.
- Integrated **Invite Team Member** feature.
- Ensured the team members list updates correctly after inviting a new member.
- Improved loading UI using Skeleton components.
- Handled loading, error, and success states consistently.

### UI & UX Improvements

- Implemented reusable Skeleton components for loading states on both Projects and Team pages.
- Improved feedback for API states to ensure a smooth user experience.
- Maintained consistent behavior across refetches and mutations.

---

## What I Didn’t Get To

- Edit and delete functionality for projects and team members.
- Pagination for larger data sets.
- Optimistic UI updates for mutations.
- Additional accessibility improvements.

These were deprioritized to ensure the core requested features were completed with good quality within the given time.

---

## How to Test the Features

1. **Start the backend**
   ```bash
   cd server
   npm install
   npm run dev
   ```
2. **Start the frontend**
   ```
   npm install
   npm run dev
   ```

**Projects Page**

- Navigate to the Projects page.

- Verify projects are fetched from the API.

- Test filtering functionality.

- Add a new project and confirm it appears in the list.

- Trigger refetch and verify data updates correctly.

**Team Members Page**

- Navigate to the Team Members page.

- Use the search input to filter team members.

- Invite a new team member and confirm it appears in the list.

**Loading & Error States**

- Observe skeleton loaders during data fetching.

- Stop the backend server to verify error handling UI.

---

Thank you for reviewing my submission. I focused on delivering the required features with clarity, maintainability, and a good user experience.
