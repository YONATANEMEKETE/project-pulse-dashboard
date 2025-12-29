export interface projectType {
  id: number;
  name: string;
  description: string;
  status: 'In Progress' | 'Planning' | 'Review';
  priority: 'High' | 'Medium' | 'Low';
  deadline: string;
  team: number;
  tasks: {
    completed: number;
    total: number;
  };
}

export interface TeamType {
  id: number;
  name: string;
  role: string;
  email: string;
  initials: string;
  projects: number;
  status: 'Active' | 'Inactive';
  avatar: string;
}
