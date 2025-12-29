import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, MoreVertical, Calendar, Users, Loader2 } from 'lucide-react';
import { fetchAllprojects } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
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
  const {
    data: projects,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ['projects'],
    queryFn: () => fetchAllprojects(),
  });

  // console.log('projects', projects);
  return (
    <div className="space-y-6 flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Projects</h1>
          <p className="text-muted-foreground mt-2">
            Manage and track all your team projects
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </div>

      {/* Loading State */}
      {isPending && (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="mt-2 text-muted-foreground">Loading projects...</p>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="p-4 border border-red-200 bg-red-50 text-red-700 rounded-lg">
          <p className="font-semibold">Error loading projects:</p>
          <p>
            {error instanceof Error ? error.message : 'Unknown error occurred'}
          </p>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects?.map((project: any) => (
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

      {/* Empty State */}
      {!isPending && projects?.length === 0 && (
        <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-xl">
          No projects found matching your filters.
        </div>
      )}
    </div>
  );
}
