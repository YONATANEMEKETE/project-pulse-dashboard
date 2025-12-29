import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Mail, MoreVertical } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchAllTeams } from '@/lib/api';
import { TeamType } from '@/types/types';

export default function Team() {
  const {
    data: teamMembers,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ['teams'],
    queryFn: () => fetchAllTeams(),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Team</h1>
          <p className="text-muted-foreground mt-2">
            {teamMembers.length} members in your team
          </p>
        </div>
        <Button className="gap-2">
          <Mail className="h-4 w-4" />
          Invite Member
        </Button>
      </div>

      {/* Loading State */}
      {isPending && (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="mt-2 text-muted-foreground">Loading team members...</p>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="p-4 border border-red-200 bg-red-50 text-red-700 rounded-lg">
          <p className="font-semibold">Error loading team members:</p>
          <p>
            {error instanceof Error ? error.message : 'Unknown error occurred'}
          </p>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {teamMembers.map((member: TeamType) => (
          <Card
            key={member.id}
            className="shadow-sm hover:shadow-md transition-all"
          >
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <Avatar className={`h-14 w-14 ${member.avatar}`}>
                  <AvatarFallback className="text-white text-lg font-semibold">
                    {member.initials}
                  </AvatarFallback>
                </Avatar>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-lg text-foreground">
                    {member.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>{member.email}</span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Projects: </span>
                    <span className="font-semibold text-foreground">
                      {member.projects}
                    </span>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-green-100 text-green-700 border-green-200"
                  >
                    {member.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {!isPending && teamMembers?.length === 0 && (
        <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-xl">
          No projects found matching your filters.
        </div>
      )}
    </div>
  );
}
