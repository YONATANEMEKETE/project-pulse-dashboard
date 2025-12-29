import { projectType, TeamType } from '@/types/types';

interface projectsParams {
  status: 'In Progress' | 'Planning' | 'Review';
  priority: 'High' | 'Medium' | 'Low';
  search: string;
  sortBy: string;
  sortOrder: 'Asc' | 'Dsc';
}

interface teamParams {
  search: string;
  role: string;
  status: 'Active' | 'Inactive';
  sortBy: string;
  sortOrder: 'Asc' | 'Dsc';
}

// todo project functions

export const fetchAllprojects = async (params?: projectsParams) => {
  const queryString = new URLSearchParams(params as any).toString();

  const response = await fetch(
    `http://localhost:3001/api/projets?${queryString}`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch projects: ${response.statusText}`);
  }

  return response.json();
};

export const createProject = async (newProject: projectType) => {
  const response = await fetch('http://localhost:3001/api/projects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newProject),
  });

  if (!response.ok) throw new Error('Failed to create project');
  return response.json();
};

// todo team functions
export const fetchAllTeams = async (params?: teamParams) => {
  const query = new URLSearchParams(params as any).toString();

  const response = await fetch(`http://localhost:3001/api/team?${query}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch teams: ${response.statusText}`);
  }

  return response.json();
};

export const createTeamMember = async (
  newMember: Omit<TeamType, 'id' | 'initials' | 'projects'>
) => {
  const response = await fetch('http://localhost:3001/api/team', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newMember),
  });

  if (!response.ok) throw new Error('Failed to create team member');
  return response.json();
};
