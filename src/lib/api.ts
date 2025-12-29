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

export const fetchAllprojects = async (params?: projectsParams) => {
  const queryString = new URLSearchParams(params as any).toString();

  const response = await fetch(
    `http://localhost:3001/api/projects?${queryString}`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch projects: ${response.statusText}`);
  }

  return response.json();
};

export const fetchAllTeams = async (params?: teamParams) => {
  const query = new URLSearchParams(params as any).toString();

  const response = await fetch(`http://localhost:3001/api/team?${query}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch teams: ${response.statusText}`);
  }

  return response.json();
};
