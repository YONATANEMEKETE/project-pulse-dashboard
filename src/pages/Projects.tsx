import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, MoreVertical, Calendar, Users, Loader2, X } from 'lucide-react';
import { createProject, fetchAllprojects } from '@/lib/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import CreateProjectModal from '@/components/CreateProjectModal';
import LoadingSkeletonCard from '@/components/ProjectSkeleton';
import { projectType } from '@/types/types';

const statusColors = {
  'In Progress': 'bg-primary/10 text-primary border-primary/20',
  Planning: 'bg-accent/10 text-accent border-accent/20',
  Review: 'bg-green-100 text-green-700 border-green-200',
};

const priorityColors = {
  High: 'bg-red-100 text-red-700 border-red-200',
  Medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  Low: 'bg-gray-100 text-gray-700 border-gray-200',
};

export default function Projects() {
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);

  const [statusFilter, setStatusFilter] = useState<string>('');
  const [priorityFilter, setPriorityFilter] = useState<string>('');
  const [searchFilter, setSearchFilter] = useState<string>('');

  const {
    data: projects,
    isPending,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['projects', statusFilter, priorityFilter, searchFilter],
    queryFn: () =>
      fetchAllprojects({
        status: statusFilter as 'In Progress' | 'Planning' | 'Review',
        priority: priorityFilter as 'High' | 'Medium' | 'Low',
        search: searchFilter,
        sortBy: '',
        sortOrder: 'Asc',
      }),
  });

  const mutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setIsCreateOpen(false);
    },
  });

  const clearFilters = () => {
    setStatusFilter('');
    setPriorityFilter('');
    setSearchFilter('');
  };

  const removeFilter = (filterType: string) => {
    if (filterType === 'status') setStatusFilter('');
    if (filterType === 'priority') setPriorityFilter('');
    if (filterType === 'search') setSearchFilter('');
  };

  return (
    <div className="space-y-6 flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Projects</h1>
          <p className="text-muted-foreground mt-2">
            Manage and track all your team projects
          </p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </div>

      <div className="flex flex-wrap gap-4 items-end">
        <div className="space-y-2">
          <Label htmlFor="status-filter">Status</Label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Planning">Planning</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Review">Review</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="priority-filter">Priority</Label>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="filter by priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Low">Low</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="High">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="search-filter">Search</Label>
          <Input
            id="search-filter"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Search by name or description"
            className="w-64"
          />
        </div>
        <Button variant="outline" onClick={clearFilters}>
          Clear Filters
        </Button>
      </div>

      {(statusFilter || priorityFilter || searchFilter) && (
        <div className="flex flex-wrap gap-2">
          {statusFilter && (
            <Badge variant="secondary" className="gap-1">
              Status: {statusFilter}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => removeFilter('status')}
              />
            </Badge>
          )}
          {priorityFilter && (
            <Badge variant="secondary" className="gap-1">
              Priority: {priorityFilter}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => removeFilter('priority')}
              />
            </Badge>
          )}
          {searchFilter && (
            <Badge variant="secondary" className="gap-1">
              Search: {searchFilter}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => removeFilter('search')}
              />
            </Badge>
          )}
        </div>
      )}

      {isPending && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <LoadingSkeletonCard key={index} />
          ))}
        </div>
      )}

      {isError && (
        <div className="p-4 border border-red-200 bg-red-50 text-red-700 rounded-lg text-center space-y-10">
          <div>
            <p className="font-semibold">Error loading projects:</p>
            <p>
              {error instanceof Error
                ? error.message
                : 'Unknown error occurred'}
            </p>
          </div>
          <Button onClick={() => refetch()}>Refetch</Button>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects?.map((project: projectType) => (
          <Card
            key={project.id}
            className="shadow-sm hover:shadow-md transition-all"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{project.name}</CardTitle>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {project.description}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant="outline"
                  className={
                    statusColors[project.status as keyof typeof statusColors]
                  }
                >
                  {project.status}
                </Badge>
                <Badge
                  variant="outline"
                  className={
                    priorityColors[
                      project.priority as keyof typeof priorityColors
                    ]
                  }
                >
                  {project.priority}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium text-foreground">
                    {project.tasks.completed}/{project.tasks.total}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{
                      width: `${
                        (project.tasks.completed / project.tasks.total) * 100
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm pt-2 border-t border-border">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{project.deadline}</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{project.team}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {!isPending && projects?.length === 0 && (
        <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-xl">
          No projects found matching your filters.
        </div>
      )}

      <CreateProjectModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreate={(newProject) => mutation.mutate(newProject)}
        isSubmitting={mutation.isPending}
      />
    </div>
  );
}
